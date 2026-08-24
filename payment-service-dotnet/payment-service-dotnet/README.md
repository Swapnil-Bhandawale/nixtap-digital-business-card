# payment-service (.NET / ASP.NET Core version)

This is a from-scratch ASP.NET Core 8 rewrite of `payment-service`, functionally
identical to the Spring Boot version — same wire contract, same endpoints, same
reliability behaviors (idempotent verification, retry+outbox on the digital-card
callback, rotatable shared secret). digital-card doesn't need any changes to
talk to this instead of the Java version; it just needs `payment.service.base-url`
pointed at wherever this is running.

**Only one of the two payment-service implementations should be running at a
time** for a given digital-card instance — they're two implementations of the
same service, not two different services.

## Stack

- ASP.NET Core 8 Web API (Controllers, not Minimal APIs — for easier side-by-side
  reading against the Spring Boot MVC controllers)
- EF Core 8 + Pomelo.EntityFrameworkCore.MySql (same MySQL choice as the rest
  of the platform)
- Razorpay integration via direct HTTP calls (Basic Auth + REST), **not** the
  official Razorpay .NET SDK — done deliberately to avoid pinning to a NuGet
  package I couldn't verify in this environment (see Known gaps below)
- `BackgroundService` workers instead of Quartz.NET/Hangfire, to keep the
  dependency footprint minimal

## Project layout

```
Entities/       Payment, Subscription, FailedPlanSync
Data/           PaymentDbContext (EF Core)
Dtos/           PaymentContracts.cs — the wire contract, JSON property names
                explicitly pinned to match the Java side exactly
Services/       IPaymentOrderService / PaymentOrderService (core logic),
                IDigitalCardClient / DigitalCardClient (outbound callback)
Workers/        SubscriptionExpiryWorker (daily), PlanSyncReconciliationWorker (hourly)
Controllers/    InternalOrdersController, InternalSubscriptionsController
Middleware/     InternalApiKeyMiddleware, ExceptionHandlingMiddleware
```

## Endpoints (all internal — gated by X-Internal-Api-Key, never call these from a browser)

| Method | Path | Purpose |
|---|---|---|
| POST | `/internal/orders` | Create a Razorpay order for a plan upgrade |
| POST | `/internal/orders/verify` | Verify payment signature, activate subscription |
| GET | `/internal/subscriptions/active-count` | Used by digital-card's admin stats |
| GET | `/internal/subscriptions/failed-plan-syncs-count` | Outbox visibility |

## Configuration (`appsettings.json`)

- `ConnectionStrings:PaymentDb` — MySQL connection string. Uses its own
  database (`payment_service_dotnet_db`), separate from both digital-card's
  DB and the Java payment-service's DB.
- `Razorpay:KeyId` / `Razorpay:KeySecret` — real TEST keys from the
  [Razorpay dashboard](https://dashboard.razorpay.com/app/keys).
- `DigitalCardService:BaseUrl` — where digital-card is running (`http://localhost:8080` by default).
- `InternalApiKey` — **must match digital-card's `internal.api-key` exactly**
  (comma-separated list supported for rotation, same as the Java version).
- `Urls` — set to `http://localhost:8082` by default, so it doesn't collide
  with the Java payment-service on 8081 if you ever run both side by side.

## Running it

```bash
cd payment-service-dotnet
dotnet restore
dotnet run
```

The DB and tables are created automatically on first run via
`Database.EnsureCreated()` — no `dotnet ef migrations` step needed to get
started (see the Known gaps section for the tradeoff this makes).

## Known gaps / honesty check

I don't have the .NET SDK or NuGet access in the sandbox I'm working in, so
**this has never been compiled or run** — unlike the Java version, where I at
least know the ecosystem cold, I'd treat this one as a first draft to build
and fix compile errors against, not something to trust blindly. Specific
places I'd double-check first if `dotnet build` complains:
- `HttpClient.PatchAsJsonAsync` — this extension exists in
  `System.Net.Http.Json` since .NET 5, but worth confirming the exact using
  directive resolves cleanly in your SDK version.
- Pomelo package version pinned to `8.0.2` — check NuGet for whatever the
  latest 8.x patch is when you actually restore; I picked a plausible version
  number, not one I could verify is published.
- `ServerVersion.AutoDetect(connectionString)` requires the MySQL server to
  actually be reachable at restore/first-run time to detect its version —
  if that's inconvenient, pin an explicit `ServerVersion.Create(...)` instead.

Other gaps, same as flagged on the Java version and not yet solved here either:
- `EnsureCreated()` doesn't support incremental schema changes — fine for a
  first run, but switch to EF Core Migrations before iterating on the schema.
- No idempotency/rate limiting beyond what's described above.
- Static shared secret, rotation is manual (same caveat as everywhere else in
  this project).
- No tests.

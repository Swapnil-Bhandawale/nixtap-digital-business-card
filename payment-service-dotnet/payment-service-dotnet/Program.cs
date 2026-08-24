using System.Net.Http.Headers;
using System.Text;
using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Middleware;
using PaymentService.Services;
using PaymentService.Workers;

var builder = WebApplication.CreateBuilder(args);

// ---------- MVC / Controllers ----------
builder.Services.AddControllers();

// ---------- Database (separate DB from digital-card, and from the Java
// payment-service too — this .NET version owns its own schema) ----------
var connectionString = builder.Configuration.GetConnectionString("PaymentDb")
    ?? throw new InvalidOperationException("ConnectionStrings:PaymentDb is not configured");

builder.Services.AddDbContext<PaymentDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// ---------- Outbound HTTP clients ----------
var digitalCardBaseUrl = builder.Configuration["DigitalCardService:BaseUrl"]
    ?? throw new InvalidOperationException("DigitalCardService:BaseUrl is not configured");
var connectTimeoutMs = builder.Configuration.GetValue<int>("DigitalCardService:ConnectTimeoutMs", 3000);
var readTimeoutMs = builder.Configuration.GetValue<int>("DigitalCardService:ReadTimeoutMs", 5000);

// internal.api-key may hold a comma-separated list during a key rotation
// (see InternalApiKeyMiddleware); outbound calls always use the FIRST entry —
// that's the "current" key.
var rawApiKeys = builder.Configuration["InternalApiKey"] ?? string.Empty;
var currentInternalApiKey = rawApiKeys.Split(',')[0].Trim();

builder.Services.AddHttpClient<IDigitalCardClient, DigitalCardClient>(client =>
{
    client.BaseAddress = new Uri(digitalCardBaseUrl);
    client.Timeout = TimeSpan.FromMilliseconds(connectTimeoutMs + readTimeoutMs);
    client.DefaultRequestHeaders.Add("X-Internal-Api-Key", currentInternalApiKey);
});

// Named client for the Razorpay REST API (called directly via HTTP rather
// than through an SDK, to keep this project's dependency footprint small
// and avoid pinning to an unverified NuGet package version).
var razorpayKeyId = builder.Configuration["Razorpay:KeyId"] ?? string.Empty;
var razorpayKeySecret = builder.Configuration["Razorpay:KeySecret"] ?? string.Empty;
var basicAuthValue = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{razorpayKeyId}:{razorpayKeySecret}"));

builder.Services.AddHttpClient("RazorpayClient", client =>
{
    client.BaseAddress = new Uri("https://api.razorpay.com");
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicAuthValue);
});

// ---------- Application services ----------
builder.Services.AddScoped<IPaymentOrderService, PaymentOrderService>();

// ---------- Background workers (equivalent of Spring's @Scheduled jobs) ----------
builder.Services.AddHostedService<SubscriptionExpiryWorker>();
builder.Services.AddHostedService<PlanSyncReconciliationWorker>();

var app = builder.Build();

// Auto-create tables on startup (equivalent of the Java service's
// spring.jpa.hibernate.ddl-auto=update, for local/dev convenience). This does
// NOT handle incremental schema changes on an existing DB — switch to EF Core
// Migrations ("dotnet ef migrations add ...") before this goes anywhere real.
using (var scope = app.Services.CreateScope())
{
    // Apply EF Core migrations automatically (replaces EnsureCreated for production readiness)
    var db = scope.ServiceProvider.GetRequiredService<PaymentDbContext>();
    db.Database.Migrate();
}

// ---------- Middleware pipeline ----------
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<InternalApiKeyMiddleware>(); // whole service is internal-only
app.MapControllers();

app.Run();

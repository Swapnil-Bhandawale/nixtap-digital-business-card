using System.Text.Json;

namespace PaymentService.Middleware;

/// <summary>
/// This entire service is internal-only (called by digital-card, never by a
/// browser), so every request must carry the shared secret.
///
/// InternalApiKey (config) accepts a COMMA-SEPARATED list so a key can be
/// rotated without downtime: add the new key to both services' lists, roll
/// both, then remove the old key from both lists.
/// </summary>
public class InternalApiKeyMiddleware
{
    private const string HeaderName = "X-Internal-Api-Key";

    private readonly RequestDelegate _next;
    private readonly HashSet<string> _validKeys;

    public InternalApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        var raw = configuration["InternalApiKey"] ?? string.Empty;
        _validKeys = raw.Split(',')
            .Select(k => k.Trim())
            .Where(k => k.Length > 0)
            .ToHashSet();
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Allow public payment endpoints (proxied via Gateway which does JWT validation)
        if (context.Request.Path.StartsWithSegments("/api/v1/payment"))
        {
            await _next(context);
            return;
        }

        var providedKey = context.Request.Headers[HeaderName].FirstOrDefault();

        if (providedKey is null || !_validKeys.Contains(providedKey))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            var body = JsonSerializer.Serialize(new { success = false, message = "Invalid or missing internal API key" });
            await context.Response.WriteAsync(body);
            return;
        }

        await _next(context);
    }
}

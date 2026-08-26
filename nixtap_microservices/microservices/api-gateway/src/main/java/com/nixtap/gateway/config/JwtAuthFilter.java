package com.nixtap.gateway.config;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Gateway-level JWT filter.
 * Validates token and forwards userId + role as headers to downstream services.
 * Downstream services trust these headers (internal network only).
 */
@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    private final SecretKey signingKey;

    public JwtAuthFilter(@Value("${nixtap.jwt.secret}") String secret) {
        super(Config.class);
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            if (exchange.getRequest().getMethod().name().equalsIgnoreCase("OPTIONS")) {
                return chain.filter(exchange);
            }

            String authHeader = exchange.getRequest().getHeaders()
                    .getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("JWT Filter: Missing or invalid Authorization header");
                return unauthorized(exchange);
            }

            String token = authHeader.substring(7);
            try {
                var claims = Jwts.parser()
                        .verifyWith(signingKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String userId = claims.getSubject();
                String role   = claims.get("role", String.class);
                String email  = claims.get("email", String.class);

                // Forward user identity to downstream services as trusted headers
                var mutated = exchange.getRequest().mutate()
                        .headers(headers -> {
                            headers.remove("X-User-Id");
                            headers.remove("X-User-Role");
                            headers.remove("X-User-Email");
                        })
                        .header("X-User-Id", userId)
                        .header("X-User-Role", role)
                        .header("X-User-Email", email != null ? email : "")
                        .build();

                return chain.filter(exchange.mutate().request(mutated).build());

            } catch (JwtException | IllegalArgumentException e) {
                return unauthorized(exchange);
            }
        };
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    public static class Config {}
}

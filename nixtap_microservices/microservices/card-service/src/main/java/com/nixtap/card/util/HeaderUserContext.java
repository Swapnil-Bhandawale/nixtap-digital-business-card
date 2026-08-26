package com.nixtap.card.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * In microservices, userId comes from the API Gateway as X-User-Id header
 * (injected after JWT validation). This replaces SecurityContextHolder.
 */
@Component
public class HeaderUserContext {
    public Long getCurrentUserId() {
        ServletRequestAttributes attrs =
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) throw new IllegalStateException("No request context");
        String userId = attrs.getRequest().getHeader("X-User-Id");
        if (userId == null) throw new IllegalStateException("X-User-Id header missing");
        return Long.parseLong(userId);
    }
}

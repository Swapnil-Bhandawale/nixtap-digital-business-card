package com.nixtap.engagement.util;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class HeaderUserContext {
    public Long getCurrentUserId() {
        ServletRequestAttributes attrs =
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) throw new IllegalStateException("No request context");
        String userId = attrs.getRequest().getHeader("X-User-Id");
        if (userId == null) throw new IllegalStateException("X-User-Id header missing. Unauthorized.");
        return Long.parseLong(userId);
    }
}

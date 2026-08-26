package com.nixtap.engagement.exception;
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) { super(message); }
    public ResourceNotFoundException(String r, String f, Object v) {
        super(String.format("%s not found with %s: '%s'", r, f, v));
    }
}

package com.nixtap.card.exception;
import com.nixtap.card.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), req);
    }
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateResourceException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), req);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fe = new HashMap<>();
        for (FieldError f : ex.getBindingResult().getFieldErrors()) fe.put(f.getField(), f.getDefaultMessage());
        return ResponseEntity.badRequest().body(
            ErrorResponse.ofValidation(400, "Validation Failed", "One or more fields are invalid", req.getRequestURI(), fe));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "An unexpected error occurred.", req);
    }
    private ResponseEntity<ErrorResponse> build(HttpStatus s, String e, String m, HttpServletRequest req) {
        return ResponseEntity.status(s).body(ErrorResponse.of(s.value(), e, m, req.getRequestURI()));
    }
}

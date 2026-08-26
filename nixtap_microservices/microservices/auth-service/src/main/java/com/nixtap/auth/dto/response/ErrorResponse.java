package com.nixtap.auth.dto.response;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;
@Getter @NoArgsConstructor @AllArgsConstructor
public class ErrorResponse {
    private boolean success;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> fieldErrors;
    private LocalDateTime timestamp;
    public static ErrorResponse of(int status, String error, String message, String path) {
        return new ErrorResponse(false, status, error, message, path, null, LocalDateTime.now());
    }
    public static ErrorResponse ofValidation(int s, String e, String m, String p, Map<String,String> fe) {
        return new ErrorResponse(false, s, e, m, p, fe, LocalDateTime.now());
    }
}

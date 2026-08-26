package com.nixtap.engagement.dto.response;
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

    public static ErrorResponse of(int s, String e, String m, String p) {
        return new ErrorResponse(false, s, e, m, p, null, LocalDateTime.now());
    }
    public static ErrorResponse ofValidation(int s, String e, String m, String p, Map<String,String> fe) {
        return new ErrorResponse(false, s, e, m, p, fe, LocalDateTime.now());
    }
}

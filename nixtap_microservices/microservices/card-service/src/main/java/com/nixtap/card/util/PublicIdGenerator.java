package com.nixtap.card.util;
import com.nixtap.card.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.security.SecureRandom;

@Component @RequiredArgsConstructor
public class PublicIdGenerator {
    private static final String CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final int LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();
    private final CardRepository cardRepository;

    public String generate() {
        for (int i = 0; i < 5; i++) {
            String candidate = randomString();
            if (!cardRepository.existsByPublicId(candidate)) return candidate;
        }
        return randomString() + Long.toHexString(System.currentTimeMillis()).substring(6);
    }

    private String randomString() {
        StringBuilder sb = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        return sb.toString();
    }
}

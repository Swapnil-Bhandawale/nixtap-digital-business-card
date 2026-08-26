package com.nixtap.card.controller;

import com.nixtap.card.dto.response.ApiResponse;
import com.nixtap.card.entity.CardTemplate;
import com.nixtap.card.repository.CardTemplateRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/templates")
@RequiredArgsConstructor
public class TemplateController {
    private final CardTemplateRepository templateRepo;

    @GetMapping
    @Operation(summary = "List all active templates")
    public ResponseEntity<ApiResponse<List<CardTemplate>>> listTemplates() {
        return ResponseEntity.ok(ApiResponse.success(templateRepo.findByIsActiveTrueOrderByIdAsc()));
    }
}

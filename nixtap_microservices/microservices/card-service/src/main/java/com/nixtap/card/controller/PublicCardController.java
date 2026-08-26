package com.nixtap.card.controller;

import com.nixtap.card.dto.response.*;
import com.nixtap.card.service.CardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/cards")
@RequiredArgsConstructor
@Tag(name = "Public Cards")
public class PublicCardController {

    private final CardService cardService;

    @GetMapping("/{slugOrId}")
    @Operation(summary = "Resolve public card by slug or publicId")
    public ResponseEntity<ApiResponse<CardResponse>> resolve(@PathVariable String slugOrId) {
        return ResponseEntity.ok(ApiResponse.success(
                cardService.resolvePublicCard(slugOrId)));
    }
}

package com.nixtap.card.controller;

import com.nixtap.card.dto.request.*;
import com.nixtap.card.dto.response.*;
import com.nixtap.card.service.CardService;
import com.nixtap.card.util.HeaderUserContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cards")
@RequiredArgsConstructor
@Tag(name = "Cards")
public class CardController {

    private final CardService cardService;
    private final HeaderUserContext userContext;

    @PostMapping
    @Operation(summary = "Create card")
    public ResponseEntity<ApiResponse<CardResponse>> create(
            @Valid @RequestBody CardCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Card created successfully",
                        cardService.createCard(userContext.getCurrentUserId(), req)));
    }

    @GetMapping
    @Operation(summary = "List my cards")
    public ResponseEntity<ApiResponse<List<CardResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(
                cardService.getMyCards(userContext.getCurrentUserId())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get card by id")
    public ResponseEntity<ApiResponse<CardResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                cardService.getMyCardById(userContext.getCurrentUserId(), id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update card")
    public ResponseEntity<ApiResponse<CardResponse>> update(
            @PathVariable Long id, @Valid @RequestBody CardUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Card updated successfully",
                cardService.updateCard(userContext.getCurrentUserId(), id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete card")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        cardService.deleteCard(userContext.getCurrentUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("Card deleted successfully", null));
    }
}

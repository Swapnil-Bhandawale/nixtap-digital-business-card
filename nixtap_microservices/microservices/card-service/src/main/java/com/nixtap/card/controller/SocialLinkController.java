package com.nixtap.card.controller;

import com.nixtap.card.dto.request.SocialLinkRequest;
import com.nixtap.card.dto.response.*;
import com.nixtap.card.service.SocialLinkService;
import com.nixtap.card.util.HeaderUserContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cards/{cardId}/social-links")
@RequiredArgsConstructor
@Tag(name = "Social Links")
public class SocialLinkController {

    private final SocialLinkService socialLinkService;
    private final HeaderUserContext userContext;

    @PostMapping
    @Operation(summary = "Add social link to card")
    public ResponseEntity<ApiResponse<SocialLinkResponse>> add(
            @PathVariable Long cardId,
            @Valid @RequestBody SocialLinkRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Social link added",
                        socialLinkService.addLink(userContext.getCurrentUserId(), cardId, req)));
    }

    @GetMapping
    @Operation(summary = "List social links")
    public ResponseEntity<ApiResponse<List<SocialLinkResponse>>> list(@PathVariable Long cardId) {
        return ResponseEntity.ok(ApiResponse.success(
                socialLinkService.getLinks(userContext.getCurrentUserId(), cardId)));
    }

    @DeleteMapping("/{linkId}")
    @Operation(summary = "Remove social link")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long cardId, @PathVariable Long linkId) {
        socialLinkService.deleteLink(userContext.getCurrentUserId(), cardId, linkId);
        return ResponseEntity.ok(ApiResponse.success("Social link removed", null));
    }
}

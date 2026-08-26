package com.nixtap.card.service.impl;

import com.nixtap.card.dto.request.*;
import com.nixtap.card.dto.response.*;
import com.nixtap.card.entity.*;
import com.nixtap.card.exception.*;
import com.nixtap.card.repository.*;
import com.nixtap.card.service.CardService;
import com.nixtap.card.service.impl.util.*;
import com.nixtap.card.util.PublicIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final CardTemplateRepository templateRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final PublicIdGenerator publicIdGenerator;
    private final QrCodeGenerator qrCodeGenerator;
    private final VCardGenerator vCardGenerator;
    private final ImageService imageService;

    private static final int MAX_CARDS_PER_USER = 10;

    @Override
    @Transactional
    public CardResponse createCard(Long userId, CardCreateRequest req) {
        if (cardRepository.countByUserId(userId) >= MAX_CARDS_PER_USER) {
            throw new DuplicateResourceException("Card limit reached (max " + MAX_CARDS_PER_USER + ")");
        }
        CardTemplate template = templateRepository.findById(req.getTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("Template", "id", req.getTemplateId()));

        if (req.getCustomSlug() != null && !req.getCustomSlug().isBlank()
                && cardRepository.existsByCustomSlug(req.getCustomSlug())) {
            throw new DuplicateResourceException("Slug '" + req.getCustomSlug() + "' is already taken");
        }

        Card card = Card.builder()
                .userId(userId)
                .template(template)
                .publicId(publicIdGenerator.generate())
                .customSlug(blankToNull(req.getCustomSlug()))
                .fullName(req.getFullName())
                .jobTitle(req.getJobTitle())
                .company(req.getCompany())
                .bio(req.getBio())
                .email(req.getEmail())
                .phone(req.getPhone())
                .profileImageUrl(req.getProfileImageUrl())
                .coverImageUrl(req.getCoverImageUrl())
                .theme(req.getTheme())
                .customFields(req.getCustomFields())
                .isPrimary(false)
                .isPublished(true)
                .isDeleted(false)
                .build();

        return toResponse(cardRepository.save(card), false);
    }
    
    public String uploadCardImage(MultipartFile file) throws Exception {
        return imageService.uploadAndCompress(file);
    }

    public byte[] generateCardQr(Long cardId) throws Exception {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        String url = "https://nixtap.online/c/" + (card.getCustomSlug() != null ? card.getCustomSlug() : card.getPublicId());
        return qrCodeGenerator.generate(url);
    }

    public String generateCardVCard(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        return vCardGenerator.generate(card.getFullName(), card.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CardResponse> getMyCards(Long userId) {
        return cardRepository.findByUserId(userId)
                .stream().map(c -> toResponse(c, false)).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CardResponse getMyCardById(Long userId, Long cardId) {
        Card card = cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        return toResponse(card, true);
    }

    @Override
    @Transactional
    public CardResponse updateCard(Long userId, Long cardId, CardUpdateRequest req) {
        Card card = cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));

        if (req.getFullName()    != null) card.setFullName(req.getFullName());
        if (req.getJobTitle()    != null) card.setJobTitle(req.getJobTitle());
        if (req.getCompany()     != null) card.setCompany(req.getCompany());
        if (req.getBio()         != null) card.setBio(req.getBio());
        if (req.getEmail()       != null) card.setEmail(req.getEmail());
        if (req.getPhone() != null) card.setPhone(req.getPhone());
        if (req.getTheme() != null) card.setTheme(req.getTheme());
        if (req.getCustomFields() != null) card.setCustomFields(req.getCustomFields());
        if (req.getIsPublished() != null) card.setIsPublished(req.getIsPublished());
        if (req.getProfileImageUrl() != null) card.setProfileImageUrl(req.getProfileImageUrl());
        if (req.getCoverImageUrl() != null) card.setCoverImageUrl(req.getCoverImageUrl());

        if (req.getCustomSlug() != null) {
            String newSlug = blankToNull(req.getCustomSlug());
            if (newSlug != null && !newSlug.equals(card.getCustomSlug())
                    && cardRepository.existsByCustomSlug(newSlug)) {
                throw new DuplicateResourceException("Slug '" + newSlug + "' is already taken");
            }
            card.setCustomSlug(newSlug);
        }

        return toResponse(cardRepository.save(card), true);
    }

    @Override
    @Transactional
    public void deleteCard(Long userId, Long cardId) {
        Card card = cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        card.setIsDeleted(true);
        card.setDeletedAt(LocalDateTime.now());
        cardRepository.save(card);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "cards", key = "#slugOrId")
    public CardResponse resolvePublicCard(String slugOrId) {
        Card card = cardRepository.findByCustomSlug(slugOrId)
                .or(() -> cardRepository.findByPublicId(slugOrId))
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

        if (Boolean.FALSE.equals(card.getIsPublished())) {
            throw new ResourceNotFoundException("Card not found");
        }
        return toResponse(card, true);
    }

    private CardResponse toResponse(Card c, boolean includeSocialLinks) {
        List<SocialLinkResponse> socials = null;
        if (includeSocialLinks) {
            socials = socialLinkRepository.findByCardIdOrderByDisplayOrderAsc(c.getId())
                    .stream().map(s -> SocialLinkResponse.builder()
                            .id(s.getId())
                            .platform(s.getPlatform())
                            .url(s.getUrl())
                            .displayOrder(s.getDisplayOrder())
                            .build())
                    .collect(Collectors.toList());
        }
        String shareableUrl = c.getCustomSlug() != null
                ? "/c/" + c.getCustomSlug() : "/c/" + c.getPublicId();

        return CardResponse.builder()
                .id(c.getId())
                .userId(c.getUserId())
                .templateId(c.getTemplate() != null ? c.getTemplate().getId() : null)
                .templateName(c.getTemplate() != null ? c.getTemplate().getName() : null)
                .publicId(c.getPublicId())
                .customSlug(c.getCustomSlug())
                .shareableUrl(shareableUrl)
                .fullName(c.getFullName())
                .jobTitle(c.getJobTitle())
                .company(c.getCompany())
                .bio(c.getBio())
                .email(c.getEmail())
                .phone(c.getPhone())
                .profileImageUrl(c.getProfileImageUrl())
                .coverImageUrl(c.getCoverImageUrl())
                .theme(c.getTheme())
                .customFields(c.getCustomFields())
                .isPrimary(c.getIsPrimary())
                .isPublished(c.getIsPublished())
                .socialLinks(socials)
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}

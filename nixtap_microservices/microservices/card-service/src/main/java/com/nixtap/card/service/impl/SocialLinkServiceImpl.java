package com.nixtap.card.service.impl;

import com.nixtap.card.dto.request.SocialLinkRequest;
import com.nixtap.card.dto.response.SocialLinkResponse;
import com.nixtap.card.entity.SocialLink;
import com.nixtap.card.exception.*;
import com.nixtap.card.repository.*;
import com.nixtap.card.service.SocialLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class SocialLinkServiceImpl implements SocialLinkService {

    private final SocialLinkRepository socialLinkRepository;
    private final CardRepository cardRepository;

    @Override
    @Transactional
    public SocialLinkResponse addLink(Long userId, Long cardId, SocialLinkRequest req) {
        var card = cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));

        SocialLink link = SocialLink.builder()
                .card(card)
                .platform(req.getPlatform())
                .url(req.getUrl())
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .isDeleted(false)
                .build();

        link = socialLinkRepository.save(link);
        return toResponse(link);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SocialLinkResponse> getLinks(Long userId, Long cardId) {
        cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        return socialLinkRepository.findByCardIdOrderByDisplayOrderAsc(cardId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteLink(Long userId, Long cardId, Long linkId) {
        cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        SocialLink link = socialLinkRepository.findByIdAndCardId(linkId, cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Social link", "id", linkId));
        link.setIsDeleted(true);
        socialLinkRepository.save(link);
    }

    private SocialLinkResponse toResponse(SocialLink s) {
        return SocialLinkResponse.builder()
                .id(s.getId()).platform(s.getPlatform())
                .url(s.getUrl()).displayOrder(s.getDisplayOrder()).build();
    }
}

package com.nixtap.card.service;
import com.nixtap.card.dto.request.SocialLinkRequest;
import com.nixtap.card.dto.response.SocialLinkResponse;
import java.util.List;

public interface SocialLinkService {
    SocialLinkResponse addLink(Long userId, Long cardId, SocialLinkRequest request);
    List<SocialLinkResponse> getLinks(Long userId, Long cardId);
    void deleteLink(Long userId, Long cardId, Long linkId);
}

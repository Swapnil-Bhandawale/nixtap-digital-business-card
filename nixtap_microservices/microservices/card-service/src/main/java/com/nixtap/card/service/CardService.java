package com.nixtap.card.service;
import com.nixtap.card.dto.request.*;
import com.nixtap.card.dto.response.*;
import java.util.List;

public interface CardService {
    CardResponse createCard(Long userId, CardCreateRequest request);
    List<CardResponse> getMyCards(Long userId);
    CardResponse getMyCardById(Long userId, Long cardId);
    CardResponse updateCard(Long userId, Long cardId, CardUpdateRequest request);
    void deleteCard(Long userId, Long cardId);
    CardResponse resolvePublicCard(String slugOrId);
}

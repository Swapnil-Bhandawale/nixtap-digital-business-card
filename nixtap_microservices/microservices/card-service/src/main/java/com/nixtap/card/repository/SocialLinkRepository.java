package com.nixtap.card.repository;
import com.nixtap.card.entity.SocialLink;
import com.nixtap.card.enums.SocialPlatform;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    List<SocialLink> findByCardIdOrderByDisplayOrderAsc(Long cardId);
    Optional<SocialLink> findByIdAndCardId(Long id, Long cardId);
    boolean existsByCardIdAndPlatform(Long cardId, SocialPlatform platform);
}

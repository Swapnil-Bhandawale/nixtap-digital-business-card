package com.nixtap.card.repository;
import com.nixtap.card.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByUserId(Long userId);
    Optional<Card> findByIdAndUserId(Long id, Long userId);
    Optional<Card> findByCustomSlug(String customSlug);
    Optional<Card> findByPublicId(String publicId);
    boolean existsByPublicId(String publicId);
    boolean existsByCustomSlug(String customSlug);
    long countByUserId(Long userId);
}

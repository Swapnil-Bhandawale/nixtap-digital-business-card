package com.nixtap.analytics.repository;

import com.nixtap.analytics.entity.CardShare;
import com.nixtap.analytics.enums.ShareChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CardShareRepository extends JpaRepository<CardShare, Long> {

    long countByCardId(Long cardId);

    // Shares by channel for analytics breakdown
    @Query(value = """
        SELECT share_channel, COUNT(*) as count
        FROM card_shares
        WHERE card_id = :cardId
        GROUP BY share_channel
        ORDER BY count DESC
        """, nativeQuery = true)
    List<Object[]> findSharesByChannel(@Param("cardId") Long cardId);
}

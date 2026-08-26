package com.nixtap.analytics.repository;

import com.nixtap.analytics.entity.ProfileView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProfileViewRepository extends JpaRepository<ProfileView, Long> {

    long countByCardId(Long cardId);

    // Unique visitors: distinct IPs per card
    @Query("SELECT COUNT(DISTINCT p.visitorIp) FROM ProfileView p WHERE p.cardId = :cardId")
    long countUniqueVisitorsByCardId(@Param("cardId") Long cardId);

    // Views per day for last N days
    @Query(value = """
        SELECT DATE(viewed_at) as date, COUNT(*) as count
        FROM profile_views
        WHERE card_id = :cardId
          AND viewed_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
        GROUP BY DATE(viewed_at)
        ORDER BY date ASC
        """, nativeQuery = true)
    List<Object[]> findViewsByDay(@Param("cardId") Long cardId, @Param("days") int days);

    // Dedup check: has this IP already viewed today?
    @Query(value = """
        SELECT COUNT(*) FROM profile_views
        WHERE card_id = :cardId
          AND visitor_ip = :ip
          AND DATE(viewed_at) = CURDATE()
        """, nativeQuery = true)
    long countTodayViewsByIp(@Param("cardId") Long cardId, @Param("ip") String ip);

    // Device Analytics
    @Query(value = """
        SELECT 
            CASE 
                WHEN user_agent LIKE '%Mobile%' OR user_agent LIKE '%Android%' OR user_agent LIKE '%iPhone%' THEN 'Mobile'
                WHEN user_agent LIKE '%iPad%' OR user_agent LIKE '%Tablet%' THEN 'Tablet'
                WHEN user_agent IS NULL OR user_agent = '' THEN 'Unknown'
                ELSE 'Desktop'
            END as device,
            COUNT(*) as count
        FROM profile_views
        WHERE card_id = :cardId
        GROUP BY device
        ORDER BY count DESC
        """, nativeQuery = true)
    List<Object[]> findViewsByDevice(@Param("cardId") Long cardId);

    // Source Analytics
    @Query(value = """
        SELECT 
            CASE 
                WHEN referrer LIKE '%linkedin.com%' THEN 'LinkedIn'
                WHEN referrer LIKE '%instagram.com%' THEN 'Instagram'
                WHEN referrer LIKE '%facebook.com%' THEN 'Facebook'
                WHEN referrer LIKE '%twitter.com%' OR referrer LIKE '%t.co%' THEN 'X / Twitter'
                WHEN referrer LIKE '%google%' THEN 'Google Search'
                WHEN referrer IS NULL OR referrer = '' THEN 'Direct Link'
                ELSE 'Other Web'
            END as source,
            COUNT(*) as count
        FROM profile_views
        WHERE card_id = :cardId
        GROUP BY source
        ORDER BY count DESC
        """, nativeQuery = true)
    List<Object[]> findViewsBySource(@Param("cardId") Long cardId);
}

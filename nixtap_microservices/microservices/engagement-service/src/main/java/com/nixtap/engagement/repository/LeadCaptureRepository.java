package com.nixtap.engagement.repository;
import com.nixtap.engagement.entity.LeadCapture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface LeadCaptureRepository extends JpaRepository<LeadCapture, Long> {
    List<LeadCapture> findByCardIdOrderByCreatedAtDesc(Long cardId);
}

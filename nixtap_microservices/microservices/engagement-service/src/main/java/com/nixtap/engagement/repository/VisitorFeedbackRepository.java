package com.nixtap.engagement.repository;
import com.nixtap.engagement.entity.VisitorFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface VisitorFeedbackRepository extends JpaRepository<VisitorFeedback, Long> {
    List<VisitorFeedback> findByCardIdOrderByCreatedAtDesc(Long cardId);
}

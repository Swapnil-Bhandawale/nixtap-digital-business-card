package com.nixtap.card.repository;
import com.nixtap.card.entity.CardTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CardTemplateRepository extends JpaRepository<CardTemplate, Long> {
    List<CardTemplate> findByIsActiveTrueOrderByIdAsc();
}

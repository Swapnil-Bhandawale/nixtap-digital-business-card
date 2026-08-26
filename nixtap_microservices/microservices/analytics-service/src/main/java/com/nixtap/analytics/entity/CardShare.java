package com.nixtap.analytics.entity;
import com.nixtap.analytics.enums.ShareChannel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "card_shares")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CardShare {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "card_id", nullable = false) private Long cardId;
    @Enumerated(EnumType.STRING)
    @Column(name = "share_channel", nullable = false, length = 20)
    private ShareChannel shareChannel;
    @CreationTimestamp @Column(name = "shared_at", updatable = false) private LocalDateTime sharedAt;
}

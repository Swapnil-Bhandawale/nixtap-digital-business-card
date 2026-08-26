package com.nixtap.engagement.entity;
import com.nixtap.engagement.enums.AppointmentStatus;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import java.time.LocalDateTime;

@Entity @Table(name = "appointments")
@SQLRestriction("is_deleted = false")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "card_id", nullable = false) private Long cardId;
    @Column(name = "visitor_name", nullable = false, length = 150) private String visitorName;
    @Column(name = "visitor_email", nullable = false, length = 180) private String visitorEmail;
    @Column(name = "visitor_phone", length = 20) private String visitorPhone;
    @Column(name = "requested_datetime", nullable = false) private LocalDateTime requestedDatetime;
    @Column(name = "message", columnDefinition = "TEXT") private String message;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AppointmentStatus status = AppointmentStatus.PENDING;
    @Column(name = "is_deleted", nullable = false) private Boolean isDeleted = false;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}

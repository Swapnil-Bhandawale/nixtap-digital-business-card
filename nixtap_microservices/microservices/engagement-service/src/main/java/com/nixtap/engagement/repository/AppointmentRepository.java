package com.nixtap.engagement.repository;
import com.nixtap.engagement.entity.Appointment;
import com.nixtap.engagement.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCardIdOrderByRequestedDatetimeAsc(Long cardId);
    List<Appointment> findByCardIdAndStatusOrderByRequestedDatetimeAsc(Long cardId, AppointmentStatus status);
    Optional<Appointment> findByIdAndCardId(Long id, Long cardId);
}

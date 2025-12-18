package com.joaquin.CanchApp.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Reservation;
import com.joaquin.CanchApp.entity.ReservationStatus;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer>{
    List<Reservation> findBySportFieldIdAndReservationDate(Integer sportFieldId, LocalDate reservationDate);
    List<Reservation> findByUserId(Integer id);
    List<Reservation> findByReservationStatusAndReservationDateAndFinishTimeBefore(ReservationStatus reservationStatus, LocalDate reservationDate, LocalTime now);

    @Query("""
            SELECT r from Reservation r
            WHERE r.reservationStatus = :status
            AND r.reservationDate <= :today
            AND r.finishTime <= :now
            
            """)
    List<Reservation> findReservationsToFullfiled(
        @Param("status") ReservationStatus status,
        @Param("today") LocalDate today,
        @Param("now") LocalTime now
    );
}

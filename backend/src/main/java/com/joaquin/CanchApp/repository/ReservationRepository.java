package com.joaquin.CanchApp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer>{
    List<Reservation> findBySportFieldIdAndReservationDate(Integer sportFieldId, LocalDate reservationDate);
    List<Reservation> findByUserId(Integer id);
}

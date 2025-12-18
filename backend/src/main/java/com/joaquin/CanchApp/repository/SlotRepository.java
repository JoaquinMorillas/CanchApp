package com.joaquin.CanchApp.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joaquin.CanchApp.entity.Slot;

public interface SlotRepository  extends JpaRepository<Slot, Integer>{

    List<Slot> findBySportFieldIdAndReservationDate(Integer sportFieldId, LocalDate date);
    Optional<Slot> findBySportFieldIdAndReservationDateAndStartTime(Integer sportFieldIc, LocalDate date, LocalTime startTime);
}

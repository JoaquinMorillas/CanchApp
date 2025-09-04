package com.joaquin.CanchApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Availability;
import java.time.DayOfWeek;
import java.time.LocalDate;


@Repository
public interface AvailabilityRespository extends JpaRepository<Availability, Integer>{

    List<Availability> findBySportFieldId(Integer id);
    Optional<Availability> findByDayOfWeekAndSportFieldId(DayOfWeek dayOfWeek, Integer id);
    Optional<Availability> findBySportFieldIdAndSpecificDate(Integer sportFieldID, LocalDate specificDate);

}

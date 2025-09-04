package com.joaquin.CanchApp.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import java.time.DayOfWeek;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AvailabilityDTO {
    private Integer id;
    private Integer sportFieldId;
    private DayOfWeek dayOfWeek;
    private LocalTime beginingTime;
    private LocalTime endingTime;
    private LocalDate specificDate;
    private boolean active;

}

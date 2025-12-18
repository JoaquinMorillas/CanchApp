package com.joaquin.CanchApp.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.joaquin.CanchApp.entity.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SlotDTO {
    
    private Integer id;
    private Integer sportFieldId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime finishTime;
    private boolean available;
}

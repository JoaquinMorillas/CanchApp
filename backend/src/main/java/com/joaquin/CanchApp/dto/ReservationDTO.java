package com.joaquin.CanchApp.dto;


import java.time.LocalDate;
import java.time.LocalTime;

import com.joaquin.CanchApp.entity.ReservationStatus;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ReservationDTO {

    private Integer id;
    private Integer userId;
    private Integer stablishmentId;
    private Integer SportFieldId;
    private LocalDate reservationDate;
    private LocalTime beginingHour;
    private LocalTime finishingHour;
    private ReservationStatus reservationStatus;
}

package com.joaquin.CanchApp.mapper;

import com.joaquin.CanchApp.dto.ReservationDTO;
import com.joaquin.CanchApp.entity.Reservation;

public class ReservationMapper {

    public static ReservationDTO toDTO(Reservation reservation){
        return ReservationDTO.builder()
        .id(reservation.getId())
        .userId(reservation.getUser() == null ? null : reservation.getUser().getId())
        .stablishmentId(reservation.getSportField().getStablishment().getId())
        .SportFieldId(reservation.getSportField().getId())
        .reservationDate(reservation.getReservationDate())
        .beginingHour(reservation.getStartTime())
        .finishingHour(reservation.getFinishTime())
        .reservationStatus(reservation.getReservationStatus())
        .build();
    }
}

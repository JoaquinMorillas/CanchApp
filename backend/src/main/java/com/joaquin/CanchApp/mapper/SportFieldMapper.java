package com.joaquin.CanchApp.mapper;

import com.joaquin.CanchApp.dto.SportFieldDTO;
import com.joaquin.CanchApp.entity.SportField;

public class SportFieldMapper {

    public static SportFieldDTO toDTO(SportField sportField){
        return SportFieldDTO.builder()
        .id(sportField.getId())
        .name(sportField.getName())
        .stablishmentId(sportField.getStablishment().getId())
        .price(sportField.getPrice())
        .reservationDuration(sportField.getReservationDuration())
        .sport(sportField.getSport())
        .build();
    }
}

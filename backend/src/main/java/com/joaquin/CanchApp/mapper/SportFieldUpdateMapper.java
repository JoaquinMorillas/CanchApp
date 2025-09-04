package com.joaquin.CanchApp.mapper;

import com.joaquin.CanchApp.dto.SportFieldUpdateDTO;
import com.joaquin.CanchApp.entity.SportField;

public class SportFieldUpdateMapper {

    public static SportFieldUpdateDTO toDTO(SportField sportField){
        return SportFieldUpdateDTO.builder()
        
        .name(sportField.getName())
        .price(sportField.getPrice())
        .reservationDuration(sportField.getReservationDuration())
        .build();
    }
}

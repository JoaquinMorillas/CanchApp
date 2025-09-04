package com.joaquin.CanchApp.mapper;

import com.joaquin.CanchApp.dto.AvailabilityDTO;
import com.joaquin.CanchApp.entity.Availability;

public class AvailabilityMapper {
    public static AvailabilityDTO toDTO(Availability availability){
        return AvailabilityDTO.builder()
        .id(availability.getId())
        .sportFieldId(availability.getSportField().getId())
        .dayOfWeek(availability.getDayOfWeek())
        .beginingTime(availability.getBeginingTime())
        .endingTime(availability.getEndingTime())
        .specificDate(availability.getSpecificDate())
        .active(availability.isActive())
        .build();
    }

}

package com.joaquin.CanchApp.mapper;

import com.joaquin.CanchApp.dto.SlotDTO;
import com.joaquin.CanchApp.entity.Slot;

public class SlotMapper {
    public static SlotDTO toDTO(Slot slot){
        return SlotDTO.builder()
                .id(slot.getId())
                .sportFieldId(slot.getSportField().getId())
                .date(slot.getReservationDate())
                .startTime(slot.getStartTime())
                .finishTime(slot.getFinishTime())
                .available(slot.isAvailable())
                .build();
    }

}

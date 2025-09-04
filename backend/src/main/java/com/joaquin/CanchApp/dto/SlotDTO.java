package com.joaquin.CanchApp.dto;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class SlotDTO {
    
    private Integer sportFieldId;
    private LocalTime beginingTime;
    private LocalTime endingTime;
    private boolean reserved;
}

package com.joaquin.CanchApp.dto;

import java.time.Duration;

import com.joaquin.CanchApp.entity.Sport;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SportFieldDTO {
    private Integer id;
    private String name;
    private Integer stablishmentId;
    private Double price;
    private Duration reservationDuration;
    private Sport sport;

    
}

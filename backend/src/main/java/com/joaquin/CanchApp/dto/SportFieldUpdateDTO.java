package com.joaquin.CanchApp.dto;



import java.time.Duration;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SportFieldUpdateDTO {
    
    private String name;
    private Double price;
    private Duration reservationDuration;
    
    
}

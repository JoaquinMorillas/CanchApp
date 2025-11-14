package com.joaquin.CanchApp.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RatingDTO {

    private Integer id;
    private Integer userId;
    private Integer stablishmentId;
    private Integer value;
    private String opinion;
    private String userName;
    private LocalDate createdAt;

}

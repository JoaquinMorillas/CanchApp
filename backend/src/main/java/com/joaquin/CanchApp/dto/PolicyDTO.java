package com.joaquin.CanchApp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PolicyDTO {
    private Integer id;
    private String title;
    private String description;

}

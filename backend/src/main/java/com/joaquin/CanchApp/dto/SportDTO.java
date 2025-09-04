package com.joaquin.CanchApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SportDTO {

    private String name;
    private String label;
}

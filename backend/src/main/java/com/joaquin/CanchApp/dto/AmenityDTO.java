package com.joaquin.CanchApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AmenityDTO {

    private String name;
    private String iconUrl;
    private String publicId;

}

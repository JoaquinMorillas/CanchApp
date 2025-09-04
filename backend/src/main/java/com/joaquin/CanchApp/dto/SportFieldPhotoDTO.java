package com.joaquin.CanchApp.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SportFieldPhotoDTO {
    private Integer stablishmentId;
    private String url;
    private String description;
    private boolean isMain;

    public boolean getIsMain(){
        return this.isMain;
    }
}

package com.joaquin.CanchApp.mapper;

import com.joaquin.CanchApp.dto.AmenityDTO;
import com.joaquin.CanchApp.entity.Amenity;

public class AmenityMapper {
    public static AmenityDTO toDTO(Amenity amenity){
        AmenityDTO dto = AmenityDTO.builder()
                                    .name(amenity.getName())
                                    .iconUrl(amenity.getIconUrl())
                                    .publicId(amenity.getPublicId())
                                    .build();

        return dto;
    }

}

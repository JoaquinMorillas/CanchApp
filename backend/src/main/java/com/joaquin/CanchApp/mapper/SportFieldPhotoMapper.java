package com.joaquin.CanchApp.mapper;


import com.joaquin.CanchApp.dto.SportFieldPhotoDTO;
import com.joaquin.CanchApp.entity.SportFieldPhoto;

public class SportFieldPhotoMapper {
    public static SportFieldPhotoDTO toDTO(SportFieldPhoto sportFieldPhoto){
        return SportFieldPhotoDTO.builder()
        .stablishmentId(sportFieldPhoto.getStablishment().getId())
        .url(sportFieldPhoto.getUrl())
        .description(sportFieldPhoto.getDescription())
        .isMain(sportFieldPhoto.getIsMain())
        .build();
    }
}

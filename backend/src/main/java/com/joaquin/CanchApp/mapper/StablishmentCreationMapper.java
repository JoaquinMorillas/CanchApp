package com.joaquin.CanchApp.mapper;

import com.joaquin.CanchApp.dto.StablishmentCreationDTO;
import com.joaquin.CanchApp.entity.Stablishment;

public class StablishmentCreationMapper {
    
    public static StablishmentCreationDTO toDTO(Stablishment stablishment){

        return StablishmentCreationDTO.builder()
        .id(stablishment.getId())
        .ownerId(stablishment.getOwner().getId())
        .name(stablishment.getName())
        .images(stablishment.getImages())
        .country(stablishment.getAddress().getCountry())
        .city(stablishment.getAddress().getCity())
        .postalCode(stablishment.getAddress().getPostalCode())
        .street(stablishment.getAddress().getStreet())
        .number(stablishment.getAddress().getNumber())
        .province(stablishment.getAddress().getNumber())
        .build();
    }

}

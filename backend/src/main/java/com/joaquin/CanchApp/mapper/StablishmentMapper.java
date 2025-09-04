package com.joaquin.CanchApp.mapper;

import java.util.stream.Collectors;

import com.joaquin.CanchApp.dto.StablishmentDTO;
import com.joaquin.CanchApp.entity.Stablishment;

public class StablishmentMapper {
    public static StablishmentDTO toDTO(Stablishment stablishment){
        return StablishmentDTO.builder()
        .id(stablishment.getId())
        .name(stablishment.getName())
        .images(stablishment.getImages())
        .description(stablishment.getDescription())
        .city(stablishment.getAddress().getCity())
        .street(stablishment.getAddress().getStreet())
        .number(stablishment.getAddress().getNumber())
        .sports(stablishment.getSportFields().stream()
                .map((sf) -> sf.getSport())
                .distinct()
                .collect(Collectors.toList()))
        .sportFieldsNames(stablishment.getSportFields().stream()
                .map((sf) -> sf.getName())
                .collect(Collectors.toList()))
        .build();
    }
}

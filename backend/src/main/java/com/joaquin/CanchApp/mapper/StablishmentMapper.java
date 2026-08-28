package com.joaquin.CanchApp.mapper;

import java.util.ArrayList;
import java.util.stream.Collectors;

import com.joaquin.CanchApp.dto.StablishmentDTO;
import com.joaquin.CanchApp.entity.Stablishment;

public class StablishmentMapper {
    public static StablishmentDTO toDTO(Stablishment stablishment){
        return StablishmentDTO.builder()
        .id(stablishment.getId())
        .isActive(stablishment.isActive())
        .name(stablishment.getName())
        .images(stablishment.getImages())
        .description(stablishment.getDescription())
        .city(stablishment.getAddress().getCity())
        .street(stablishment.getAddress().getStreet())
        .number(stablishment.getAddress().getNumber())
        .telephoneNumber(stablishment.getTelephoneNumber())
        .sports(stablishment.getSportFields().stream()
                .map((sf) -> sf.getSport())
                .distinct()
                .collect(Collectors.toList()))
        .sportFieldsNames(stablishment.getSportFields().stream()
                .map((sf) -> sf.getName())
                .collect(Collectors.toList()))
        .amenities(stablishment.getAmenities().stream()
                    .map(AmenityMapper::toDTO)
                    .collect(Collectors.toSet()))
        .policies(stablishment.getPolicies().stream()
                                .map(PolicyMapper::toDTO)
                                .collect(Collectors.toList())
        )
        .ratings(
            stablishment.getRatings().size() > 0
            ? stablishment.getRatings().stream()
            .map(RatingMapper::toDto)
            .collect(Collectors.toList())
            : new ArrayList<>()
        )
        .AverageRating(stablishment.getAverageRating())
        .sumOfRatings(stablishment.getSumOfRatings())
        .numberOfRatings(stablishment.getNumberOfRatings())                
        .build();
    }
}

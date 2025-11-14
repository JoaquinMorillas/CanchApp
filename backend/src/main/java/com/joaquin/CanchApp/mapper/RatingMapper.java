package com.joaquin.CanchApp.mapper;

import com.joaquin.CanchApp.dto.RatingDTO;
import com.joaquin.CanchApp.entity.Rating;

public class RatingMapper {

    public static RatingDTO toDto(Rating rating){
        return RatingDTO.builder()
        .id(rating.getId())
        .userId(rating.getUser().getId())
        .stablishmentId(rating.getStablishment().getId())
        .value(rating.getValue())
        .opinion(rating.getOpinion())
        .createdAt(rating.getCreatedAt())
        .userName(rating.getUser().getFirstName())
        .build();
    }
}

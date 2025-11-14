package com.joaquin.CanchApp.mapper;

import com.joaquin.CanchApp.dto.PolicyDTO;
import com.joaquin.CanchApp.entity.Policy;

public class PolicyMapper {

    public static PolicyDTO toDTO(Policy policy){
        return PolicyDTO.builder()
        .id(policy.getId())
        .title(policy.getTitle())
        .description(policy.getDescription())
        .build();
    }
}

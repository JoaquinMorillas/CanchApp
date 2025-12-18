package com.joaquin.CanchApp.dto;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.joaquin.CanchApp.entity.ImageInfo;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class StablishmentCreationDTO {
    private Integer id;
    private Integer ownerId;
    private String name;
    private String description;
    private String telephoneNumber;
    @JsonProperty("images")
    private List<ImageInfo> images;
    @JsonProperty("amenities")
    private Set<AmenityDTO> amenities;
    @JsonProperty("policies")
    private List<PolicyDTO> policies;

    //Address attributes
    private String country;
    private String province;
    private String city;
    private String postalCode;
    private String street;
    private String number;

}

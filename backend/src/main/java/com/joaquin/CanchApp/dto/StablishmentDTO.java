package com.joaquin.CanchApp.dto;

import java.util.List;

import com.joaquin.CanchApp.entity.ImageInfo;
import com.joaquin.CanchApp.entity.Sport;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class StablishmentDTO {
    private Integer id;
    private String name;
    private List<ImageInfo> images;

    //Address's fields
    
    private String city;
    private String street;
    private String number;
    private String description;

    private List<Sport> sports;

    private List<String> sportFieldsNames;

}

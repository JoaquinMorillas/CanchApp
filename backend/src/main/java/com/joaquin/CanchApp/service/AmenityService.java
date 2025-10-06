package com.joaquin.CanchApp.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.joaquin.CanchApp.dto.AmenityDTO;
import com.joaquin.CanchApp.entity.Amenity;
import com.joaquin.CanchApp.entity.ImageInfo;
import com.joaquin.CanchApp.exception.AmenityNameNotFoundException;
import com.joaquin.CanchApp.mapper.AmenityMapper;
import com.joaquin.CanchApp.repository.AmenityRespository;

@Service
public class AmenityService {

    @Autowired
    private AmenityRespository amenityRespository;

    @Autowired 
    private CloudinaryService cloudinaryService;

    public AmenityDTO save(String name, MultipartFile icon) throws IOException{

        ImageInfo info = cloudinaryService.uploadImg(icon);

        Amenity amenityToSave = Amenity.builder()
                                .name(name)
                                .iconUrl(info.getImageUrl())
                                .publicId(info.getPublicId())
                                .build();
        Amenity savedAmenity = amenityRespository.save(amenityToSave);

        return AmenityMapper.toDTO(savedAmenity);
    }

    public List<AmenityDTO> findAll(){
        List<Amenity> amenities = amenityRespository.findAll();

        List<AmenityDTO> dtos = new ArrayList<>();

        dtos = amenities.stream()
                        .map(AmenityMapper::toDTO)
                        .collect(Collectors.toList());

        return dtos;

    }

    public void deleteByName(String name) throws AmenityNameNotFoundException{
        Amenity amenityToDelete = amenityRespository.findByName(name)
        .orElseThrow(() -> new AmenityNameNotFoundException(name));

        amenityRespository.deleteById(amenityToDelete.getId());     
    }

    public AmenityDTO update(AmenityDTO oldDto, AmenityDTO updatedDto) throws AmenityNameNotFoundException{
        Amenity amenityToUpdate = amenityRespository.findByName(oldDto.getName())
        .orElseThrow(() -> new AmenityNameNotFoundException(oldDto.getName()));
        
        if(updatedDto.getName() != null){amenityToUpdate.setName(updatedDto.getName());}
        if(updatedDto.getIconUrl() != null){amenityToUpdate.setIconUrl(updatedDto.getIconUrl());}
        if(updatedDto.getPublicId() != null){amenityToUpdate.setPublicId(updatedDto.getPublicId());}

        Amenity savedAmenity = amenityRespository.save(amenityToUpdate);

        return AmenityMapper.toDTO(savedAmenity);
    }
}

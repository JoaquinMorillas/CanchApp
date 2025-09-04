package com.joaquin.CanchApp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joaquin.CanchApp.dto.SportFieldPhotoDTO;

import com.joaquin.CanchApp.entity.SportFieldPhoto;
import com.joaquin.CanchApp.entity.Stablishment;
import com.joaquin.CanchApp.exception.PhotoIdNotFoundException;
import com.joaquin.CanchApp.exception.PhotoUrlAlreadyExists;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;
import com.joaquin.CanchApp.mapper.SportFieldPhotoMapper;
import com.joaquin.CanchApp.repository.SportFieldPhotoRepository;

import com.joaquin.CanchApp.repository.StablishmentRepository;

@Service
public class SportFieldPhotoService {
    @Autowired
    private StablishmentRepository stablishmentRepository;
    @Autowired
    private SportFieldPhotoRepository sportFieldPhotoRepository; 

    public SportFieldPhotoDTO save(SportFieldPhotoDTO sportFieldPhotoDTO) throws SportFieldIdNotFoundException, PhotoUrlAlreadyExists{
        //first check if sportfield exists
        Optional<Stablishment> searchedStablishment = stablishmentRepository.findById(sportFieldPhotoDTO.getStablishmentId());
        if(!searchedStablishment.isPresent()){
            throw new SportFieldIdNotFoundException(sportFieldPhotoDTO.getStablishmentId());
        }else{
            Optional<SportFieldPhoto> searchedUrl = sportFieldPhotoRepository.findByUrl(sportFieldPhotoDTO.getUrl());
            if(searchedUrl.isPresent()){
                throw new PhotoUrlAlreadyExists(searchedUrl.get().getUrl());
            }else{
                SportFieldPhoto photoToSave = SportFieldPhoto.builder()
                .stablishment(searchedStablishment.get())
                .url(sportFieldPhotoDTO.getUrl())
                .description(sportFieldPhotoDTO.getDescription())
                .isMain(sportFieldPhotoDTO.getIsMain())
                .createdAt(LocalDate.now())
                .build();

                sportFieldPhotoRepository.save(photoToSave);

                return SportFieldPhotoMapper.toDTO(photoToSave);
            }
        }
    } 

    public List<SportFieldPhotoDTO> findByStablishmentId(Integer id){
        List<SportFieldPhoto> photos = sportFieldPhotoRepository.findByStablishmentId(id);
        List<SportFieldPhotoDTO> dtos = photos.stream()
        .map(SportFieldPhotoMapper::toDTO)
        .collect(Collectors.toList());

        return dtos;
    }

    public void deleteById(Integer id) throws PhotoIdNotFoundException{
        Optional<SportFieldPhoto> searchedPhoto = sportFieldPhotoRepository.findById(id);
        if(!searchedPhoto.isPresent()){
            throw new PhotoIdNotFoundException(id);
        } else{
            sportFieldPhotoRepository.deleteById(id);
        }
    }
}

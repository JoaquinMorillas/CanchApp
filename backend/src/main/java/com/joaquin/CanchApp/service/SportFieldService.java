package com.joaquin.CanchApp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.joaquin.CanchApp.dto.SportFieldDTO;
import com.joaquin.CanchApp.dto.SportFieldUpdateDTO;
import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.entity.SportField;
import com.joaquin.CanchApp.entity.Stablishment;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;
import com.joaquin.CanchApp.exception.SportFieldNameAlreadyExistsException;
import com.joaquin.CanchApp.exception.StablishmentIdNotFoundException;
import com.joaquin.CanchApp.mapper.SportFieldMapper;
import com.joaquin.CanchApp.mapper.SportFieldUpdateMapper;
import com.joaquin.CanchApp.repository.SportFieldRepository;
import com.joaquin.CanchApp.repository.StablishmentRepository;

@Service
public class SportFieldService {

    @Autowired
    private SportFieldRepository sportFieldRepository;
    @Autowired
    private StablishmentRepository stablishmentRepository;

    public SportFieldDTO save(SportFieldDTO sportField) throws SportFieldNameAlreadyExistsException{
        
       
        Optional<SportField> searchedSportFieldName = sportFieldRepository.findByStablishmentIdAndName(sportField.getStablishmentId(), sportField.getName());
        if (searchedSportFieldName.isPresent()){
            throw new SportFieldNameAlreadyExistsException(searchedSportFieldName.get().getName());
        }else{
            Optional<Stablishment> stablishment = stablishmentRepository.findById(sportField.getStablishmentId());
            SportField savedSportField = SportField.builder()
                .name(sportField.getName())
                .price(sportField.getPrice())
                .reservationDuration(sportField.getReservationDuration())
                .sport(sportField.getSport())
                .stablishment(stablishment.get())
                .reservations(new ArrayList<>())
                .availabilities(new ArrayList<>())  
                .build();

            sportFieldRepository.save(savedSportField);

            return SportFieldMapper.toDTO(savedSportField);
        }
        
        
        
    }

    public List<SportFieldDTO> findAll(){
        List<SportField> sportFields = sportFieldRepository.findAll();
        List<SportFieldDTO> sportFieldCreationDTOs = 
        sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return sportFieldCreationDTOs;
    }

    public List<SportFieldDTO> findByCity(String city){
        List<SportField> sportFields = sportFieldRepository.findByStablishmentAddressCityContainingIgnoreCase(city);
        List<SportFieldDTO> sportFieldCreationDTOs = 
        sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return sportFieldCreationDTOs;
    }

    public List<SportFieldDTO> findBySportAndCity(String sport, String city){
        Sport sportEnum = Sport.valueOf(sport.toUpperCase());
        List<SportField> sportFields = sportFieldRepository.findBySportAndStablishmentAddressCityContainingIgnoreCase(sportEnum, city);
        List<SportFieldDTO> sportFieldCreationDTOs =
        sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return sportFieldCreationDTOs;
    }

    public List<SportFieldDTO> findBySport(String sport) {
        Sport sportEnum = Sport.valueOf(sport.toUpperCase()); 
        List<SportField> sportFields = sportFieldRepository.findBySport(sportEnum);
        List<SportFieldDTO> sportFieldCreationDTOs =
        sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return sportFieldCreationDTOs;
    }

    public List<SportFieldDTO> findbyStablismentId(Integer id){
        List<SportField> sportFields = sportFieldRepository.findByStablishmentId(id);
        List<SportFieldDTO> sportFieldCreationDTOs = sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return sportFieldCreationDTOs;
    }

    public SportFieldDTO findById(Integer id) throws SportFieldIdNotFoundException{
        Optional<SportField> sportField = sportFieldRepository.findById(id);
        if (!sportField.isPresent()){
            throw new SportFieldIdNotFoundException(id);
        }else{
            return SportFieldMapper.toDTO(sportField.get());
        }
    }

    public SportFieldUpdateDTO update(SportFieldUpdateDTO sportFieldUpdateDTO, Integer id) throws SportFieldIdNotFoundException{
        Optional<SportField> serachedSportField = sportFieldRepository.findById(id);
        if(!serachedSportField.isPresent()){
            
            throw new SportFieldIdNotFoundException(id);
        }else{

            SportField sportFieldToUpdate = serachedSportField.get();
            if(sportFieldUpdateDTO.getName()!=null) sportFieldToUpdate.setName(sportFieldUpdateDTO.getName());
            if(sportFieldUpdateDTO.getPrice()!=null) sportFieldToUpdate.setPrice(sportFieldUpdateDTO.getPrice());
            if(sportFieldUpdateDTO.getReservationDuration()!=null) sportFieldToUpdate.setReservationDuration(sportFieldUpdateDTO.getReservationDuration());

            sportFieldRepository.save(sportFieldToUpdate);
            return SportFieldUpdateMapper.toDTO(sportFieldToUpdate);
        }
    }

    public void deleteById(Integer id) throws SportFieldIdNotFoundException{
        Optional<SportField> sportFieldToDelete = sportFieldRepository.findById(id);
        if(!sportFieldToDelete.isPresent()){
            throw new SportFieldIdNotFoundException(id);
        }else{
            sportFieldRepository.deleteById(id);
        }
    }

    public List<SportField> findAllComplete(){
        return sportFieldRepository.findAll();
    }

    public Boolean findByNameAndStablishmentId(String name, Integer id) throws SportFieldNameAlreadyExistsException{
        Optional<SportField> searchedSportField = sportFieldRepository.findByStablishmentIdAndName(id, name);
        if(searchedSportField.isPresent()){
            throw new SportFieldNameAlreadyExistsException(name);
        }else{
            return false;
        }
    }

    public List<SportFieldDTO> findByStablishmentIdAndSport(Integer id, Sport sport) throws StablishmentIdNotFoundException{
        Optional<Stablishment> searchedStablishment = stablishmentRepository.findById(id);
        if(!searchedStablishment.isPresent()){
            throw new StablishmentIdNotFoundException(id);
        }

        List<SportField> sportFields = sportFieldRepository.findByStablishmentIdAndSport(id, sport);
        List<SportFieldDTO> dtos = sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return dtos;
    }
}

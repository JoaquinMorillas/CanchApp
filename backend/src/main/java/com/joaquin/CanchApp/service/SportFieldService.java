package com.joaquin.CanchApp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.joaquin.CanchApp.dto.SportFieldDTO;
import com.joaquin.CanchApp.dto.SportFieldUpdateDTO;
import com.joaquin.CanchApp.entity.Role;
import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.entity.SportField;
import com.joaquin.CanchApp.entity.Stablishment;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;
import com.joaquin.CanchApp.exception.SportFieldNameAlreadyExistsException;
import com.joaquin.CanchApp.exception.SportNameNotFoundException;
import com.joaquin.CanchApp.exception.StablishmentIdNotFoundException;
import com.joaquin.CanchApp.exception.UserIsNotTheOwnerException;
import com.joaquin.CanchApp.mapper.SportFieldMapper;
import com.joaquin.CanchApp.mapper.SportFieldUpdateMapper;
import com.joaquin.CanchApp.repository.SportFieldRepository;
import com.joaquin.CanchApp.repository.SportRepository;
import com.joaquin.CanchApp.repository.StablishmentRepository;

@Service
public class SportFieldService {

    @Autowired
    private SportFieldRepository sportFieldRepository;
    @Autowired
    private StablishmentRepository stablishmentRepository;
    @Autowired
    private SportRepository sportRepository;

    public SportFieldDTO save(
        SportFieldDTO sportField,
        User user
    ) throws SportFieldNameAlreadyExistsException, SportNameNotFoundException, StablishmentIdNotFoundException, UserIsNotTheOwnerException{
        
        Stablishment stablishment = stablishmentRepository.findById(sportField.getStablishmentId())
        .orElseThrow(() -> new StablishmentIdNotFoundException(sportField.getStablishmentId()));
        
        boolean isAdmin = user.getRole().equals(Role.ADMIN);
        boolean isOwner = user.getId().equals(stablishment.getOwner().getId());

        if (!isAdmin && !isOwner){
            throw new UserIsNotTheOwnerException();
        }

        Optional<SportField> searchedSportFieldName = sportFieldRepository.findByStablishmentIdAndNameAndIsActiveTrue(sportField.getStablishmentId(), sportField.getName());
        if (searchedSportFieldName.isPresent()){
            throw new SportFieldNameAlreadyExistsException(searchedSportFieldName.get().getName());
        }
            Sport sport = sportRepository.findByName(sportField.getSportName())
            .orElseThrow(()-> new SportNameNotFoundException(sportField.getSportName()));
            SportField savedSportField = SportField.builder()
                .name(sportField.getName())
                .price(sportField.getPrice())
                .reservationDuration(sportField.getReservationDuration())
                .sport(sport)
                .stablishment(stablishment)
                .reservations(new ArrayList<>())
                .availabilities(new ArrayList<>())  
                .build();

            sportFieldRepository.save(savedSportField);

            return SportFieldMapper.toDTO(savedSportField);
        
        
        
        
    }

    public List<SportFieldDTO> findAll(){
        List<SportField> sportFields = sportFieldRepository.findByIsActiveTrue();
        List<SportFieldDTO> sportFieldCreationDTOs = 
        sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return sportFieldCreationDTOs;
    }

    public List<SportFieldDTO> findByCity(String city){
        List<SportField> sportFields = sportFieldRepository.findByStablishmentAddressCityContainingIgnoreCaseAndIsActiveTrue(city);
        List<SportFieldDTO> sportFieldCreationDTOs = 
        sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return sportFieldCreationDTOs;
    }

    public List<SportFieldDTO> findBySportAndCity(String sport, String city){
        List<SportField> sportFields = sportFieldRepository.findBySportNameAndStablishmentAddressCityContainingIgnoreCaseAndIsActiveTrue(sport, city);
        List<SportFieldDTO> sportFieldCreationDTOs =
        sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return sportFieldCreationDTOs;
    }

    public List<SportFieldDTO> findBySport(String sport) {
         
        List<SportField> sportFields = sportFieldRepository.findBySportNameAndIsActiveTrue(sport);
        List<SportFieldDTO> sportFieldCreationDTOs =
        sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return sportFieldCreationDTOs;
    }

    public List<SportFieldDTO> findbyStablismentId(Integer id){
        List<SportField> sportFields = sportFieldRepository.findByStablishmentIdAndIsActiveTrue(id);
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

    public SportFieldUpdateDTO update(
        SportFieldUpdateDTO sportFieldUpdateDTO, 
        Integer id,
        User user) throws SportFieldIdNotFoundException, UserIsNotTheOwnerException{
        Optional<SportField> serachedSportField = sportFieldRepository.findById(id);
        boolean isAdmin = user.getRole().equals(Role.ADMIN);
        boolean isOwner = user.getId().equals(serachedSportField.get().getStablishment().getOwner().getId());
        
        if (!isAdmin && !isOwner){
            throw new UserIsNotTheOwnerException();
        }

        if(!serachedSportField.isPresent()){
            throw new SportFieldIdNotFoundException(id);
        }

            SportField sportFieldToUpdate = serachedSportField.get();
            if(sportFieldUpdateDTO.getName()!=null) sportFieldToUpdate.setName(sportFieldUpdateDTO.getName());
            if(sportFieldUpdateDTO.getPrice()!=null) sportFieldToUpdate.setPrice(sportFieldUpdateDTO.getPrice());
            if(sportFieldUpdateDTO.getReservationDuration()!=null) sportFieldToUpdate.setReservationDuration(sportFieldUpdateDTO.getReservationDuration());

            sportFieldRepository.save(sportFieldToUpdate);
            return SportFieldUpdateMapper.toDTO(sportFieldToUpdate);
        
    }

    public void deleteById(
        Integer id,
        User user
    ) throws SportFieldIdNotFoundException, UserIsNotTheOwnerException{
        
        SportField sportFieldToDelete = sportFieldRepository.findById(id)
        .orElseThrow(() -> new SportFieldIdNotFoundException(id));
        
        boolean isAdmin = user.getRole().equals(Role.ADMIN);
        boolean isOwner = user.getId().equals(sportFieldToDelete.getStablishment().getOwner().getId());

        if(!isAdmin && !isOwner){
            throw new UserIsNotTheOwnerException();
        }

        sportFieldToDelete.setActive(false);
        sportFieldRepository.save(sportFieldToDelete);
        
    }

    public void restoreById(
        Integer id,
        User user
    ) throws SportFieldIdNotFoundException, UserIsNotTheOwnerException{
        
        SportField sportFieldToRestore = sportFieldRepository.findById(id)
        .orElseThrow(() -> new SportFieldIdNotFoundException(id));
        
        boolean isAdmin = user.getRole().equals(Role.ADMIN);
        boolean isOwner = user.getId().equals(sportFieldToRestore.getStablishment().getOwner().getId());

        if(!isAdmin && !isOwner){
            throw new UserIsNotTheOwnerException();
        }

        sportFieldToRestore.setActive(true);
        sportFieldRepository.save(sportFieldToRestore);
        
    }

    public List<SportFieldDTO> findAllComplete(){
        List<SportField> sportFields = sportFieldRepository.findAll();
        List<SportFieldDTO> dtos = new ArrayList<>();
        dtos = sportFields.stream()
                .map(SportFieldMapper::toDTO)
                .collect(Collectors.toList());
        return dtos;
    }

    public Boolean findByNameAndStablishmentId(String name, Integer id) throws SportFieldNameAlreadyExistsException{
        Optional<SportField> searchedSportField = sportFieldRepository.findByStablishmentIdAndNameAndIsActiveTrue(id, name);
        if(searchedSportField.isPresent()){
            throw new SportFieldNameAlreadyExistsException(name);
        }else{
            return false;
        }
    }

    public List<SportFieldDTO> findByStablishmentIdAndSportName(Integer id, String sport) throws StablishmentIdNotFoundException{
        Optional<Stablishment> searchedStablishment = stablishmentRepository.findById(id);
        if(!searchedStablishment.isPresent()){
            throw new StablishmentIdNotFoundException(id);
        }

        List<SportField> sportFields = sportFieldRepository.findByStablishmentIdAndSportNameAndIsActiveTrue(id, sport);
        List<SportFieldDTO> dtos = sportFields.stream()
        .map(SportFieldMapper::toDTO)
        .collect(Collectors.toList());

        return dtos;
    }
}

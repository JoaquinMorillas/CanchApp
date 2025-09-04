package com.joaquin.CanchApp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.joaquin.CanchApp.dto.StablishmentCreationDTO;
import com.joaquin.CanchApp.dto.StablishmentDTO;
import com.joaquin.CanchApp.entity.Address;
import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.entity.Stablishment;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.AddressAlreadyExistsException;
import com.joaquin.CanchApp.exception.StablishmentIdNotFoundException;
import com.joaquin.CanchApp.exception.StablishmentNameAlreadyExistsException;
import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.mapper.StablishmentMapper;
import com.joaquin.CanchApp.repository.StablishmentRepository;
import com.joaquin.CanchApp.repository.UserRepository;
import com.joaquin.CanchApp.mapper.StablishmentCreationMapper;

@Service
public class StablishmentService {

    @Autowired
    private StablishmentRepository stablishmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AddressService addressService;

    public List<StablishmentDTO> findAll(){
        List<Stablishment> stablishments = stablishmentRepository.findAll();
        List<StablishmentDTO> stablishmentDTOs = new ArrayList<>();
        stablishmentDTOs = stablishments.stream().
        map(StablishmentMapper::toDTO)
        .collect(Collectors.toList());

        return stablishmentDTOs;
        
    }

    public StablishmentCreationDTO save(@RequestBody StablishmentCreationDTO stablishmentCreationDTO) throws UserIdNotFoundException, AddressAlreadyExistsException, StablishmentNameAlreadyExistsException{

        Optional<Stablishment> nameCheck = stablishmentRepository.findByName(stablishmentCreationDTO.getName());
        if(nameCheck.isPresent()){
            throw new StablishmentNameAlreadyExistsException(nameCheck.get().getName());
        }

        Optional<User> owner = userRepository.findById(stablishmentCreationDTO.getOwnerId());
        if(!owner.isPresent()){
            throw new UserIdNotFoundException(stablishmentCreationDTO.getOwnerId());
        }else{

            Address address = Address.builder()
                .country(stablishmentCreationDTO.getCountry())
                .province(stablishmentCreationDTO.getProvince())
                .city(stablishmentCreationDTO.getCity())
                .postalCode(stablishmentCreationDTO.getPostalCode())
                .street(stablishmentCreationDTO.getStreet())
                .number(stablishmentCreationDTO.getNumber())
                .build();
    
            addressService.save(address);
    
            Stablishment stablishment = Stablishment.builder()
                .owner(owner.get())
                .address(address)
                .name(stablishmentCreationDTO.getName())
                .images(stablishmentCreationDTO.getImages())
                .sportFields(new ArrayList<>())
                .build();

            Stablishment savedStablishment = stablishmentRepository.save(stablishment);
            System.out.println("Saving Stablishment with images: " + stablishment.getImages());
            return StablishmentCreationMapper.toDTO(savedStablishment);
            
        }
    }

    public StablishmentDTO findById(Integer id) throws StablishmentIdNotFoundException{
        Optional<Stablishment> searchedStablishment = stablishmentRepository.findById(id);
        if(searchedStablishment.isPresent()){
            return StablishmentMapper.toDTO(searchedStablishment.get());
        }else{
            throw new StablishmentIdNotFoundException(id);
        }
        
    }

    public List<StablishmentDTO> findByCity(String city){
        List<Stablishment> stablishments = stablishmentRepository.findByAddressCityContainingIgnoreCase(city);
        List<StablishmentDTO> stablishmentDTOs = stablishments.stream()
                                                .map(StablishmentMapper::toDTO)
                                                .collect(Collectors.toList());
        return stablishmentDTOs;
                                            
    }

    public void deleteById(Integer id) throws StablishmentIdNotFoundException{
        Optional<Stablishment> stablishment = stablishmentRepository.findById(id);
        if(!stablishment.isPresent()){
            throw new StablishmentIdNotFoundException(id);
        }else{
            stablishmentRepository.deleteById(id);
        }
    }

    public List<StablishmentDTO> findByOwnerID(Integer id) throws UserIdNotFoundException{
        Optional<User> owner = userRepository.findById(id);
        if(!owner.isPresent()){
            throw new UserIdNotFoundException(id);
        }else{

            List<Stablishment> stablishments = stablishmentRepository.findByOwnerId(id);
            
            List<StablishmentDTO> stablishmentDTOs = stablishments.stream()
                .map(StablishmentMapper::toDTO)
                .collect(Collectors.toList());
            return stablishmentDTOs;
        }
    }

    public List<StablishmentDTO> findBySport(Sport sport){
        List<Stablishment> stablishments = stablishmentRepository.findBySportFieldsSport(sport);

        List<StablishmentDTO> dtos = stablishments.stream()
        .map(StablishmentMapper::toDTO)
        .collect(Collectors.toList());

        return dtos;
    }

    public Boolean findByName(String name) {
        Optional<Stablishment> searchedStablishment = stablishmentRepository.findByName(name);
        if (searchedStablishment.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    public StablishmentDTO update(StablishmentDTO stablishmentDTO, Integer id) throws StablishmentIdNotFoundException{
        Optional<Stablishment> searchedStablishment = stablishmentRepository.findById(id);
        if(!searchedStablishment.isPresent()){
            throw new StablishmentIdNotFoundException(stablishmentDTO.getId());
        }else{
            Stablishment stablishmentToSave = searchedStablishment.get();

            if(stablishmentDTO.getName() != null){stablishmentToSave.setName(stablishmentDTO.getName());}
            if(stablishmentDTO.getCity() != null){stablishmentToSave.getAddress().setCity(stablishmentDTO.getCity());}
            if(stablishmentDTO.getStreet() != null){stablishmentToSave.getAddress().setStreet(stablishmentDTO.getStreet());}
            if(stablishmentDTO.getNumber() != null){stablishmentToSave.getAddress().setNumber(stablishmentDTO.getNumber());}
            if(stablishmentDTO.getImages() != null){stablishmentToSave.setImages(stablishmentDTO.getImages());}
            
            stablishmentRepository.save(stablishmentToSave);
            return StablishmentMapper.toDTO(stablishmentToSave);
        }

    }
}

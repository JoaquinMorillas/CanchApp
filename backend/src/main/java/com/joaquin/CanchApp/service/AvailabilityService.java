package com.joaquin.CanchApp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joaquin.CanchApp.dto.AvailabilityDTO;
import com.joaquin.CanchApp.entity.Availability;
import com.joaquin.CanchApp.entity.SportField;
import com.joaquin.CanchApp.exception.AvailabilityAlreadyExistsException;
import com.joaquin.CanchApp.exception.AvailabilityIdNotFoundException;
import com.joaquin.CanchApp.exception.BeginingTimeIsAfterEndingTimeException;
import com.joaquin.CanchApp.mapper.AvailabilityMapper;
import com.joaquin.CanchApp.repository.AvailabilityRespository;
import com.joaquin.CanchApp.repository.SportFieldRepository;


@Service
public class AvailabilityService {
    @Autowired
    private AvailabilityRespository availabilityRespository;
    @Autowired
    private SportFieldRepository sportFieldRepository;

    public AvailabilityDTO save(AvailabilityDTO dto) throws AvailabilityAlreadyExistsException, BeginingTimeIsAfterEndingTimeException{
        if(!dto.getBeginingTime().isBefore(dto.getEndingTime())){
            throw new BeginingTimeIsAfterEndingTimeException(dto.getBeginingTime(), dto.getEndingTime());
        }
        Optional<Availability> searchedAvailability = availabilityRespository.findByDayOfWeekAndSportFieldId(dto.getDayOfWeek(), dto.getSportFieldId());
        if(searchedAvailability.isPresent() && dto.getSpecificDate()==null){
            throw new AvailabilityAlreadyExistsException(searchedAvailability.get().getDayOfWeek(), searchedAvailability.get().getSportField().getId());
        }else{
            Optional<SportField> sportField = sportFieldRepository.findById(dto.getSportFieldId());

            Availability savedAvailability = Availability.builder()
            .sportField(sportField.get())
            .dayOfWeek(dto.getDayOfWeek())
            .beginingTime(dto.getBeginingTime())
            .endingTime(dto.getEndingTime())
            .specificDate(dto.getSpecificDate())
            .active(dto.isActive())
            .build();

            availabilityRespository.save(savedAvailability);

            return AvailabilityMapper.toDTO(savedAvailability);
        }
    }

    public List<AvailabilityDTO> findBySportFieldId(Integer id){
        List<Availability> availabilities = availabilityRespository.findBySportFieldId(id);
        List<AvailabilityDTO> dtos = availabilities.stream()
        .map(AvailabilityMapper::toDTO)
        .collect(Collectors.toList());

        return dtos;
    }

    public AvailabilityDTO findById(Integer id) throws AvailabilityIdNotFoundException{
        Optional<Availability> searchedAvailability = availabilityRespository.findById(id);
        if(!searchedAvailability.isPresent()){
            throw new AvailabilityIdNotFoundException(id);
        }else{
            return AvailabilityMapper.toDTO(searchedAvailability.get());
        }
    }

    //The only things that can be updated are begining time, ending time and isActive. On the FrontEnd the there must be posible ony to change those from a form
    public AvailabilityDTO updateAvailability(Integer id, AvailabilityDTO newAvailability) throws AvailabilityIdNotFoundException{
        Optional<Availability> searchedAvailability = availabilityRespository.findById(id);
        if(!searchedAvailability.isPresent()){
            throw new AvailabilityIdNotFoundException(id);
        }else{
            Optional<SportField> sportField = sportFieldRepository.findById(searchedAvailability.get().getSportField().getId());
            
            Availability availabilityToSave = Availability.builder()
            .id(searchedAvailability.get().getId())
            .sportField(sportField.get())
            .dayOfWeek(searchedAvailability.get().getDayOfWeek())
            .beginingTime(newAvailability.getBeginingTime())
            .endingTime(newAvailability.getEndingTime())
            .active(newAvailability.isActive())
            .build();

            availabilityRespository.save(availabilityToSave);

            return AvailabilityMapper.toDTO(availabilityToSave);
        }
    }

    public void deleteAvailability(Integer id) throws AvailabilityIdNotFoundException{
        Optional<Availability> availabilityToDelete = availabilityRespository.findById(id);
        if(!availabilityToDelete.isPresent()){
            throw new AvailabilityIdNotFoundException(id);
        }else{
            availabilityRespository.deleteById(availabilityToDelete.get().getId());
        }
    }

    public AvailabilityDTO findBySportFieldIdAndSpecificDate(Integer sportFieldId, LocalDate specificDate){
        Optional<Availability> searchedAvailability = availabilityRespository.findBySportFieldIdAndSpecificDate(sportFieldId, specificDate);
        if(!searchedAvailability.isPresent()){
            return null;
        }else{
            return AvailabilityMapper.toDTO(searchedAvailability.get());
        }
    }
}

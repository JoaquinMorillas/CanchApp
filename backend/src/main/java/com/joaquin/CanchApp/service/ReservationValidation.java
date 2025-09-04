package com.joaquin.CanchApp.service;

import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.joaquin.CanchApp.dto.ReservationDTO;
import com.joaquin.CanchApp.dto.SlotDTO;
import com.joaquin.CanchApp.entity.SportField;
import com.joaquin.CanchApp.exception.StablishmentIdNotFoundException;
import com.joaquin.CanchApp.repository.SportFieldRepository;

@Component
public class ReservationValidation {
    @Autowired
    private SportFieldRepository sportFieldRepository;
     
    public boolean checkReservationDuration(ReservationDTO reservation, List<SlotDTO> slots) throws StablishmentIdNotFoundException{
        
        
        SportField sportField = sportFieldRepository.findById(reservation.getStablishmentId())
        .orElseThrow(() -> new StablishmentIdNotFoundException(reservation.getStablishmentId()));
        
        Duration expectedDuration = sportField.getReservationDuration();
        Duration supliedDuration = Duration.between(reservation.getBeginingHour(),reservation.getFinishingHour());

        return expectedDuration.equals(supliedDuration);
    }

    public boolean checkBeginingHour(ReservationDTO reservation, List<SlotDTO> slots){
        List<LocalTime> beginingTimes = new ArrayList<>();

        for(SlotDTO slot : slots){
            if(slot.isReserved() != true){
                beginingTimes.add(slot.getBeginingTime());
            }
        }

        return beginingTimes.contains(reservation.getBeginingHour());
    }
}

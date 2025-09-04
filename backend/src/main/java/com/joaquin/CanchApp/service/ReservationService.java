package com.joaquin.CanchApp.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joaquin.CanchApp.dto.AvailabilityDTO;
import com.joaquin.CanchApp.dto.ReservationDTO;
import com.joaquin.CanchApp.dto.SlotDTO;

import com.joaquin.CanchApp.entity.Reservation;
import com.joaquin.CanchApp.entity.ReservationStatus;
import com.joaquin.CanchApp.entity.SportField;
import com.joaquin.CanchApp.entity.User;

import com.joaquin.CanchApp.exception.ReservationIdNotFoundException;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;

import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.mapper.ReservationMapper;

import com.joaquin.CanchApp.repository.ReservationRepository;
import com.joaquin.CanchApp.repository.SportFieldRepository;
import com.joaquin.CanchApp.repository.UserRepository;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SportFieldRepository sportFieldRepository;
    @Autowired
    private AvailabilityService availabilityService;


    // this is supposed to be used for the frontend just to show if the slots is free or not, so the slotDTO doesnt have user information
    public List<SlotDTO> getSlots(Integer sportFieldId, LocalDate date) throws SportFieldIdNotFoundException{
        List<SlotDTO> slots = new ArrayList<>();
        List<ReservationDTO> reservations = findBySportFieldIdAndDate(sportFieldId, date);
        Optional<SportField> sportFieldDTO = sportFieldRepository.findById(sportFieldId);
        AvailabilityDTO availabilityDTOForSpecificDate = availabilityService.findBySportFieldIdAndSpecificDate(sportFieldId, date);
        
        if(availabilityDTOForSpecificDate != null){
            Duration duration = sportFieldDTO.get().getReservationDuration();
            LocalTime beginingTime = availabilityDTOForSpecificDate.getBeginingTime();
            LocalTime endingTime = availabilityDTOForSpecificDate.getEndingTime();
            
            while(!beginingTime.plus(duration).isAfter(endingTime)|| beginingTime.plus(duration).equals(endingTime)){
                LocalTime endTime = beginingTime.plus(duration);
                slots.add(new SlotDTO(sportFieldId, beginingTime, endTime, false));
                beginingTime = endTime;
            }

            for(SlotDTO slotDTO : slots){
                for(ReservationDTO reservation: reservations){
                   if(reservation.getReservationStatus() == ReservationStatus.CONFIRMED){
                        slotDTO.setReserved(true);
                        
                    }
                }
            }
        }else{

            List<AvailabilityDTO> availabilities = availabilityService.findBySportFieldId(sportFieldId);
            AvailabilityDTO todayAvailabilityDTO = null;
            for(AvailabilityDTO availabilityDTO: availabilities){
                if(availabilityDTO.getDayOfWeek() == date.getDayOfWeek()){
                    todayAvailabilityDTO = availabilityDTO;
                }
            }
            if(todayAvailabilityDTO == null){
                return slots;
            }
            Duration duration = sportFieldDTO.get().getReservationDuration();
            LocalTime beginingTime = todayAvailabilityDTO.getBeginingTime();
            LocalTime endingTime = todayAvailabilityDTO.getEndingTime();

            
            while(beginingTime.plus(duration).isBefore(endingTime) || beginingTime.plus(duration).equals(endingTime)){
               
                if(beginingTime.plus(duration).equals(LocalTime.MIDNIGHT)|| beginingTime.plus(duration).isBefore(beginingTime)){
                    break;
                }
                LocalTime endSlot = beginingTime.plus(duration);
                slots.add(new SlotDTO(sportFieldId, beginingTime, endSlot, false));
                beginingTime = endSlot;

            }

            for(SlotDTO slotsDTO : slots){
                for(ReservationDTO reservation: reservations){
                    if(reservation.getBeginingHour() == slotsDTO.getBeginingTime() && 
                    reservation.getReservationStatus() == ReservationStatus.CONFIRMED){
                        slotsDTO.setReserved(true);
                    }
                }
            }
            
        }
        return slots;
    }

    // this method returns all the reservation DTO to be used later for the owner to be able to see the user that made the reservation
    public List<ReservationDTO> findBySportFieldIdAndDate(Integer sportFieldId, LocalDate date){
        List<ReservationDTO> dtos = new ArrayList<>();
        List<Reservation> reservations = reservationRepository.findBySportFieldIdAndReservationDate(sportFieldId, date);

        for(Reservation reservation: reservations){
            dtos.add(ReservationMapper.toDTO(reservation));
        }

        return dtos;
    }
    /*Deprecated now it is used confirmReservation
     * 
     * 
     public ReservationDTO saveReservation(ReservationDTO dto) throws UserIdNotFoundException, SportFieldIdNotFoundException, StablishmentIdNotFoundException, DurationLenghtDifferentFromExpected, ReservationBeginingHourNotAvailableException{
         
         User user = userRepository.findById(dto.getUserId())
         .orElseThrow(() -> new UserIdNotFoundException(dto.getUserId()));
 
         SportField sportField = sportFieldRepository.findById(dto.getStablishmentId())
         .orElseThrow(()-> new SportFieldIdNotFoundException(dto.getStablishmentId()));
         
         List<SlotDTO> slots = getSlots(sportField.getId(), dto.getReservationDate());
          // check duration
         if(reservationValidation.checkReservationDuration(dto, slots) != true){
             throw new DurationLenghtDifferentFromExpected(sportField.getReservationDuration(), dto.getBeginingHour(), dto.getFinishingHour());
         }
         //check if begining time corresponds with an available slot
         if(reservationValidation.checkBeginingHour(dto, slots) != true){
             throw new ReservationBeginingHourNotAvailableException(dto.getBeginingHour()); 
         }
 
         Reservation reservationToSave = Reservation.builder()
         .user(user)
         .sportField(sportField)
         .reservationDate(dto.getReservationDate())
         .startTime(dto.getBeginingHour())
         .finishTime(dto.getFinishingHour())
         .reservationStatus(ReservationStatus.CONFIRMED)
         .createdAt(LocalDateTime.now())
         .build();
 
         reservationRepository.save(reservationToSave);
 
         return ReservationMapper.toDTO(reservationToSave);
     }
     */

    // this is used in the fronted to create all the reservation between two given dates
    public List<ReservationDTO> generateSlotsForDateRange (Integer sportFieldId,
                                                            LocalDate beginingDate,
                                                            LocalDate endingDate) 
                                                            throws SportFieldIdNotFoundException{

        List<ReservationDTO> createdReservations = new ArrayList<>();

        SportField sportField = sportFieldRepository.findById(sportFieldId)
        .orElseThrow(() -> new SportFieldIdNotFoundException(sportFieldId));

        Duration duration = sportField.getReservationDuration();

        for(LocalDate date = beginingDate; !date.isAfter(endingDate); date = date.plusDays(1)){
            LocalDate currentDate = date;

            List<Reservation> existingReservations = reservationRepository.findBySportFieldIdAndReservationDate(sportFieldId, currentDate);

            if(!existingReservations.isEmpty()){
                continue;
            }

            //If specialDate
            AvailabilityDTO availabilityForDate = availabilityService.findBySportFieldIdAndSpecificDate(sportFieldId, currentDate);

            if(availabilityForDate == null){
                List<AvailabilityDTO> availabilities = availabilityService.findBySportFieldId(sportFieldId);
                availabilityForDate = availabilities.stream()
                .filter((a) -> a.getDayOfWeek().toString().equals(currentDate.getDayOfWeek().toString()))
                .findFirst()
                .orElse(null);
            }

            if (availabilityForDate == null){
                continue;
            }

            LocalTime begin = availabilityForDate.getBeginingTime();
            LocalTime end = availabilityForDate.getEndingTime();

            while (begin.plus(duration).isBefore(end) || begin.plus(duration).equals(end))  {
                if(begin.plus(duration) == LocalTime.MIDNIGHT || begin.isBefore(availabilityForDate.getBeginingTime())){
                    break;
                }
                Reservation slot = Reservation.builder()
                    .sportField(sportField)
                    .user(null)
                    .reservationDate(currentDate)
                    .startTime(begin)
                    .finishTime(begin.plus(duration))
                    .reservationStatus(ReservationStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

                reservationRepository.save(slot);

                createdReservations.add(ReservationMapper.toDTO(slot));

                begin = begin.plus(duration);

            }
        }

        return createdReservations;

    }

    public List<ReservationDTO> findByUser(Integer userId){
        List<Reservation> reservations = reservationRepository.findByUserId(userId);
        List<ReservationDTO> dtos = new ArrayList<>();

        for(Reservation reservation : reservations){
            dtos.add(ReservationMapper.toDTO(reservation));
        }
        return dtos;


    }

    public ReservationDTO cancelReservation(Integer reservationId) throws ReservationIdNotFoundException{
        Reservation searchedReservation = reservationRepository.findById(reservationId)
        .orElseThrow(()-> new ReservationIdNotFoundException(reservationId));
        
        searchedReservation.setReservationStatus(ReservationStatus.CANCELLED);

        reservationRepository.save(searchedReservation);
        
        return ReservationMapper.toDTO(searchedReservation);
    }

    public ReservationDTO confirmReservarion(Integer reservationId, Integer userId) throws ReservationIdNotFoundException, UserIdNotFoundException{
        Reservation searchedReservation = reservationRepository.findById(reservationId)
        .orElseThrow(() -> new ReservationIdNotFoundException(reservationId));
         
        User searchedUser = userRepository.findById(userId)
        .orElseThrow(() -> new UserIdNotFoundException(userId));

        searchedReservation.setReservationStatus(ReservationStatus.CONFIRMED);
        searchedReservation.setUser(searchedUser);

        reservationRepository.save(searchedReservation);

        return ReservationMapper.toDTO(searchedReservation);
    }

}

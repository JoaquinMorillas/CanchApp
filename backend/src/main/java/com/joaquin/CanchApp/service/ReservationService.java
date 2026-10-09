package com.joaquin.CanchApp.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import com.joaquin.CanchApp.dto.AvailabilityDTO;
import com.joaquin.CanchApp.dto.ReservationDTO;
import com.joaquin.CanchApp.dto.SlotDTO;

import com.joaquin.CanchApp.entity.Reservation;
import com.joaquin.CanchApp.entity.ReservationStatus;
import com.joaquin.CanchApp.entity.Role;
import com.joaquin.CanchApp.entity.Slot;
import com.joaquin.CanchApp.entity.SportField;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.ReservationDateIsBeforeCurrentDate;
import com.joaquin.CanchApp.exception.ReservationIdNotFoundException;
import com.joaquin.CanchApp.exception.ReservationIsAlreadyConfirmedException;
import com.joaquin.CanchApp.exception.ReservationUserIdIsDiferentFromTheIdSuppliedException;
import com.joaquin.CanchApp.exception.ReservationUserIsNullException;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;

import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.exception.UserIsNotTheOwnerException;
import com.joaquin.CanchApp.mapper.ReservationMapper;
import com.joaquin.CanchApp.mapper.SlotMapper;
import com.joaquin.CanchApp.repository.ReservationRepository;
import com.joaquin.CanchApp.repository.SlotRepository;
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
    @Autowired
    private EmailService emailService;
    @Autowired
    private SlotRepository slotRepository;


        // this is supposed to be used for the frontend just to show if the slots is free or not, so the slotDTO doesnt have user information
        public List<SlotDTO> getSlots(Integer sportFieldId, LocalDate date) throws SportFieldIdNotFoundException{
            List<Slot> slots = slotRepository.findBySportFieldIdAndReservationDate(sportFieldId, date);
            List<SlotDTO> dtos = slots.stream()
                                    .map(SlotMapper::toDTO)
                                    .collect(Collectors.toList());
            return dtos;
            

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
        

        // this is used in the fronted to create all the reservation between two given dates
        public List<SlotDTO> generateSlotsForDateRange (Integer sportFieldId,
                                                        LocalDate beginingDate,
                                                        LocalDate endingDate,
                                                        User user) 
                                                        throws SportFieldIdNotFoundException, UserIsNotTheOwnerException{

            List<Slot> createdSlots = new ArrayList<>();

            SportField sportField = sportFieldRepository.findById(sportFieldId)
            .orElseThrow(() -> new SportFieldIdNotFoundException(sportFieldId));

            boolean isAdmin = user.getRole().equals(Role.ADMIN);
            boolean isOwner = user.getId().equals(sportField.getStablishment().getOwner().getId());
            boolean canCreateSlots = isAdmin || isOwner;                                                            
            if(!canCreateSlots){
                throw new UserIsNotTheOwnerException();
            }
            Duration duration = sportField.getReservationDuration();

            for(LocalDate date = beginingDate; !date.isAfter(endingDate); date = date.plusDays(1)){
                LocalDate currentDate = date;

                List<Slot> existingReservations = slotRepository.findBySportFieldIdAndReservationDate(sportFieldId, currentDate);

                if(!existingReservations.isEmpty()){
                    continue;
                }
                if (currentDate.isBefore(LocalDate.now())) {
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

                if (availabilityForDate == null
                    || !availabilityForDate.isActive()
                    || availabilityForDate.getBeginingTime() == null
                    || availabilityForDate.getEndingTime() == null
                ){
                    continue;
                }

                LocalTime begin = availabilityForDate.getBeginingTime();
                LocalTime end = availabilityForDate.getEndingTime();

                while (begin.plus(duration).isBefore(end) || begin.plus(duration).equals(end))  {
                    if(begin.plus(duration).equals(LocalTime.MIDNIGHT ) || begin.isBefore(availabilityForDate.getBeginingTime())){
                        break;
                    }
                    Slot slot = Slot.builder()
                        .sportField(sportField)
                        .reservationDate(currentDate)
                        .startTime(begin)
                        .finishTime(begin.plus(duration))
                        .build();

                    slotRepository.save(slot);

                    createdSlots.add(slot);

                    begin = begin.plus(duration);

                }
            }
            List<SlotDTO> dtos = createdSlots.stream()
                                .map(SlotMapper::toDTO)
                                .collect(Collectors.toList());
            return dtos;

        }

        public List<ReservationDTO> findByUser(Integer userId, User user) throws UserIsNotTheOwnerException{
            boolean isAdmin = user.getRole().equals(Role.ADMIN);
            boolean isUser = user.getId().equals(userId);
            boolean canFind = isAdmin || isUser;
            if(!canFind){
                throw new UserIsNotTheOwnerException();
            }
            List<Reservation> reservations = reservationRepository.findByUserId(userId);
            List<ReservationDTO> dtos = new ArrayList<>();

            for(Reservation reservation : reservations){
                dtos.add(ReservationMapper.toDTO(reservation));
            }
            return dtos;


        }

        public ReservationDTO cancelReservation(
            Integer reservationId, 
            User user) 
            throws ReservationIdNotFoundException, ReservationUserIsNullException, UserIsNotTheOwnerException{
            
            Reservation searchedReservation = reservationRepository.findById(reservationId)
            .orElseThrow(()-> new ReservationIdNotFoundException(reservationId));
            
            if(searchedReservation.getUser() == null){
                throw new ReservationUserIsNullException();
            }

            boolean isUser = searchedReservation.getUser().getId().equals(user.getId());
            boolean isOwner = searchedReservation.getSportField().getStablishment().getOwner().getId().equals(user.getId());
            boolean isAdmin = user.getRole().equals(Role.ADMIN);

            boolean canCancel = isUser || isOwner || isAdmin;
            if(!canCancel){
                
                throw new UserIsNotTheOwnerException();
            }
            

            searchedReservation.setReservationStatus(ReservationStatus.CANCELLED);

            reservationRepository.save(searchedReservation);
            
            Slot searchedSlot = slotRepository.findBySportFieldIdAndReservationDateAndStartTime(
                searchedReservation.getSportField().getId(), searchedReservation.getReservationDate(), searchedReservation.getStartTime()
            ).orElseThrow(() -> new RuntimeException("No se encontro el slot"));
            
            searchedSlot.setAvailable(true);
            slotRepository.save(searchedSlot);
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formatedDate = searchedReservation.getReservationDate().format(formatter);
            
            emailService.sendCancelReservationEmail(searchedReservation.getUser().getEmail(),
             searchedReservation.getUser().getFirstName(), 
             searchedReservation.getSportField().getName(), 
             searchedReservation.getSportField().getStablishment().getName(), 
             formatedDate, 
             searchedReservation.getStartTime().toString(), 
             searchedReservation.getSportField().getStablishment().getTelephoneNumber());
            
            return ReservationMapper.toDTO(searchedReservation);
        }

        public ReservationDTO confirmReservarion(Integer slotId, 
            User user) 
            throws ReservationIdNotFoundException, UserIdNotFoundException, ReservationIsAlreadyConfirmedException, ReservationDateIsBeforeCurrentDate{

            Slot searchedSlot = slotRepository.findById(slotId)
            .orElseThrow(() -> new ReservationIdNotFoundException(slotId));
            
            

            if(!searchedSlot.isAvailable()){
                throw new ReservationIsAlreadyConfirmedException();
            }
            if(searchedSlot.getReservationDate().isBefore(LocalDate.now())){
                throw new ReservationDateIsBeforeCurrentDate();
            };


            
            searchedSlot.setAvailable(false);
            Reservation savedReservation = Reservation.builder()
                                            .user(user)
                                            .sportField(searchedSlot.getSportField())
                                            .reservationDate(searchedSlot.getReservationDate())
                                            .startTime(searchedSlot.getStartTime())
                                            .finishTime(searchedSlot.getFinishTime())
                                            .reservationStatus(ReservationStatus.CONFIRMED)
                                            .createdAt(LocalDateTime.now())
                                            .build();

            reservationRepository.save(savedReservation);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formatedDate = savedReservation.getReservationDate().format(formatter);

            String location = savedReservation.getSportField().getStablishment().getAddress().getStreet() 
                            + " " + savedReservation.getSportField().getStablishment().getAddress().getNumber()
                            + ", "  + savedReservation.getSportField().getStablishment().getAddress().getCity();
            emailService.sendConfirmReservarionEmail(
                user.getEmail(), 
                user.getFirstName(), 
                savedReservation.getSportField().getName(), 
                savedReservation.getSportField().getStablishment().getName(), 
                formatedDate, 
                savedReservation.getStartTime().toString(), 
                location
            );

            return ReservationMapper.toDTO(savedReservation);
        }

    }

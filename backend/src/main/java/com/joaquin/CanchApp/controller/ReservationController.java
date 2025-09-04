package com.joaquin.CanchApp.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.CanchApp.dto.ReservationDTO;
import com.joaquin.CanchApp.dto.SlotDTO;

import com.joaquin.CanchApp.exception.ReservationIdNotFoundException;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;

import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.service.ReservationService;



@RestController
@RequestMapping("/reservation")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @GetMapping("sport-field/{id}/slots")
    public ResponseEntity<List<SlotDTO>> findSlots(@PathVariable Integer id, @RequestParam LocalDate date) throws SportFieldIdNotFoundException{
        List<SlotDTO> slots = reservationService.getSlots(id, date);
        return ResponseEntity.ok(slots);
    }

    @GetMapping("/sport-field/{id}")
    public ResponseEntity<List<ReservationDTO>> findBySportFieldAndDate(@PathVariable Integer id,
    @RequestParam LocalDate date){
        List<ReservationDTO> dtos = reservationService.findBySportFieldIdAndDate(id, date);
        return ResponseEntity.ok(dtos);
    }
    /*Deprecated now it is used confirmReservation
     * 
     @PostMapping("/save")
     public ResponseEntity<ReservationDTO> save(@RequestBody ReservationDTO dto) throws UserIdNotFoundException, SportFieldIdNotFoundException, StablishmentIdNotFoundException, DurationLenghtDifferentFromExpected, ReservationBeginingHourNotAvailableException{
         ReservationDTO reservationDTO = reservationService.saveReservation(dto);
         return ResponseEntity.ok(reservationDTO);
     }
     */

    @PostMapping("/generate-slots")
    public ResponseEntity<List<ReservationDTO>> generateSlotsForDateRange(
        @RequestParam Integer sportFieldId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) throws SportFieldIdNotFoundException{
        List<ReservationDTO> slots = reservationService.generateSlotsForDateRange(sportFieldId, startDate, endDate);
        return ResponseEntity.ok(slots);
    }



    @GetMapping("/user/{id}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByUserId(@PathVariable Integer id){
        List<ReservationDTO> dtos = reservationService.findByUser(id);
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ReservationDTO> cancelReservation(@PathVariable Integer id) throws ReservationIdNotFoundException{
        ReservationDTO dto = reservationService.cancelReservation(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/confirm/{sportFieldId}/{userId}")
    public ResponseEntity<ReservationDTO> confirmReservation(@PathVariable Integer sportFieldId, @PathVariable Integer userId) throws ReservationIdNotFoundException, UserIdNotFoundException{
        ReservationDTO dto = reservationService.confirmReservarion(sportFieldId, userId);
        return ResponseEntity.ok(dto);
    }
}

package com.joaquin.CanchApp.service.job;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.joaquin.CanchApp.entity.Reservation;
import com.joaquin.CanchApp.entity.ReservationStatus;
import com.joaquin.CanchApp.repository.ReservationRepository;

import jakarta.transaction.Transactional;

@Component
public class ReservationAutoFullfiledJob {

    @Autowired
    ReservationRepository reservationRepository;

    @Transactional
    @Scheduled(cron = "0 */30 * * * *")
    public void fullfiledReservations(){
        
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().plusSeconds(1);

        List<Reservation> reservationsToFullfiled = reservationRepository.findReservationsToFullfiled(ReservationStatus.CONFIRMED, today, now);

        
        List<Reservation> reservationsToUpdate = new ArrayList<>();

        for (Reservation reservation : reservationsToFullfiled){
            
            reservation.setReservationStatus(ReservationStatus.FULLFILED);
            reservationsToUpdate.add(reservation);
            
        }

        if(!reservationsToUpdate.isEmpty()){
            reservationRepository.saveAll(reservationsToUpdate);
        }
        System.out.println("Reservations Fullfiled: " + reservationsToUpdate.size());
        
    }
}

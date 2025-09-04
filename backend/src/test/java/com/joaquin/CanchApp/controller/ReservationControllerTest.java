package com.joaquin.CanchApp.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.greaterThan;

import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.test.web.servlet.MockMvc;

import com.joaquin.CanchApp.dto.ReservationDTO;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;
import com.joaquin.CanchApp.service.ReservationService;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
public class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReservationService reservationService;

    private List<Integer> reservationsIds = new ArrayList<>();

    @BeforeEach
    public void dataLoad() throws SportFieldIdNotFoundException {
        
        List<ReservationDTO> dtosSaved = reservationService.generateSlotsForDateRange(1, LocalDate.of(2025, 12, 24), LocalDate.of(2025, 12, 25));

        reservationsIds = dtosSaved.stream()
        .map(ReservationDTO::getId)
        .collect(Collectors.toList());
        

    }

    @Test
    void testCancelReservation() throws Exception {
        Integer reservationId = reservationsIds.get(0);
        reservationService.confirmReservarion(reservationId, 1);

        mockMvc.perform(put("/reservation/cancel/" + reservationId))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id").value(reservationId))
                        .andExpect(jsonPath("$.reservationStatus").value("CANCELLED"));
                        
                        
    }
    
    @Test
    void testConfirmReservation() throws Exception {
        mockMvc.perform(put("/reservation/confirm/" + reservationsIds.get(0) + "/1"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id").value(reservationsIds.get(0)))
                        .andExpect(jsonPath("$.userId").value("1"))
                        .andExpect(jsonPath("$.reservationStatus").value("CONFIRMED"));
    }

    @Test
    void testFindBySportFieldAndDate() throws Exception {
        mockMvc.perform(get("/reservation/sport-field/" + reservationsIds.get(0) + "?date=2025-12-24"))
                        .andExpect(status().isOk());

    }

    

    @Test
    void testGenerateSlotsForDateRange() throws Exception {
        mockMvc.perform(post("/reservation/generate-slots?sportFieldId=1&startDate=2026-01-01&endDate=2026-01-02"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }

    @Test
    void testGetReservationsByUserId() throws Exception {
        mockMvc.perform(get("/reservation/user/1"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }


}

package com.joaquin.CanchApp.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.DayOfWeek;
import java.time.LocalTime;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.joaquin.CanchApp.dto.AvailabilityDTO;

import com.joaquin.CanchApp.exception.AvailabilityAlreadyExistsException;
import com.joaquin.CanchApp.exception.BeginingTimeIsAfterEndingTimeException;

import com.joaquin.CanchApp.service.AvailabilityService;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
public class AvailabilityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AvailabilityService availabilityService;

    private Integer availabilityId;

    @BeforeEach
    public void dataLoad() throws AvailabilityAlreadyExistsException, BeginingTimeIsAfterEndingTimeException{
        AvailabilityDTO availabilityToSave = AvailabilityDTO.builder()
        .sportFieldId(3)
        .dayOfWeek(DayOfWeek.SATURDAY)
        .beginingTime(LocalTime.of(10, 0, 0))
        .endingTime(LocalTime.of(20, 0, 0))
        .specificDate(null)
        .active(true)
        .build();

        AvailabilityDTO availabilitySaved = availabilityService.save(availabilityToSave);

        availabilityId = availabilitySaved.getId();

    }


    @Test
    void testDeleteAvailability() throws Exception {
        mockMvc.perform(delete("/availability/delete/" + availabilityId))
                        .andExpect(status().isOk());
                        
    }

    @Test
    void testFindByIdExists() throws Exception {
        mockMvc.perform(get("/availability/" + availabilityId)).andExpect(status().isOk());
    }
    @Test
    void testFindByIdNotExists() throws Exception {
        mockMvc.perform(get("/availability/" + "321654987")).andExpect(status().isBadRequest());
    }

    @Test
    void testFindBySportFieldId() throws Exception {
        mockMvc.perform(get("/availability/sportField/1")).andExpect(status().isOk());
    }
   


    @Test
    void testSave() throws Exception {
        String availabilityJson = """
                {
                    "sportFieldId" : 3,
                    "dayOfWeek" : "FRIDAY",
                    "beginingTime" : "15:00",
                    "endingTime" : "23:00",
                    "specificDate" : null,
                    "active" : true
                }
                """;
        
        mockMvc.perform(post("/availability/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(availabilityJson)
                        .accept(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.sportFieldId").value("3"))
                        .andExpect(jsonPath("$.dayOfWeek").value("FRIDAY"))
                        .andExpect(jsonPath("$.beginingTime").value("15:00:00"))
                        .andExpect(jsonPath("$.endingTime").value("23:00:00"))
                        .andExpect(jsonPath("$.specificDate").doesNotExist())
                        .andExpect(jsonPath("$.active").value(true))
                        ;
    }


    @Test
    void testUpdateAvailability() throws Exception {

        String availabilityToUpdate = """
                {
                        "sportFieldId"    : "3",
                        "dayOfWeek"   : "SATURDAY",
                        "beginingTime"    : "15:00",
                        "endingTime"  : "23:00",
                        "specificDate"    : null,
                        "active"  : true
                }

                """;
        mockMvc.perform(put("/availability/update/" + availabilityId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(availabilityToUpdate)
                        .accept(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.sportFieldId").value("3"))
                        .andExpect(jsonPath("$.dayOfWeek").value("SATURDAY"))
                        .andExpect(jsonPath("$.beginingTime").value("15:00:00"))
                        .andExpect(jsonPath("$.endingTime").value("23:00:00"))
                        .andExpect(jsonPath("$.specificDate").doesNotExist())
                        .andExpect(jsonPath("$.active").value(true))
                        ;
    }
}

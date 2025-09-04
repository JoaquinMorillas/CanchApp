package com.joaquin.CanchApp.service;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Duration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.joaquin.CanchApp.dto.SportFieldDTO;
import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.exception.SportFieldNameAlreadyExistsException;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
public class SportFieldServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SportFieldService sportFieldService;

    private Integer sportFieldId;

    @BeforeEach
    public void dataLoad() throws SportFieldNameAlreadyExistsException{
        SportFieldDTO sportFieldTosave = SportFieldDTO.builder() 
                
            .name("cancha 50")
            .stablishmentId(1)
            .price(300.0)
            .reservationDuration(Duration.ofMinutes(60))
            .sport(Sport.FUTBOL_11)
            .build();
            ;
        SportFieldDTO savedDTO = sportFieldService.save(sportFieldTosave);
        sportFieldId = savedDTO.getId();

    }

    @Test
    void testDeleteById() throws Exception {
        mockMvc.perform(delete("/sport_field/delete/" + sportFieldId))
                        .andExpect(status().isOk());
                        
    }

    @Test
    void testFindAll() throws Exception {
        mockMvc.perform(get("/sport_field/all"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }

    @Test
    void testFindByCity() throws Exception {
        mockMvc.perform(get("sport_field/find?city=rio"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }

    @Test
    void testFindById() throws Exception {
        mockMvc.perform(get("/sport_field/" + sportFieldId))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id").value(sportFieldId))
                        .andExpect(jsonPath("$.name").value("cancha 50"))
                        .andExpect(jsonPath("$.stablishmentId").value("1"))
                        .andExpect(jsonPath("$.price").value("300.0"))
                        .andExpect(jsonPath("$.sport").value("FUTBOL_11"));
    }

    @Test
    void testFindByNameAndStablishmentId() throws Exception {
        mockMvc.perform(get("/sport_field/stablishment_id/" + sportFieldId +"/cancha 50"))
                        .andExpect(status().isOk())
                        ;
    }


    @Test
    void testFindbyStablismentId() throws Exception {
        mockMvc.perform(get("/sport_field/stablishment/1"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("[*].id").value(hasItem(sportFieldId)));
    }

    @Test
    void testSave() throws Exception {
        String sportFieldToSave = """
                {
                "name": "cancha 83",
                "stablishmentId": 1,
                "price": 300.0,
                "reservationDuration": "PT1H30M",
                "sport": "FUTBOL_11"
                }
                """;
        
        mockMvc.perform(post("/sport_field/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sportFieldToSave)
                        .accept(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.name").value("cancha 83"));
    }

    @Test
    void testUpdate() throws Exception {
        String sportFieldToUpdate = """
                {
                "name": "cancha 83",
                "stablishmentId": 1,
                "price": 300.0,
                "reservationDuration": "PT1H30M",
                "sport": "FUTBOL_11"
                }
                """;
        mockMvc.perform(put("/sport_field/update/" + sportFieldId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sportFieldToUpdate)
                        .accept(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.name").value("cancha 83"))
                        ;
    }
}

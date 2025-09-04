package com.joaquin.CanchApp.controller;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.joaquin.CanchApp.dto.StablishmentCreationDTO;
import com.joaquin.CanchApp.exception.AddressAlreadyExistsException;
import com.joaquin.CanchApp.exception.StablishmentNameAlreadyExistsException;
import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.service.StablishmentService;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
public class StablishmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StablishmentService stablishmentService;

    private Integer stablishmentId;

    @BeforeEach
    public void dataLoad() throws UserIdNotFoundException, AddressAlreadyExistsException, StablishmentNameAlreadyExistsException{

        StablishmentCreationDTO stablishmentToSave = StablishmentCreationDTO.builder()
                    .ownerId(1)
                    .name("Establecimiento123")
                    .country("Argentina")
                    .province("Chaco")
                    .city("Resistencia")
                    .postalCode("789")
                    .street("Calle falsa")
                    .number("123")
                    .build();

        StablishmentCreationDTO savedStablishment = stablishmentService.save(stablishmentToSave);
        stablishmentId = savedStablishment.getId();
    }

    @Test
    void testDeleteById() throws Exception {
        mockMvc.perform(delete("/stablishment/" + stablishmentId))
                        .andExpect(status().isOk());
    }

    @Test
    void testFindAll() throws Exception {
        mockMvc.perform(get("/stablishment/all"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }

    @Test
    void testFindByCity() throws Exception {
        mockMvc.perform(get("/stablishment/city/Resistencia"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("[*].id").value(hasItem(stablishmentId)));
    }

    @Test
    void testFindById() throws Exception {
        mockMvc.perform(get("/stablishment/" + stablishmentId))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id").value(stablishmentId));
    }

    @Test
    void testFindByName() throws Exception {
        mockMvc.perform(get("/stablishment/name/Establecimiento123"))
                        .andExpect(status().isBadRequest());
                        
    }

    @Test
    void testFindByOwnerID() throws Exception {
        mockMvc.perform(get("/stablishment/user/1"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("[*].id").value(hasItem(stablishmentId)));
    }


    @Test
    void testUpdateStablishment() throws Exception {
        String updatedStablishment = """
                
                {
                    "name" : "Establecimiento Resistencia",
                    "city" : "Bariloche",
                    "street" : " fake street",
                    "number" : "123"
                }
                """;

        mockMvc.perform(put("/stablishment/update/" + stablishmentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedStablishment)
                        .accept(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id").value(stablishmentId))
                        .andExpect(jsonPath("$.name").value("Establecimiento Resistencia"));
    }
}

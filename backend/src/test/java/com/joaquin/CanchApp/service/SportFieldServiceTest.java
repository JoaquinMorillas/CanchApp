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
import org.springframework.security.test.context.support.WithMockUser;
import java.time.Duration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.joaquin.CanchApp.dto.SportFieldDTO;
import com.joaquin.CanchApp.entity.Role;
import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.SportFieldNameAlreadyExistsException;
import com.joaquin.CanchApp.exception.SportNameNotFoundException;
import com.joaquin.CanchApp.exception.StablishmentIdNotFoundException;
import com.joaquin.CanchApp.exception.UserIsNotTheOwnerException;

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
    public void dataLoad() throws SportFieldNameAlreadyExistsException, SportNameNotFoundException, StablishmentIdNotFoundException, UserIsNotTheOwnerException{
        User testUser = User.builder()
                        .id(1)
                        .firstName("juan")
                        .lastName("perez")
                        .email("admin@admin.com")
                        .password("password")
                        .role(Role.ADMIN)
                        .isActive(true)
                        .build();

        SportFieldDTO sportFieldTosave = SportFieldDTO.builder() 
                
            .name("cancha 50")
            .stablishmentId(1)
            .price(300.0)
            .reservationDuration(Duration.ofMinutes(60))
            .sportName("Futbol 11")
            .sportCategory("Futbol")
            .build();
            ;
        SportFieldDTO savedDTO = sportFieldService.save(sportFieldTosave, testUser);
        sportFieldId = savedDTO.getId();

    }

    @Test
    @WithMockUser(username = "test", roles = {"ADMIN"})
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
        mockMvc.perform(get("/sport_field/find?city=rio"))
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
                        .andExpect(jsonPath("$.sportName").value("Futbol 11"));
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


    
}

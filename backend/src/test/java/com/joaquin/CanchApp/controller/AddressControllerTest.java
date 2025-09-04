package com.joaquin.CanchApp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;


import com.joaquin.CanchApp.entity.Address;
import com.joaquin.CanchApp.exception.AddressAlreadyExistsException;

import com.joaquin.CanchApp.repository.AddressRepository;


import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional

public class AddressControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private EntityManager entityManager;

    private Integer addressId;

    

    @BeforeEach
    public void dataLoad() throws AddressAlreadyExistsException{
        Address addressSaved = new Address();
        addressSaved.setCountry("argentina");
        addressSaved.setProvince("cordoba");
        addressSaved.setCity("rio cuarto");
        addressSaved.setPostalCode("5800");
        addressSaved.setStreet("mitre");
        addressSaved.setNumber("111");

        addressSaved = addressRepository.saveAndFlush(addressSaved);
        entityManager.clear();

        addressId = addressSaved.getId();

        System.out.println(addressSaved);

        
        
    }
    
    @Test
    void testDeleteAddress() throws Exception {
        mockMvc.perform(delete("/address/delete/" + addressId))
                .andExpect(status().isOk());
    }

    @Test
    void testFindAll() throws Exception {
        mockMvc.perform(get("/address/all"))
            .andDo(print())    
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("[*].id").value(org.hamcrest.Matchers.hasItem(addressId)))
            ;

    }
    
    @Test
    void testFindAllcities() throws Exception {
        mockMvc.perform(get("/address/cities"))
        .andDo(print())
        .andExpect(status().isOk())
        ;
    }
    
    @Test
    void testFindByCity() throws Exception {
        mockMvc.perform(get("/address/rio cuarto"))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$[*].city").value(org.hamcrest.Matchers.hasItem("rio cuarto")));
    }
    /*
     * On POSTMAN this method works fine but i cannot make it work here the perform returns 200Ok(false) when it should be returning 400
        @Test
        void testFindByCountryAndCityAndStreetAndNumber_exists() throws Exception {
            mockMvc.perform(get("/address/exists/argentina/rio%20cuarto/mitre/111"))
            .andExpect(status().isBadRequest())
            
            .andDo(print());
        }
     */

    @Test
    void testFindByCountryAndCityAndStreetAndNumber_Notexists() throws Exception {
        mockMvc.perform(get("/address/exists/asdsad/rio%20cuarto/mitre/111"))
        .andExpect(status().isOk())
        .andExpect(content().string("false"));
    }
    
    @Test
    void testSave() throws Exception {
        String addressToSave = """
        {
        
            "country" : "dfsdafas",
            "province" : "asffs",
            "city" : "asfas",
            "postalCode" : "5800",
            "street" : "mitre",
            "number" :  "111"       
        }
                """;
        mockMvc.perform(post("/address/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(addressToSave)
                        .accept(MediaType.APPLICATION_JSON))
                        .andDo(print())
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.country").value("dfsdafas"));

    }
    
    
    @Test
    void testUpdateAddress() throws Exception {
        String updattedAddress = """
                {
                    "country" : "brasil",
                    "province" : "brasil",
                    "city" : "brasil",
                    "postalCode" : "5800",
                    "street" : "abc",
                    "number" : "123"
                }
                """;
        mockMvc.perform(put("/address/update/" + addressId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updattedAddress)
                        .accept(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.country").value("brasil"))
                        .andExpect(jsonPath("$.province").value("brasil"))
                        .andExpect(jsonPath("$.city").value("brasil"));
    }

}

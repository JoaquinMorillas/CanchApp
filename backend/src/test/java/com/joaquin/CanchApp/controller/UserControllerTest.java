package com.joaquin.CanchApp.controller;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.joaquin.CanchApp.dto.UserDTO;
import com.joaquin.CanchApp.entity.Role;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.EmailAlreadyExistsExcepction;
import com.joaquin.CanchApp.service.UserService;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    private Integer userId;
    private Integer ownerId;
    private Integer adminId;

    @BeforeEach
    @WithMockUser(username = "test", roles = {"ADMIN"})
    public void dataLoad() throws EmailAlreadyExistsExcepction{
        User admin = User.builder()
        .firstName("usuario1")
        .lastName("lastname1")
        .email("usuario1@lastname1.com")
        .password("hola")
        .role(Role.ADMIN)
        .build();

        User owner = User.builder()
        .firstName("usuario2")
        .lastName("lastname2")
        .email("usuario2@lastname2.com")
        .password("hola")
        .role(Role.OWNER)
        .build();

        User user = User.builder()
        .firstName("usuario3")
        .lastName("lastname3")
        .email("usuario3@lastname3.com")
        .password("hola")
        .role(Role.USER)
        .build();

        UserDTO adminUser = userService.saveUser(admin);
        UserDTO ownerUser = userService.saveUser(owner);
        UserDTO userUser = userService.saveUser(user);

        adminId = adminUser.getId();
        ownerId = ownerUser.getId();
        userId = userUser.getId();
    }

    @Test
    @WithMockUser(username = "test", roles = {"ADMIN"})
    void testDeleteUser() throws Exception {
        
        mockMvc.perform(patch("/user/delete/" + userId))
                .andExpect(status().isOk());
                
    }

    @Test
    void testFindAllOwners() throws Exception {
        mockMvc.perform(get("/user/owners"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$",hasSize(greaterThan(0))))
                        .andExpect(jsonPath("[*].id").value(hasItem(ownerId)));
    }


    @Test
    void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/user/all"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$",hasSize(greaterThan(2))));
    }

    @Test
    void testGetUserByEmail() throws Exception {
        mockMvc.perform(get("/user/email/usuario1@lastname1.com"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id").value(adminId));
    }

    @Test
    void testGetUserById() throws Exception {
        mockMvc.perform(get("/user/" + adminId))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.email").value("usuario1@lastname1.com"));
    }


}

package com.joaquin.CanchApp.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.greaterThan;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;

import com.joaquin.CanchApp.dto.ReservationDTO;
import com.joaquin.CanchApp.dto.SlotDTO;
import com.joaquin.CanchApp.dto.UserDTO;
import com.joaquin.CanchApp.entity.Availability;
import com.joaquin.CanchApp.entity.Reservation;
import com.joaquin.CanchApp.entity.ReservationStatus;
import com.joaquin.CanchApp.entity.Role;
import com.joaquin.CanchApp.entity.Slot;
import com.joaquin.CanchApp.entity.SportField;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.EmailAlreadyExistsExcepction;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;
import com.joaquin.CanchApp.exception.UserIsNotTheOwnerException;
import com.joaquin.CanchApp.repository.AvailabilityRespository;
import com.joaquin.CanchApp.repository.ReservationRepository;

import com.joaquin.CanchApp.repository.SportFieldRepository;
import com.joaquin.CanchApp.repository.UserRepository;
import com.joaquin.CanchApp.service.ReservationService;
import com.joaquin.CanchApp.service.UserService;

import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
public class ReservationControllerTest {

    @Autowired 
    private UserRepository userRepository;

    @Autowired 
    private UserService userService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private AvailabilityRespository availabilityRepository;

    @Autowired
    private SportFieldRepository sportFieldRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    private List<Integer> reservationsIds = new ArrayList<>();
    
    private Integer userId;
    private Integer ownerId;
    private Integer adminId;

    @BeforeEach
    @WithMockUser(username = "test", roles = {"ADMIN"})
    public void dataLoad() throws EmailAlreadyExistsExcepction, SportFieldIdNotFoundException, UserIsNotTheOwnerException{
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

        SportField field = sportFieldRepository.findById(1)
        .orElseThrow(() -> new SportFieldIdNotFoundException(1));



        Availability thu = Availability.builder()
            .sportField(field)
            .dayOfWeek(DayOfWeek.THURSDAY)
            .beginingTime(LocalTime.of(14, 0))
            .endingTime(LocalTime.of(23, 0))
            .specificDate(null)
            .active(true)
            .build();

        availabilityRepository.save(thu);
        availabilityRepository.flush();
        
        Availability wed = Availability.builder()
            .sportField(field)
            .dayOfWeek(DayOfWeek.WEDNESDAY)
            .beginingTime(LocalTime.of(14, 0))
            .endingTime(LocalTime.of(23, 0))
            .specificDate(null)
            .active(true)
            .build();

        availabilityRepository.save(wed);
        availabilityRepository.flush();
        
        List<SlotDTO> dtosSaved = reservationService.generateSlotsForDateRange(1, LocalDate.of(2025, 12, 24), LocalDate.of(2025, 12, 25), admin);

        reservationsIds = dtosSaved.stream()
        .map(SlotDTO::getId)
        .collect(Collectors.toList());
        
        Reservation r = Reservation.builder()
            .sportField(field)
            .reservationDate(LocalDate.of(2025, 12, 24))
            .startTime(LocalTime.of(14,0))
            .finishTime(LocalTime.of(16,0))
            .reservationStatus(ReservationStatus.CONFIRMED)
            .createdAt(LocalDateTime.now())
            .build();

        reservationRepository.save(r);
        reservationsIds = List.of(r.getId());


        assertThat(reservationsIds).isNotEmpty();
        assertThat(reservationsIds).hasSizeGreaterThan(0);
    }


    @Test
    @WithUserDetails(value = "usuario3@lastname3.com", 
        userDetailsServiceBeanName = "userDetailsService",
        setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void testCancelReservation() throws Exception {
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User de test no encontrado"));

        Integer reservationId = reservationsIds.get(0);
        reservationService.confirmReservarion(reservationId, user);

        mockMvc.perform(put("/reservation/cancel/" + reservationId))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id").value(reservationId))
                        .andExpect(jsonPath("$.reservationStatus").value("CANCELLED"));
                        
                        
    }
    
    @Test
    @WithUserDetails(value = "usuario1@lastname1.com", 
        userDetailsServiceBeanName = "userDetailsService",
        setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void testConfirmReservation() throws Exception {
        mockMvc.perform(put("/reservation/confirm/" + reservationsIds.get(0)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id").value(reservationsIds.get(0)))
                        .andExpect(jsonPath("$.userId").value("1"))
                        .andExpect(jsonPath("$.reservationStatus").value("CONFIRMED"));
    }

    @Test
    @WithUserDetails(value = "usuario1@lastname1.com", 
        userDetailsServiceBeanName = "userDetailsService",
        setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void testFindBySportFieldAndDate() throws Exception {
        mockMvc.perform(get("/reservation/sport-field/" + reservationsIds.get(0) + "?date=2025-12-24"))
                        .andExpect(status().isOk());

    }

    

    @Test
    @WithUserDetails(value = "usuario1@lastname1.com", 
        userDetailsServiceBeanName = "userDetailsService",
        setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void testGenerateSlotsForDateRange() throws Exception {
        mockMvc.perform(post("/reservation/generate-slots?sportFieldId=1&startDate=2027-01-01&endDate=2027-01-02"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }

    @Test
    @WithUserDetails(value = "usuario1@lastname1.com", 
        userDetailsServiceBeanName = "userDetailsService",
        setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void testGetReservationsByUserId() throws Exception {
        mockMvc.perform(get("/reservation/user/1"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }

 
}

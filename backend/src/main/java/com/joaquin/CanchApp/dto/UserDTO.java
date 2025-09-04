package com.joaquin.CanchApp.dto;

import java.util.List;

import com.joaquin.CanchApp.entity.Role;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserDTO {

    private Integer id;
    private String name;
    private String lastName;
    private String email;
    private Role role;
    private List<ReservationDTO> reservations;
    private List<StablishmentDTO> stablishments;
}

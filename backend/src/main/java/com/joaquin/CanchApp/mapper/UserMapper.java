package com.joaquin.CanchApp.mapper;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.stream.Collectors;

import com.joaquin.CanchApp.dto.UserDTO;
import com.joaquin.CanchApp.entity.User;

public class UserMapper {
    public static UserDTO toDTO(User user){
        return UserDTO.builder()
        .id(user.getId())
        .name(user.getFirstName())
        .lastName(user.getLastName())
        .email(user.getEmail())
        .role(user.getRole())
        .reservations(
            user.getReservations() != null
            ? user.getReservations().stream()
            .map(ReservationMapper::toDTO)
            .collect(Collectors.toList())
            :new ArrayList<>()
            )
        .stablishments(
            user.getStablishments() != null
            ? user.getStablishments().stream()
            .map(StablishmentMapper::toDTO)
            .collect(Collectors.toList())
            :new ArrayList<>()
        )
        .favoritesStablishments(
            user.getFavoritesStablishments().size() > 0
            ? user.getFavoritesStablishments().stream()
            .map(StablishmentMapper::toDTO)
            .collect(Collectors.toSet())
            :new HashSet<>()
        )
        .build();
    }
}

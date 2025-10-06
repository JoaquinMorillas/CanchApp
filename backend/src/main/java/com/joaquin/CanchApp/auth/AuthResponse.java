package com.joaquin.CanchApp.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken; //accessToken short expiration
    private String refreshToken; //refreshToken long exipiration
}

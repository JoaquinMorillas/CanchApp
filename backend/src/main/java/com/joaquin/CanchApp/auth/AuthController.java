package com.joaquin.CanchApp.auth;



import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.CanchApp.exception.EmailAlreadyExistsExcepction;
import com.joaquin.CanchApp.exception.InvalidEmailException;
import com.joaquin.CanchApp.exception.TokenIsExipiredException;
import com.joaquin.CanchApp.exception.UserEmailNotFoundException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @RequestBody LoginRequest loginRequest
    ){
        AuthResponse response = authService.login(loginRequest);

        // DEV ONLY: store refresh token in response body
        // PRODUCTION: set httpOnly cookie instead
        /*
         * 
         ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
         .httpOnly(true)
         .secure(false)  // set true in production with HTTPS
         .maxAge(Duration.ofDays(30))
         .path("/")
         .sameSite("Lax")
         .build();
         */

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
        @RequestBody RegisterRequest registerRequest
    ) throws EmailAlreadyExistsExcepction, InvalidEmailException{
        
        if(registerRequest.getEmail().equals("") || registerRequest.getName().equals("") || registerRequest.getLastName().equals("") || registerRequest.getPassword().equals("")){
            return ResponseEntity.badRequest().build();
        }
        AuthResponse response = authService.registration(registerRequest);

        // DEV ONLY: store refresh token in response body
        // PRODUCTION: set httpOnly cookie instead
        /*
         * 
         ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
         .httpOnly(true)
         .secure(false)  // set true in production with HTTPS
         .maxAge(Duration.ofDays(30))
         .path("/")
         .sameSite("Lax")
         .build();
         */


        return ResponseEntity.ok(response);
    }

 
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
        @RequestBody Map<String, String> body
    ) throws TokenIsExipiredException, UserEmailNotFoundException{
        if(body == null || !body.containsKey("refreshToken")){
            return ResponseEntity.badRequest().build();
        }
        String refreshToken = body.get("refreshToken");
        AuthResponse response = authService.refresh(refreshToken);
        return ResponseEntity.ok(response);
    }
 
}

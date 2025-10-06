package com.joaquin.CanchApp.auth;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.joaquin.CanchApp.entity.Role;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.EmailAlreadyExistsExcepction;
import com.joaquin.CanchApp.exception.InvalidEmailException;
import com.joaquin.CanchApp.exception.TokenIsExipiredException;
import com.joaquin.CanchApp.repository.UserRepository;
import com.joaquin.CanchApp.service.EmailService;
import com.joaquin.CanchApp.exception.UserEmailNotFoundException;

@Service
public class AuthService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    public AuthResponse registration(RegisterRequest registerRequest) throws EmailAlreadyExistsExcepction, InvalidEmailException{
        Optional<User> searchedUser = userRepository.findByEmail(registerRequest.getEmail());
        if(searchedUser.isPresent()){
            throw new EmailAlreadyExistsExcepction(searchedUser.get().getEmail());   
        }
        final String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        final  Pattern emailPattern = Pattern.compile(emailRegex);

        if (!emailPattern.matcher(registerRequest.getEmail()).matches()){
            throw new InvalidEmailException(registerRequest.getEmail());
        }

        User userToSave = User.builder()
                            .firstName(registerRequest.getName())
                            .lastName(registerRequest.getLastName())
                            .email(registerRequest.getEmail())
                            .password(passwordEncoder.encode(registerRequest.getPassword()))
                            .createdAt(LocalDate.now())
                            .role(Role.USER)
                            .build();
        userRepository.save(userToSave);              

        String accessToken = jwtService.generateAccessToken(userToSave.getUsername(),buildClaims(userToSave));
        String refreshToken = jwtService.generateRefreshToken(userToSave.getUsername());

        emailService.sendRegisterEmail(userToSave.getUsername(), userToSave.getFirstName());
        
        return AuthResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .build();
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), 
                loginRequest.getPassword()
                )
        );

        User user = (User) auth.getPrincipal();

        String accessToken = jwtService.generateAccessToken(user.getUsername(), buildClaims(user));
        String refreshToken = jwtService.generateRefreshToken(user.getUsername());

        return AuthResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .build();

        }

    private Map<String, Object> buildClaims(User user){
            Map<String, Object> claims = new HashMap<>();

            claims.put("roles", user.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList());
            claims.put(("userId"), user.getId());

            claims.put(("firstName"), user.getFirstName());

            claims.put("lastName", user.getLastName());

            return claims;
        }

    public AuthResponse refresh(String refreshToken) throws TokenIsExipiredException, UserEmailNotFoundException{
        if(jwtService.isTokenExpired(refreshToken)){
            throw new TokenIsExipiredException();
        }

        User user = userRepository.findByEmail(jwtService.extractUserName(refreshToken))
        .orElseThrow(() -> new UserEmailNotFoundException(jwtService.extractUserName(refreshToken)));
        Date expiration = jwtService.extractExpiration(refreshToken);
        
        Instant now = Instant.now();
        Instant exp = expiration.toInstant();

        if (now.isAfter(exp)){
            throw new TokenIsExipiredException();
        }

        Instant threshold = now.plus(15, ChronoUnit.DAYS);
        boolean createNewRefreshToken = exp.isBefore(threshold);

        String newAccessToken = jwtService.generateAccessToken(user.getUsername(), buildClaims(user));

        String newRefreshToken = createNewRefreshToken 
                            ? jwtService.generateRefreshToken(user.getUsername())
                            : refreshToken;

        return new AuthResponse(newAccessToken, newRefreshToken);
    }
}



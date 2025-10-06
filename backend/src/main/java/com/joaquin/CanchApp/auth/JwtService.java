package com.joaquin.CanchApp.auth;

import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;



import io.jsonwebtoken.Claims;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    
    private final SecretKey secretKey;
    private final long refreshExpiration;
    private final long accessExpiration;
 
    public JwtService(
        @Value("${jwt.secret}") String secret,
        @Value("${jwt.refresh.expiration}") long refreshExpiration,
        @Value("${jwt.access.expiration}") long accessExpiration
    ){
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.refreshExpiration = refreshExpiration;
        this.accessExpiration = accessExpiration;
    
    }

    public String generateToken(String username, Map<String, Object> claims, long expiration){
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expiration))
                .signWith(secretKey)
                .compact();
    }

    public String generateAccessToken(String userName, Map<String, Object> claims){
        return generateToken(userName, claims, accessExpiration);
    }

    public String generateRefreshToken(String userName){
        return generateToken(userName, Map.of(), refreshExpiration);
    }


    public Claims extractAllClaims(String token){
        try{

            return Jwts
                    .parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }catch (Exception e) {
        System.out.println("JWT parse error: " + e.getMessage());
        throw e;
    }
        }

    public<T> T extractClaim(String token, Function<Claims, T> exctractFunction){
        Claims claims = extractAllClaims(token);
        return exctractFunction.apply(claims);
    }

    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public String extractUserName(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails user){
        final String userName = extractUserName(token);
        return userName.equals(user.getUsername()) && !isTokenExpired(token);
    }


}

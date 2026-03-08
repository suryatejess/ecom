package com.example.ecom_backend.utils;

import com.example.ecom_backend.config.AppConfigurationProperties;
import com.example.ecom_backend.entities.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    public JwtUtil(AppConfigurationProperties properties) {
        this.properties = properties;
        SECRET_KEY = properties.getJwt().getSecret();
    }

    @Autowired
    AppConfigurationProperties properties;

    private String SECRET_KEY = "";
//    private String SECRET_KEY = "TaK+HaV^uvCHEFsEVfypW#7g9^k*Z8$V";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return Long.parseLong(claims.getSubject());
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(AppUser appUser) {
        Map<String, Object> claims = new HashMap<>();

        claims.put("email", appUser.getEmail());
        claims.put("name", appUser.getName());
        claims.put("roleType", appUser.getRoleType());

        return createToken(claims, String.valueOf(appUser.getId()));
    }

    private String createToken(Map<String, Object> claims, String subject) {
        long expirationMs = properties.getJwt().getExpiresIn() * 1000L;
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .header().empty().add("typ","JWT")
                .and()
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public Boolean validateToken(String token) {
        try{
            extractAllClaims(token);
            return !isTokenExpired(token);
        }
        catch(Exception e){
            return false;
        }
    }

}

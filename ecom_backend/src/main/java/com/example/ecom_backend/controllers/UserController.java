package com.example.ecom_backend.controllers;

import com.example.ecom_backend.config.AppConfigurationProperties;
import com.example.ecom_backend.dtos.UserLoginDTO;
import com.example.ecom_backend.dtos.UserSignUpDTO;
import com.example.ecom_backend.entities.AppUser;
import com.example.ecom_backend.exceptions.WrongUserCredentials;
import com.example.ecom_backend.repositories.UserRepo;
import com.example.ecom_backend.services.UserService;
import com.example.ecom_backend.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    UserService userService;
    @Autowired
    AppConfigurationProperties properties;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepo userRepo;

    @GetMapping("/testEverybody")
    public String testEverybody(){
        return "everybody can see this";
    }

    @GetMapping("/testOnlyUser")
    public String testOnlyStudent(){
        return "users can see this";
    }

    @GetMapping("/testOnlyAdmin")
    public String testOnlyAdmin(){
        return "only admins should be abe to see this";
    }

    @PostMapping("/createUser")
    public String createUser(@RequestBody UserSignUpDTO dto){

        AppUser appUser = new AppUser();

        userService.createUser(
                dto.getUsername(),
                dto.getPassword(),
                dto.getName(),
                dto.getEmail(),
                dto.getAddress()
        );

        return "user created";
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody UserLoginDTO dto, HttpServletResponse response){
        String username = dto.getUsername();
        String password = dto.getPassword();

        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

            UserDetails userDetails = userService.loadUserByUsername(username);
            AppUser appUser = (AppUser) userDetails;

            String jwt = jwtUtil.generateToken(appUser);

            ResponseCookie cookie = ResponseCookie.from(properties.getCookie().getName(), jwt)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(properties.getCookie().getExpiresIn())
                    .sameSite("Lax")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok("login successful");
        }
        catch (BadCredentialsException | UsernameNotFoundException e){
            throw new WrongUserCredentials("Incorrect username or password");
        }
        catch(Exception e){
            throw new WrongUserCredentials("emo ra babu edho ayyindhi user controller layer lo");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Object> me(Authentication authentication){

        if(authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("not authenticated");
        }
        AppUser user = (AppUser) authentication.getPrincipal();

        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout(HttpServletResponse response){

        ResponseCookie cookie = ResponseCookie.from(properties.getCookie().getName())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("logout successful");
    }

}

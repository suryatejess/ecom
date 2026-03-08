package com.example.ecom_backend.services;

import com.example.ecom_backend.entities.AppUser;
import com.example.ecom_backend.entities.RoleType;
import com.example.ecom_backend.exceptions.UsernameAlreadyExistsException;
import com.example.ecom_backend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Cant find the user"));
    }

    public String createUser(String username, String password, String name, String email, String address) {

        if(userRepo.findByUsername(username).isPresent()){
            throw new UsernameAlreadyExistsException("Username " +  username + " already exists");
        }

        AppUser user = new AppUser();

        user.setUsername(username);
        user.setPassword(new BCryptPasswordEncoder().encode(password));
        user.setName(name);
        user.setEmail(email);
        user.setAddress(address);
        user.setRoleType(RoleType.USER);

        userRepo.save(user);

        return "user successfully created";
    }

    public String createAdmin(String username, String password, String name, String email, String address) {

        if(userRepo.findByUsername(username).isPresent()){
            throw new UsernameAlreadyExistsException("Username " +  username + " already exists");
        }

        AppUser user = new AppUser();

        user.setUsername(username);
        user.setPassword(new  BCryptPasswordEncoder().encode(password));
        user.setName(name);
        user.setEmail(email);
        user.setAddress(address);
        user.setRoleType(RoleType.ADMIN);

        userRepo.save(user);

        return "user successfully created";
    }

    public AppUser loadByUserId(Long id){
        return userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}

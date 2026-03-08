package com.example.ecom_backend.repositories;

import com.example.ecom_backend.entities.AppUser;
import com.example.ecom_backend.entities.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByProviderAndProviderUserId(Provider provider, String providerUserId);

}

package com.example.ecom_backend.repositories;

import com.example.ecom_backend.entities.AppUser;
import com.example.ecom_backend.entities.Provider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByProviderAndProviderUserId(Provider provider, String providerUserId);

    @Query("SELECT u FROM AppUser u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR CAST(u.id AS string) = :search")
    Page<AppUser> findBySearch(String search, Pageable pageable);
}

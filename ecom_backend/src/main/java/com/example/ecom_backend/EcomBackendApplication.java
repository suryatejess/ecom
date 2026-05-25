package com.example.ecom_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class EcomBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcomBackendApplication.class, args);
    }

}

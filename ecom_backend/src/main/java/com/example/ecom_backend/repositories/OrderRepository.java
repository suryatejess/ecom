package com.example.ecom_backend.repositories;

import com.example.ecom_backend.entities.Cart;
import com.example.ecom_backend.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> findByAppUserUsername(String username); // assuming the `Order` entity has a `User` relationship
}

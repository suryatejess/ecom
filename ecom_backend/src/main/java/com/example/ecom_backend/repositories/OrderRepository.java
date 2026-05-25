package com.example.ecom_backend.repositories;

import com.example.ecom_backend.entities.Cart;
import com.example.ecom_backend.entities.Order;
import com.example.ecom_backend.entities.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> findByAppUserUsername(String username); // assuming the `Order` entity has a `User` relationship

    Page<Order> findByOrderStatus(OrderStatus orderStatus, Pageable pageable);
}

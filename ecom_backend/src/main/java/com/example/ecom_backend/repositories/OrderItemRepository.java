package com.example.ecom_backend.repositories;

import com.example.ecom_backend.entities.OrderItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends CrudRepository<OrderItem,Integer> {
}

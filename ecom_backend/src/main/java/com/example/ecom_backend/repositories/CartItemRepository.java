package com.example.ecom_backend.repositories;

import com.example.ecom_backend.entities.Cart;
import com.example.ecom_backend.entities.CartItem;
import com.example.ecom_backend.entities.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends CrudRepository<CartItem,Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}

package com.example.ecom_backend.services;

import com.example.ecom_backend.entities.AppUser;
import com.example.ecom_backend.entities.Cart;
import com.example.ecom_backend.entities.CartItem;
import com.example.ecom_backend.entities.Product;
import com.example.ecom_backend.exceptions.ProductAvailableQuantityExceededException;
import com.example.ecom_backend.exceptions.ProductNotFoundException;
import com.example.ecom_backend.repositories.CartItemRepository;
import com.example.ecom_backend.repositories.CartRepository;
import com.example.ecom_backend.repositories.ProductRepository;
import com.example.ecom_backend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository prodRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private UserRepo userRepo;

    private AppUser getUserOrThrow(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username)
                );
    }

    public Cart getOrCreateCartByUsername(String username) {
        AppUser user = getUserOrThrow(username);

        return cartRepository
                .findByAppUser(user)
                .orElseGet(
                        () -> {
                            Cart cart = new Cart();
                            cart.setAppUser(user);
                            return  cartRepository.save(cart);
                        }
                );
    }

    public List<CartItem> getCartProductsByUsername(String username) {
        Cart cart = getOrCreateCartByUsername(username);
        return cart.getCartItems();
    }

    @Transactional
    public void addProductToCart(String username, Long productId, int quantity) {

        Cart cart = getOrCreateCartByUsername(username);

        Product product = prodRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product with id : " + productId + " not found"));

        int availableProductQuantity = product.getAvailableQuantity();

        CartItem cartItem = cartItemRepository
                .findByCartAndProduct(cart, product)
                .orElse(null);

        int currentCartQuantity = cartItem != null ? cartItem.getQuantity() : 0;
        int totalAfterAdd = currentCartQuantity + quantity;

        if(availableProductQuantity < totalAfterAdd){
            throw new ProductAvailableQuantityExceededException("Product quantity exceeded. availableProductQuantity : " +  availableProductQuantity + ". requiredQuantity : " +  totalAfterAdd);
        }

        if (cartItem != null) {
            cartItem.setQuantity(totalAfterAdd);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getCartItems().add(newItem);
        }

        cartRepository.save(cart);
    }

    @Transactional
    public void modifyProductQuantity(String username, Long productId, int quantity) {

        Cart cart = getOrCreateCartByUsername(username);

        Product product = prodRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product with id : " + productId + " not found"));

        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }

        if (quantity == 0) {
            cart.getCartItems()
                    .removeIf(ci -> ci.getProduct().getId().equals(productId));
            cartRepository.save(cart);
            return;
        }

        int availableProductQuantity = product.getAvailableQuantity();

        if(availableProductQuantity < quantity){
            throw new ProductAvailableQuantityExceededException("Product quantity exceeded. availableProductQuantity : " +  availableProductQuantity + ". requiredQuantity : " +  quantity);
        }

        CartItem cartItem = cartItemRepository
                .findByCartAndProduct(cart, product)
                .orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity( quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getCartItems().add(newItem);
        }

        cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String username) {
        Cart cart = getOrCreateCartByUsername(username);
//        cart.setCartItems(null);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    @Transactional
    public void removeProductFromCart(String username, Long productId) {
        Cart cart = getOrCreateCartByUsername(username);
        cart.getCartItems().removeIf(cartItem -> cartItem.getProduct().getId().equals(productId));
        cartRepository.save(cart);
    }

}

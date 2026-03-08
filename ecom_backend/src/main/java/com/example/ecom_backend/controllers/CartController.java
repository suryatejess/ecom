package com.example.ecom_backend.controllers;

import com.example.ecom_backend.dtos.CartItemDTO;
import com.example.ecom_backend.entities.AppUser;
import com.example.ecom_backend.entities.CartItem;
import com.example.ecom_backend.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    /*
    - [x] add product to cart. ( if we want to decrement, frontend has to send negative quantity value )
        quantity should be there. if quantity is not sent, default it to 0
        validate stock exists

    - [ ] remove product from cart
    - [x] be able to modify the quantity of a particular product ( product ofc )
    - [x] clear cart
     */

    @PostMapping("/")
    public void addToCart(@RequestBody CartItemDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long productId = dto.getProductId();
        int quantity = dto.getQuantity();

        cartService.addProductToCart(username, productId, quantity);
    }

    @DeleteMapping("/")
    public void clearCart(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        cartService.clearCart(username);
    }

    @DeleteMapping("/{productId}")
    public void removeProductFromCart(@PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        cartService.removeProductFromCart(username, productId);
    }

    @GetMapping("/")
    public List<CartItemDTO> getCartItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        List<CartItem> cartItems = cartService.getCartProductsByUsername(username);

        List<CartItemDTO> cartItemDTOs = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            CartItemDTO cartItemDTO = new CartItemDTO();

            cartItemDTO.setQuantity(cartItem.getQuantity());
            cartItemDTO.setProductId(cartItem.getProduct().getId());

            cartItemDTOs.add(cartItemDTO);
        }

        return cartItemDTOs;
    }

    @PutMapping("/")
    public void modifyProductQuantity(@RequestBody CartItemDTO dto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long productId = dto.getProductId();
        int quantity = dto.getQuantity();

        if(quantity == 0){
            cartService.removeProductFromCart(username, productId);
            return;
        }

        cartService.modifyProductQuantity(username, productId, quantity);
    }
}

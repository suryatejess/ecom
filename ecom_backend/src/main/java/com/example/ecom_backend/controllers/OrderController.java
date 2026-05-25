package com.example.ecom_backend.controllers;

import com.example.ecom_backend.dtos.OrderResponseDTO;
import com.example.ecom_backend.dtos.OrderStatusUpdateDTO;
import com.example.ecom_backend.dtos.PlaceOrderRequestDTO;
import com.example.ecom_backend.entities.Order;
import com.example.ecom_backend.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
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

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    /*
    POST '/'
    place order. when order is placed, cart should be cleared. available quantity of the product should decrement

    PUT '/id'
    update order status.
    if the order status becomes cancelled, the cart quantity should increase

    DELETE '/id'
    delete order with that id

    GET '/'
    get all orders

    GET '/id'
    get order with that id
     */

    @Autowired
    OrderService orderService;

    @PostMapping("/")
    public void placeOrder(@RequestBody PlaceOrderRequestDTO dto){ // for multiuser, the argument should be 'userId' / 'sessionId'
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        orderService.placeOrder(username, dto.getAddress(), dto.getReceiverName());
    }

    @GetMapping("/")
    public List<OrderResponseDTO> getOrders(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return orderService.getAllOrdersByUsername(username);
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable int id){
        return orderService.getOrderById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderById(@PathVariable int id){
        orderService.deleteOrderById(id);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<OrderResponseDTO> getAllOrders(Pageable pageable){
        return orderService.getAllOrders(pageable);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public void updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatusUpdateDTO dto){
        orderService.updateOrderStatus(id, dto.getStatus());
    }

}

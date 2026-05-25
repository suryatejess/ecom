package com.example.ecom_backend.services;

import com.example.ecom_backend.dtos.OrderItemDTO;
import com.example.ecom_backend.dtos.OrderResponseDTO;
import com.example.ecom_backend.entities.*;
import com.example.ecom_backend.exceptions.EmptyCartException;
import com.example.ecom_backend.exceptions.InsufficientStockException;
import com.example.ecom_backend.exceptions.ProductNotFoundException;
import com.example.ecom_backend.repositories.CartRepository;
import com.example.ecom_backend.repositories.OrderItemRepository;
import com.example.ecom_backend.repositories.OrderRepository;
import com.example.ecom_backend.repositories.ProductRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//import java.sql.Date;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    EntityManager entityManager;

    public Order createOrder(){
        return new Order();
    }

    @Transactional
    public void placeOrder(String username, String orderAddress, String receiverName){

        /*
        get or create a cart
        create an order
        iterate
            turn cart item into order item
            add order item into order's list
        save order
         */

        Cart cart = cartService.getOrCreateCartByUsername(username);


        if (cart.getCartItems().isEmpty()) {
            throw new EmptyCartException("Cannot place order: cart is empty");
        }

        Order order = createOrder();

        AppUser appUser = cart.getAppUser();

        List<OrderItem> orderItemsList = new ArrayList<>();

        for(int i = 0; i < cart.getCartItems().size(); i++){
//            OrderItem orderItem = orderItemRepository.save(new OrderItem());
            OrderItem orderItem = new OrderItem();

            CartItem presentCartItem = cart.getCartItems().get(i);

            // turn cart item into order item
            orderItem.setProductId(presentCartItem.getProduct().getId());
            orderItem.setProductName(presentCartItem.getProduct().getName());
            orderItem.setProductPriceWhileOrdering(presentCartItem.getProduct().getPrice());
            orderItem.setProductOrderQuantity(presentCartItem.getQuantity());
            orderItem.setOrder(order);

            // add order item to order
            orderItemsList.add(orderItem);
        }
        order.setOrderItems(orderItemsList);
        order.setOrderStatus(OrderStatus.PROCESSING);
        order.setAddress(orderAddress);
        order.setReceiverName(receiverName);
        // order.setOrderPlacedDate(new Date(System.currentTimeMillis()));
        order.setOrderPlacedDate(Instant.now());
        order.setAppUser(appUser);



        // decrement the product available quantity
//        for(int i = 0; i < cart.getCartItems().size(); i++){
//            CartItem cartItem = cart.getCartItems().get(i);
//            Product productOfCartItem = cartItem.getProduct();
//            int initialProductAvailableQuantity = productOfCartItem.getAvailableQuantity();
//            int quantityOfCartItem = cartItem.getQuantity();
//
//            // decrement the product available quantity
//            productOfCartItem.setAvailableQuantity(initialProductAvailableQuantity - quantityOfCartItem);
//        }

        for(CartItem cartItem : cart.getCartItems()){
            Product  productOfCartItem = productRepository.findByIdForUpdate(cartItem.getProduct().getId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));
            entityManager.refresh(productOfCartItem); // force DB read, bypass hibernate's first level cache

            int initialProductAvailableQuantity = productOfCartItem.getAvailableQuantity();
            int quantityOfCartItem = cartItem.getQuantity();

            // decrement the product available quantity
            if(quantityOfCartItem > initialProductAvailableQuantity){
                throw new InsufficientStockException(
                        "Not enough products available for " + productOfCartItem.getName(),
                        productOfCartItem.getId(),
                        initialProductAvailableQuantity
                );
            }

            productOfCartItem.setAvailableQuantity(initialProductAvailableQuantity - quantityOfCartItem);

            productRepository.save(productOfCartItem);
        }

        // clear cart
        cartService.clearCart(username);

        orderRepository.save(order);

    }

    public List<OrderResponseDTO> getAllOrdersByUsername(String username) {

//        List<Order> orders = (List<Order>) orderRepository.findAll();
        List<Order> orders = (List<Order>) orderRepository.findByAppUserUsername(username);
        List<OrderResponseDTO> response = new ArrayList<>();

        for (Order order : orders) {
            OrderResponseDTO dto = mapToOrderResponseDTO(order);
            response.add(dto);
        }

        return response;
    }

    public Order getOrderById(int id){
        return orderRepository.findById(id).get();
    }

    private OrderResponseDTO mapToOrderResponseDTO(Order order){

        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setAddress(order.getAddress());
        dto.setReceiverName(order.getReceiverName());
        dto.setOrderPlacedDate(order.getOrderPlacedDate());

        List<OrderItemDTO> orderItemDTOList = new ArrayList<>();

        for(OrderItem orderItem : order.getOrderItems()){
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setProductId(orderItem.getProductId());
            itemDTO.setProductName(orderItem.getProductName());
            itemDTO.setPrice(orderItem.getProductPriceWhileOrdering());
            itemDTO.setQuantity(orderItem.getProductOrderQuantity());
            orderItemDTOList.add(itemDTO);
        }

        dto.setItems(orderItemDTOList);
        return dto;
    }

    public Page<OrderResponseDTO> getAllOrders(Pageable pageable){
        Page<Order> orders =  orderRepository.findAll(pageable);
        return orders.map(this::mapToOrderResponseDTO);
    }

    public void deleteOrderById(int id){
        orderRepository.deleteById(id);
    }


}

package com.example.ecom_backend.dtos;

import com.example.ecom_backend.entities.OrderStatus;

import java.time.Instant;
import java.util.List;

public class OrderResponseDTO {
    private Long id;
    private String address;
    private String receiverName;
    private OrderStatus orderStatus;

//    public Date getOrderPlacedDate() {
//        return orderPlacedDate;
//    }
//
//    public void setOrderPlacedDate(Date orderPlacedDate) {
//        this.orderPlacedDate = orderPlacedDate;
//    }

//    private Date orderPlacedDate;

    private Instant orderPlacedDate;

    public Instant getOrderPlacedDate() {
        return orderPlacedDate;
    }

    public void setOrderPlacedDate(Instant orderPlacedDate) {
        this.orderPlacedDate = orderPlacedDate;
    }

    private List<OrderItemDTO> items;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }
}

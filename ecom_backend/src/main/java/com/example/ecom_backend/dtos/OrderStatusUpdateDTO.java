package com.example.ecom_backend.dtos;

import com.example.ecom_backend.entities.OrderStatus;

public class OrderStatusUpdateDTO {

    private OrderStatus status;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}

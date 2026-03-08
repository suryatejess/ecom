package com.example.ecom_backend.entities;

import jakarta.persistence.*;

import java.sql.Date;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_ecom")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @Column(name = "address", length = 512)
    private String address;

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "order_placed_date")
    private Instant orderPlacedDate;
//    private Date orderPlacedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus;

    @ManyToOne
    @JoinColumn
    private AppUser appUser;

    public AppUser getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

//    public Date getOrderPlacedDate() {
//        return orderPlacedDate;
//    }
//
//    public void setOrderPlacedDate(Date orderPlacedDate) {
//        this.orderPlacedDate = orderPlacedDate;
//    }

    public Instant getOrderPlacedDate() {
        return orderPlacedDate;
    }

    public void setOrderPlacedDate(Instant orderPlacedDate) {
        this.orderPlacedDate = orderPlacedDate;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
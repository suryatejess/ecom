package com.example.ecom_backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "order_item")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

//    @ManyToOne
//    @JoinColumn(name = "product_id")
//    private Product product;



    @Column(name = "product_order_quantity")
    private Integer productOrderQuantity;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "product_price_while_ordering")
    private Double productPriceWhileOrdering;

    public Double getProductPriceWhileOrdering() {
        return productPriceWhileOrdering;
    }

    public void setProductPriceWhileOrdering(Double productPriceWhileOrdering) {
        this.productPriceWhileOrdering = productPriceWhileOrdering;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Integer getProductOrderQuantity() {
        return productOrderQuantity;
    }

    public void setProductOrderQuantity(Integer productOrderQuantity) {
        this.productOrderQuantity = productOrderQuantity;
    }

//    public Product getProduct() {
//        return product;
//    }
//
//    public void setProduct(Product product) {
//        this.product = product;
//    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
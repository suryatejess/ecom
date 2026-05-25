package com.example.ecom_backend.exceptions;

public class InsufficientStockException extends RuntimeException {

    private final Long productId;
    private final int availableQuantity;

    public InsufficientStockException(String message, Long productId, int availableQuantity) {
        super(message);
        this.productId = productId;
        this.availableQuantity = availableQuantity;
    }

    public Long getProductId() {
        return productId;
    }

    public int getAvailableQuantity() {
        return availableQuantity;
    }
}

package com.example.ecom_backend.exceptions;

public class ProductAvailableQuantityExceededException extends RuntimeException {

    public ProductAvailableQuantityExceededException(String message) {
        super(message);
    }

    public ProductAvailableQuantityExceededException(String message, Throwable cause) {
        super(message, cause);
    }
}

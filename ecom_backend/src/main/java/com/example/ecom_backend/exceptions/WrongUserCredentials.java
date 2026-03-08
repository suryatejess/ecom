package com.example.ecom_backend.exceptions;

public class WrongUserCredentials extends RuntimeException {

    public WrongUserCredentials(String message) {
        super(message);
    }

}

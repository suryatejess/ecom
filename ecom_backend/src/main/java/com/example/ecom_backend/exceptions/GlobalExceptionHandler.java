package com.example.ecom_backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = {ProductAvailableQuantityExceededException.class})
    public ResponseEntity<Object> handleException(ProductAvailableQuantityExceededException e) {
        // 1. Create payload containing exception details
        ExceptionDTO exceptionDTO = new ExceptionDTO( e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now() );
        // 2. Return response entity
        return new ResponseEntity<>(exceptionDTO, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {ProductNotFoundException.class})
    public ResponseEntity<Object> handleException(ProductNotFoundException e) {
        ExceptionDTO exceptionDTO = new ExceptionDTO( e.getMessage(), HttpStatus.NOT_FOUND, LocalDateTime.now() );
        return new ResponseEntity<>(exceptionDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {EmptyCartException.class})
    public ResponseEntity<Object> handleException(EmptyCartException e) {
        ExceptionDTO exceptionDTO = new ExceptionDTO( e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now() );
        System.out.println("EmptyCartException: " + e.getMessage());
        return new ResponseEntity<>(exceptionDTO, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {WrongUserCredentials.class})
    public ResponseEntity<Object> handleException(WrongUserCredentials e) {
        ExceptionDTO exceptionDTO = new ExceptionDTO( e.getMessage(), HttpStatus.UNAUTHORIZED, LocalDateTime.now() );
        System.out.println("WrongUserCredentialsException: " + e.getMessage());
        return new ResponseEntity<>(exceptionDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = {UsernameAlreadyExistsException.class})
    public ResponseEntity<Object> handleException(UsernameAlreadyExistsException e) {
        ExceptionDTO exceptionDTO = new ExceptionDTO( e.getMessage(), HttpStatus.CONFLICT, LocalDateTime.now() );
        System.out.println("UsernameAlreadyExistsException: " + e.getMessage());
        return new ResponseEntity<>(exceptionDTO, HttpStatus.CONFLICT);
    }
}

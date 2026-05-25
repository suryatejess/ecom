package com.example.ecom_backend.controllers;

import com.example.ecom_backend.dtos.ProductDTO;
import com.example.ecom_backend.entities.Product;
import com.example.ecom_backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    ProductService productService;

    /*
    POST "/"
    // add a product

    GET '/'
    // fetch all products

    GET '/id'
    // fetch product with that id

    PUT '/id'
    // modify properties of the product with that id
     */

    @GetMapping("/")
    public List<Product> findAll(){
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public Product findById(@PathVariable Long id){
        return productService.findById(id);
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public void save(@RequestBody ProductDTO productDTO){
        Product product = new Product();

        product.setName(productDTO.getName());
        product.setImage(productDTO.getImageLink());
        product.setPrice(productDTO.getPrice());
        product.setShortDesc(productDTO.getShortDescription());
        product.setLongDesc(productDTO.getLongDescription());
        product.setAvailableQuantity(productDTO.getQuantity());

        productService.save(product);
    }

    // TODO: PUT '/id' - change properties of product with that id

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id){
        productService.deleteById(id);
    }

}

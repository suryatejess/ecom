package com.example.ecom_backend.controllers;

import com.example.ecom_backend.dtos.ProductDTO;
import com.example.ecom_backend.dtos.ProductUpdateDTO;
import com.example.ecom_backend.entities.Product;
import com.example.ecom_backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<Product> findAllPaginated(Pageable pageable, @RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return productService.searchProducts(search, pageable);
        }
        return productService.findAll(pageable);
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

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void update(@PathVariable Long id, @RequestBody ProductUpdateDTO productUpdateDTO){
        productService.modify(id, productUpdateDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id){
        productService.deleteById(id);
    }

}

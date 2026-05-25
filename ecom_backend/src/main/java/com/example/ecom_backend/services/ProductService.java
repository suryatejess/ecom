package com.example.ecom_backend.services;

import com.example.ecom_backend.dtos.ProductUpdateDTO;
import com.example.ecom_backend.entities.Product;
import com.example.ecom_backend.exceptions.ProductNotFoundException;
import com.example.ecom_backend.repositories.ProductRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.beans.PropertyDescriptor;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProductService {

    @Autowired
    ProductRepository repo;

    public List<Product> findAll() {
        return repo.findAll();
    }

    public void save(Product product) {
        repo.save(product);
    }

    public Product findById(Long id) {
//        return repo.findById(id).get();
        return repo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
    }

    public void deleteById(Long id) {
        if (!repo.existsById(id)) {
            throw new ProductNotFoundException("Product not found with id: " + id);
        }
        repo.deleteById(id);
    }

    public void modify(Long productId, ProductUpdateDTO updatedProduct) {
        if(productId == null || productId == 0){
            throw new  ProductNotFoundException("Product not found with id: " + productId);
        }

        Product fetchedProduct = repo.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));
        BeanUtils.copyProperties(updatedProduct, fetchedProduct, getNullPropertyNames(updatedProduct));

        repo.save(fetchedProduct);
    }

    public static String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);

        PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<>();

        for (PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());

            if (srcValue == null) {
                emptyNames.add(pd.getName());
            }
        }

        return emptyNames.toArray(new String[0]);
    }
}

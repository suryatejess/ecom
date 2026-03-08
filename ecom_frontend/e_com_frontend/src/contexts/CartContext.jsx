import { useContext, createContext, useState, useEffect } from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const [error, setError] = useState();
    const [allProducts, setAllProducts] = useState([]);

    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    const CART_URL = backendUrl + "/cart/";

    // 🔹 Derived state
    const cartCount = allProducts.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        if (isLoggedIn) {
            fetchCart();
        } else {
            setAllProducts([]);
        }
    }, [isLoggedIn]);

    // fetches the product and sets them to the state variable `allProducts`
    const fetchCart = async () => {
        if (!isLoggedIn) return;

        try {
            const response = await fetch(CART_URL, {
                headers: {},
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch cart");
            }

            const data = await response.json();
            setAllProducts(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // this goes in AddToCartButton
    // think about how to send to "productId" prop to addToCart function when calling in other component i.e. wherever it is being used
    async function addToCart(productId, quantity = 1) {
        try {
            if (!isLoggedIn) return;

            const response = await fetch(CART_URL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity,
                }),
            });

            if (!response.ok) {
                throw new Error("failed to add products to cart");
            }

            await fetchCart();
        } catch (err) {
            setError(err.message);
        }
    }

    // this goes in Cart
    const clearCart = async () => {
        try {
            const response = await fetch(CART_URL, {
                method: "DELETE",
                credentials: "include",
                headers: {},
            });

            if (!response.ok) {
                throw new Error("failed to clear cart");
            }

            setAllProducts([]);
        } catch (error) {
            setError(error);
        }
    };

    const updateCartItem = async (productId, quantity) => {
        try {
            const response = await fetch(CART_URL, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
                throw new Error("failed to update cart");
            }

            await fetchCart();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <CartContext.Provider
            value={{
                // helps for the Navbar component cart count
                cartCount,
                // helps for Cart.jsx
                allProducts,
                error,

                fetchCart,
                // helps in the  AddToCartButton component
                addToCart,
                // helps in the Cart.jsx clear cart
                clearCart,
                updateCartItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be added inside CartProvider");
    }
    return context;
};

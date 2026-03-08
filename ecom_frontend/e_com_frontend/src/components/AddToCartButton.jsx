import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import toast, { Toaster } from "react-hot-toast";

const AddToCartButton = ({ id }) => {
    const { addToCart } = useCart();

    const notify = () => {
        toast.success("Product added to cart");
    };

    const addToCartAndDisplayToast = (id) => {
        addToCart(id);
        notify();
    };

    // const [error, setError] = useState("");

    return (
        <>
            {/* ADD TO CART BUTTON */}
            <button
                onClick={() => addToCartAndDisplayToast(id)}
                className="absolute bottom-3 right-3 rounded-md bg-black text-white flex items-center justify-center transition-opacity px-4 py-3 cursor-pointer hover:bg-amber-600 hover:scale-110 z-10"
            >
                +
            </button>

            <div>
                <div>
                    <Toaster />
                </div>
            </div>
        </>
    );
};

export default AddToCartButton;

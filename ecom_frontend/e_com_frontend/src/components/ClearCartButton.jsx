import React from "react";

const ClearCartButton = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    const buttonActionToClearCart = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(`${backendUrl}/cart/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    return (
        <>
            <button
                onClick={buttonActionToClearCart}
                className="border-red-600 bg-blue-500"
            >
                Clear Cart
            </button>
        </>
    );
};

export default ClearCartButton;

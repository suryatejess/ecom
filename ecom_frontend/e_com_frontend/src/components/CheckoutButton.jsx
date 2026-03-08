import React from "react";

const CheckoutButton = () => {
    return (
        <>
            <button
                onClick={onCheckout}
                className="w-full bg-black text-white py-2 rounded"
            >
                Checkout
            </button>
        </>
    );
};

export default CheckoutButton;

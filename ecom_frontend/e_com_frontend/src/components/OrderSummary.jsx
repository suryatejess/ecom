import React, { useState } from "react";
import CheckoutButton from "./CheckoutButton";

import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import toast from "react-hot-toast";

const OrderSummary = (props) => {
    const [address, setAddress] = useState("");
    const [receiverName, setReceiverName] = useState("");

    const { isLoggedIn } = useAuth();
    const { clearCart, updateCartItem } = useCart();

    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    const backendUrl_placeorder = backendUrl + "/order/";

    const placeOrder = async () => {
        try {
            if (!isLoggedIn) {
                throw new Error(
                    "you need to sign in before you can place an order",
                );
            }

            if (address === "") {
                // alert("enter address");
                throw new Error("please fill the address");
            }

            if (receiverName === "") {
                // alert("enter receiverName");
                throw new Error("please fill the receiverName");
            }

            const response = await fetch(backendUrl_placeorder, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    address,
                    receiverName,
                }),
            });

            if (!response.ok) {
                const data = await response.json();

                if (data.availableQuantity !== undefined) {
                    if (data.availableQuantity === 0) {
                        await updateCartItem(data.productId, 0);
                        toast.error(`${data.message}. Removed from cart.`);
                    } else {
                        await updateCartItem(data.productId, data.availableQuantity);
                        toast.error(`${data.message}. Cart updated to ${data.availableQuantity}.`);
                    }
                    return;
                }

                throw new Error(data.message || "Failed to place order");
            }

            toast.success("Order placed successfully!");

            await clearCart();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {/* subtotal , shopping */}
            <div className="space-y-2 mb-4">
                {/* <div className="flex justify-between text-sm"> */}
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-900">{props.subtotal}</span>
                </div>

                {/* <div className="flex justify-between text-sm"> */}
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
            </div>

            {/* total */}
            <div className="border-t pt-4 mb-6">
                {/* <div className="flex justify-between font-medium"> */}
                <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{props.subtotal}</span>
                </div>
            </div>

            {/* checkout button */}
            <div className="space-y-4">
                <label>Address</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />

                <label>Receiver Name</label>
                <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />

                {/* <CheckoutButton onCheckout={placeOrder} /> */}

                <button
                    onClick={placeOrder}
                    // className="w-full bg-black text-white py-2 rounded"
                    className="w-full h-12 rounded-lg bg-black text-white text-sm font-medium cursor-pointer"
                >
                    Checkout
                </button>
            </div>
        </>
    );
};

export default OrderSummary;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../contexts/CartContext";

const CartItem = (props) => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");

    const { updateCartItem } = useCart();

    // placeholder image initially
    const [productImage, setProductImage] = useState(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s",
    );
    const [productQuantity, setProductQuantity] = useState(
        props.productQuantity,
    );
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");

    useEffect(() => {
        findProductBasedOnId();
    }, [props.productId]);

    async function findProductBasedOnId() {
        try {
            const res = await fetch(`${backendUrl}/product/${props.productId}`);
            if (!res.ok) throw new Error("Failed to fetch product");
            const data = await res.json();

            setProduct(data);

            if (data.image) {
                setProductImage(data.image);
            }
            setProductName(data.name);
            setProductPrice(data.price);
        } catch (err) {
            setError(err.message);
        }
    }

    async function updateQuantityBasedOnProductId(newQuantity) {
        try {
            const response = await fetch(`${backendUrl}/cart/`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: props.productId,
                    quantity: newQuantity,
                }),
            });
        } catch (err) {
            setError(err.message);
        }
    }

    const decrementQuantity = () => {
        const newQuantity = Math.max(productQuantity - 1, 0);

        setProductQuantity(newQuantity);
        updateCartItem(props.productId, newQuantity);
    };

    const incrementQuantity = () => {
        if (!product) return;

        const newQuantity = Math.min(
            productQuantity + 1,
            product.availableQuantity,
        );

        setProductQuantity(newQuantity);
        updateCartItem(props.productId, newQuantity);
    };

    const clearCartAfterHittingCrossButton = async () => {
        if (!product) return;

        setProductQuantity(0);
        updateCartItem(props.productId, 0);
    };

    return (
        <>
            <div className="flex gap-4 py-6 border-b border-gray-200">
                {/* image */}
                <Link to={"/product/" + props.productId}>
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
                        <img
                            className="h-full w-full object-cover"
                            src={productImage}
                            alt="image of the proudct"
                        />
                    </div>
                </Link>

                {/* details */}
                <div className="flex flex-1 flex-col">
                    {/* name, price, and close button */}
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-sm font-medium">
                                {productName}
                            </h3>
                            {/* <p className="text-sm mt-1">{productPrice}</p> */}
                            <p className="text-sm text-gray-500 mt-1">
                                ₹{productPrice}
                            </p>
                        </div>

                        <button
                            onClick={clearCartAfterHittingCrossButton}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-x h-4 w-4"
                            >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* quantity modifier */}
                    {/* <div className="mt-auto flex items-center gap-2"> */}
                    <div className="mt-4 flex items-center gap-3">
                        <button
                            onClick={decrementQuantity}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-minus h-3 w-3"
                            >
                                <path d="M5 12h14"></path>
                            </svg>
                        </button>

                        <span>{productQuantity}</span>

                        <button
                            onClick={incrementQuantity}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-plus h-3 w-3"
                            >
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartItem;

import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const ProductPage = (props) => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");

    const { addToCart } = useCart();
    const { isLoggedIn } = useAuth();

    const URL_CART = backendUrl + "/cart/";

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`${backendUrl}/product/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchProduct();
    }, [id, backendUrl]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!product) return <p className="p-8">Loading product...</p>;

    const handleAddToCart = () => {
        addToCart(id, quantity);
        setQuantity(1);
        notify();
    };

    const notify = () => {
        toast.success("Product added to cart");
    };

    const decrementQuantity = () => {
        setQuantity((prev) => Math.max(prev - 1, 0));
    };

    const incrementQuantity = (presentQuantity) => {
        setQuantity((prev) => Math.min(prev + 1, product.availableQuantity));
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col ">
                    <div className="flex flex-col ">
                        {/* <- back to products */}
                        <Link
                            to="/"
                            className="inline-flex items-center text-sm pt-6"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeinejoin="round"
                                strokeLinejoin="round"
                                className="lucide lucide-arrow-left h-4 w-4"
                            >
                                <path d="m12 19-7-7 7-7"></path>
                                <path d="M19 12H5"></path>
                            </svg>
                            Back to products
                        </Link>

                        {/* down */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 items-start">
                            {/* image  */}
                            <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center">
                                <img
                                    src={
                                        product.image ||
                                        "https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png"
                                    }
                                    alt={product.name}
                                    className="object-contain max-h-[420px] w-full"
                                />
                            </div>

                            {/* right */}
                            <div>
                                <div className="flex flex-col">
                                    <h1 className="text-3xl font-semibold mb-2">
                                        {product.name}
                                    </h1>

                                    <p className="text-xl font-medium mb-4">
                                        ₹{product.price}
                                    </p>

                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        {product.longDesc}
                                    </p>

                                    {/* quantity */}
                                    <div className="mb-6">
                                        <p className="text-sm font-medium mb-2">
                                            Quantity
                                        </p>

                                        <div className="inline-flex items-center border rounded-md">
                                            <button
                                                onClick={decrementQuantity}
                                                className="px-3 py-1 text-lg hover:bg-gray-100 transition cursor-pointer"
                                            >
                                                −
                                            </button>

                                            <span className="px-4 text-sm">
                                                {quantity}
                                            </span>

                                            <button
                                                onClick={incrementQuantity}
                                                className="px-3 py-1 text-lg hover:bg-gray-100 transition cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* <button
                                        onClick={handleAddToCart}
                                        className="bg-black text-white rounded-md py-3 text-sm font-medium mt-4 hover:opacity-90 transition cursor-pointer"
                                    >
                                        Add to Cart
                                    </button> */}

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!isLoggedIn}
                                        className={`rounded-md py-3 text-sm font-medium mt-4 transition
                                            ${
                                                isLoggedIn
                                                    ? "bg-black text-white hover:opacity-90 cursor-pointer"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }
                                        `}
                                    >
                                        {isLoggedIn
                                            ? "Add to Cart"
                                            : "Login to add to cart"}
                                    </button>

                                    <div className="border-t-2 pt-4 mt-6">
                                        <p className="text-green-600 text-sm">
                                            {product.availableQuantity} in stock
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductPage;

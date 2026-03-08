import React from "react";
import AddToCartButton from "./AddToCartButton";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const ProductCard = (props) => {
    const { isLoggedIn } = useAuth();

    return (
        <>
            <div className="flex flex-col">
                {/* CARD */}
                <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-100">
                    {/* IMAGE LINK */}

                    <Link
                        to={`/product/${props.id}`}
                        className="block w-full h-full"
                    >
                        <img
                            src={
                                props.image ||
                                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                            }
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            alt=""
                        />
                    </Link>
                    {isLoggedIn && <AddToCartButton id={props.id} />}
                </div>

                {/* NAME & PRICE */}
                <div>
                    <h3 className="text-sm font-normal text-gray-800">
                        {props.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                        <span>₹</span>
                        {props.price}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ProductCard;

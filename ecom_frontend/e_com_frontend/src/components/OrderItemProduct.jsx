import React, { useEffect, useState } from "react";

const OrderItemProduct = (props) => {
    const [productImage, setProductImage] = useState();
    const [error, setError] = useState();
    const [productDetails, setProductDetails] = useState();
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    /*
    props needed 
        - productId
        - title 
        - quantity 
*/

    // const url_fetchProductBasedOnId = backendUrl + "/" + props.productId;
    const url_fetchProductBasedOnId =
        backendUrl + "/product/" + props.productId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url_fetchProductBasedOnId);

                if (!response.ok) {
                    throw new Error("error while fetching the product");
                }

                const result = await response.json();

                setProductImage(
                    result.image ||
                        "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg",
                );
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {/* <div className="max-w-7xl mx-auto px-6"> */}

            <div className="flex flex-row">
                {/* image */}
                <div className="flex items-center gap-4 mr-2">
                    <img
                        src={productImage}
                        alt="image of the product"
                        className="h-14 w-14 rounded-md object-cover"
                    />
                </div>

                {/* title, quantity, price */}
                <div className="flex flex-col">
                    {/* title */}
                    <div>{props.title}</div>

                    {/* qty and price */}
                    <div>
                        Qty: {props.quantity} x <span>₹</span>
                        {props.price} = {props.quantity * props.price}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderItemProduct;

import { useEffect, useState } from "react";

import OrderItemProduct from "../components/OrderItemProduct";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

function Order() {
    const [error, setError] = useState();
    const [allOrders, setAllOrders] = useState([]);
    const [selected, setSelected] = useState(null);

    const { isLoggedIn } = useAuth();

    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    const toggle = (i) => {
        if (selected == i) {
            return setSelected(null);
        }

        setSelected(i);
    };

    const statusStyles = {
        PROCESSING: "bg-yellow-100 text-yellow-700",
        SHIPPED: "bg-purple-100 text-purple-700",
        DELIVERED: "bg-green-100 text-green-700",
    };

    const url_getAllOrders = backendUrl + "/order/";

    const getAllOrders = async () => {
        try {
            if (!isLoggedIn) {
                throw new Error("you need to sign in first");
            }

            const response = await fetch(url_getAllOrders, {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(
                    "some problem occurred while fetching the orders",
                );
            }

            const result = await response.json();

            setAllOrders(result);
        } catch (error) {
            setError(error);
        }
    };

    const getOrderTotal = (items) => {
        return items.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    return (
        <>
            <div className="max-w-7xl mx-auto px-6">
                {/* continue shopping */}
                <div className="mb-8">
                    <Link
                        to={"/"}
                        className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 mt-5"
                    >
                        ← Continue shopping
                    </Link>

                    <h1 className="mt-4 text-2xl font-semibold">Orders</h1>

                    <div className="flex flex-col">
                        {allOrders.map((order, i) => (
                            <div
                                key={order.id}
                                // className="border rounded p-4 cursor-pointer"
                                className="border border-gray-200 rounded-lg p-6 cursor-pointer bg-white mb-4"
                                onClick={() => toggle(i)}
                            >
                                {/* <div className="flex flex-row justify-between"> */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-900">
                                            Order #{order.id}
                                        </h2>

                                        <h3 className="font-semibold mb-4">
                                            {
                                                new Date(order.orderPlacedDate)
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                statusStyles[order.orderStatus]
                                            }`}
                                        >
                                            {order.orderStatus}
                                        </span>

                                        <span className="font-semibold">
                                            Total: ₹{getOrderTotal(order.items)}
                                        </span>

                                        <span className="text-gray-500 text-lg">
                                            {/* TODO : replace '+', and '-' with an svg image */}

                                            {selected === i ? "-" : "+"}
                                        </span>
                                    </div>
                                    {/* have to include address, status, receiver name */}
                                </div>

                                {/* items in this order - start */}
                                {/* this would be visually visible only when card is expanded */}

                                {selected === i ? (
                                    // <div className="mt-4 space-y-3">
                                    <div className="mt-6 space-y-4 border-t pt-4">
                                        {order.items.map((item) => (
                                            <OrderItemProduct
                                                key={item.productId}
                                                productId={item.productId}
                                                title={item.productName}
                                                quantity={item.quantity}
                                                price={item.price}
                                            />
                                        ))}
                                    </div>
                                ) : null}

                                {/* items in this order - end */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Order;

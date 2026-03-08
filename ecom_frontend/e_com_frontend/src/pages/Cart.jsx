import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import SignInFirstComponent from "../components/SignInFirstComponent";

import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

function Cart() {
    const { isLoggedIn } = useAuth();
    const { allProducts, clearCart } = useCart();

    if (!isLoggedIn) {
        return <SignInFirstComponent name="Cart" />;
    }

    const [error, setError] = useState("");
    const [subtotal, setSubtotal] = useState(0);

    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        calcTotalCost();
    }, [allProducts]);

    const calcTotalCost = async () => {
        try {
            if (allProducts.length === 0) {
                setSubtotal(0);
                return;
            }

            const productTotals = await Promise.all(
                allProducts.map(async (item) => {
                    const productRes = await fetch(
                        backendUrl + `/product/${item.productId}`,
                    );

                    if (!productRes.ok) {
                        throw new Error("failed to fetch product");
                    }

                    const product = await productRes.json();

                    return product.price * item.quantity;
                }),
            );

            const total = productTotals.reduce((sum, value) => sum + value, 0);
            setSubtotal(total);
        } catch (error) {
            setError(error);
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-6">
                {/* continue shopping and Cart heading*/}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 mt-5"
                    >
                        ← Continue shopping
                    </Link>

                    <h1 className="mt-4 text-2xl font-semibold">Cart</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* this is differentiating line */}

                    <div className="lg:col-span-2">
                        {allProducts.map((item) => (
                            <CartItem
                                key={item.productId}
                                productId={item.productId}
                                productQuantity={item.quantity}
                            />
                        ))}
                    </div>

                    {/* order summary */}
                    <div className="lg:col-span-1">
                        {allProducts.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                You have nothing in your cart.
                            </p>
                        ) : (
                            <OrderSummary subtotal={subtotal} />
                        )}
                    </div>

                    {/* this is differentiating line */}

                    {/* clear cart button - render only when there are any products in the cart */}
                    <div className="lg:col-span-1">
                        {allProducts.length === 0 ? (
                            <></>
                        ) : (
                            // <OrderSummary subtotal={subtotal} />
                            <button
                                onClick={clearCart}
                                className="w-full bg-black text-white py-2 rounded cursor-pointer"
                            >
                                clear cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;

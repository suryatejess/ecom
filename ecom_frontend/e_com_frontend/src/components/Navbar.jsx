import React, { useEffect, useState } from "react";
import Signin from "./Signin";
import SignOutButton from "./SignOutButton";
import { NavLink } from "react-router-dom";
import.meta.env.VITE_API_BASE_URL;
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
    const { isLoggedIn, appName, userRole } = useAuth();
    const { cartCount } = useCart();

    return (
        <div className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* <div className="flex flex-row justify-between border-b-2 mb-2 p-2"> */}
                <NavLink to="/" className="text-sm font-semibold tracking-wide">
                    STORE
                </NavLink>

                <div className="flex gap-4">
                    {isLoggedIn && (
                        <p className="text-shadow-black">
                            signed in as <span>{appName}</span>
                        </p>
                    )}

                    {userRole === "ADMIN" && (
                        <NavLink to="/admin" className="flex gap-4 font-semibold text-red-600">
                            Admin
                        </NavLink>
                    )}

                    {/* orders */}
                    <NavLink to="/order" className="flex gap-4">
                        Orders
                    </NavLink>

                    {/* cart */}
                    <div>
                        <NavLink to="/cart" className="relative">
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
                                className="lucide lucide-shopping-bag h-5 w-5"
                            >
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                                <path d="M3 6h18"></path>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-medium">
                                {cartCount}
                            </span>
                        </NavLink>
                    </div>

                    {/* signin / signout button */}
                    {isLoggedIn ? <SignOutButton /> : <Signin />}
                </div>
                {/* </div> */}
            </div>
        </div>
    );
};

export default Navbar;

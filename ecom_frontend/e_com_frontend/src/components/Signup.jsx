import React from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/*
    gotta deal with : 
        username, 
        password, 
        name, 
        email, 
        address
*/

const Signup = () => {
    const { isLoggedIn } = useAuth();

    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const url_backendSignup = backendUrl + "/auth/createUser";

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(url_backendSignup, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    name,
                    email,
                    address,
                }),
            });

            if (response.status === 409) {
                throw new Error(
                    "user with username " + username + " exists already ",
                );
            }

            if (response.status === 401) {
                throw new Error("Incorrect username or password");
            }

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const jwt = await response.text();

            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <div>
                    <h1 className="text-lg font-bold text-center">
                        Welcome back
                    </h1>
                    <p className="font-light text-center">
                        Enter your credentials to access your account
                    </p>
                    <form className="mt-6" onSubmit={handleSubmit}>
                        <div>
                            {/* username */}
                            <label htmlFor="uname">Username</label>
                            <br />
                            <input
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError("");
                                }}
                                className="border-2 w-full"
                                type="text"
                                id="uname"
                                placeholder="johndoe"
                                name="uname"
                            />
                            <br />
                        </div>

                        {/* password */}
                        <div className="mt-3">
                            <label className="mt-6" htmlFor="password">
                                Password
                            </label>
                            <br />
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-2 w-full"
                                type="password"
                                id="password"
                                placeholder="Password"
                                name="password"
                            />
                            <br />
                        </div>

                        {/* name */}
                        <div className="mt-3">
                            <label className="mt-6" htmlFor="text">
                                Name
                            </label>
                            <br />
                            <input
                                onChange={(e) => setName(e.target.value)}
                                className="border-2 w-full"
                                type="text"
                                id="fname"
                                placeholder="John Doe"
                                name="fname"
                            />
                        </div>

                        {/* email */}
                        <div className="mt-3">
                            <label className="mt-6" htmlFor="text">
                                Email
                            </label>
                            <br />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-2 w-full"
                                type="text"
                                id="emailAddress"
                                placeholder="johndoe@email.com"
                                name="emailAddress"
                            />
                        </div>

                        {/* address */}
                        <div className="mt-3">
                            <label className="mt-6" htmlFor="text">
                                Address
                            </label>
                            <br />
                            <input
                                onChange={(e) => setAddress(e.target.value)}
                                className="border-2 w-full"
                                type="text"
                                id="address"
                                placeholder="Jane Street"
                                name="address"
                            />
                        </div>

                        <input
                            className="bg-black text-white p-2 w-full mt-6 cursor-pointer"
                            type="submit"
                            value={"Sign Up"}
                        />
                    </form>
                    <hr className="border-amber-500 m-8" />

                    <p className="text-sm text-center mt-4">
                        Have an account already?{" "}
                        <Link
                            to="/auth/login"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                    {error && (
                        <p className="text-red-600 text-sm text-center">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Signup;

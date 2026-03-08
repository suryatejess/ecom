import React from "react";

import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Signin = () => {
    const { login } = useAuth();

    return (
        <>
            <Link to={"/auth/login"} className="bg-green-200">
                Sign in
            </Link>
        </>
    );
};

export default Signin;

import React from "react";

import { useAuth } from "../contexts/AuthContext";

const SignOutButton = () => {
    const { logout } = useAuth();

    return (
        <>
            <button className="bg-red-200 cursor-pointer" onClick={logout}>
                Sign out
            </button>
        </>
    );
};

export default SignOutButton;

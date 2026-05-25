import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    const url_backendMe = backendUrl + "/auth/me";

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    const checkIfLoggedIn = async () => {
        try {
            const response = await fetch(url_backendMe, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                setIsLoggedIn(false);
                setAppName(null);
                return null;
            }

            const data = await response.json();
            setIsLoggedIn(true);
            setAppName(data.name);
            setUserRole(data.roleType);
            return data.roleType;
        } catch (error) {
            setError(error.message);
            return null;
        }
    };

    const [error, setError] = useState("");

    const [appName, setAppName] = useState("anony");

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const login = (token) => {
        checkIfLoggedIn();
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await fetch(backendUrl + "/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setIsLoggedIn(false);
        setAppName(null);
        setUserRole(null);
    };

    const fetchUsername = (username) => {
        checkIfLoggedIn();
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                login,
                logout,
                appName,
                userRole,
                fetchUsername,
                checkIfLoggedIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be added inside AuthProvider");
    }
    return context;
};

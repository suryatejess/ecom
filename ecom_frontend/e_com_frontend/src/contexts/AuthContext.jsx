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
                return;
            }

            const data = await response.json();
            setIsLoggedIn(true);
            setAppName(data.name);
        } catch (error) {
            setError(error.message);
        }
    };

    const [error, setError] = useState("");

    const [appName, setAppName] = useState("anony");

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = (token) => {
        checkIfLoggedIn();
        setIsLoggedIn(true);
    };

    const logout = () => {
        // TODO : call the logout method from the backend

        setIsLoggedIn(false);
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
                fetchUsername,
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

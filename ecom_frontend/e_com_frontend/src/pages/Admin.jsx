import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";

const TABS = ["Products", "Orders", "Users"];

const Admin = () => {
    const { isLoggedIn, userRole } = useAuth();
    const [activeTab, setActiveTab] = useState("Products");

    if (!isLoggedIn || userRole !== "ADMIN") {
        return (
            <div className="max-w-7xl mx-auto px-6 mt-10">
                <p className="text-gray-500">You do not have access to this page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 mt-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="flex gap-1 border-b mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 ${
                            activeTab === tab
                                ? "border-black text-black"
                                : "border-transparent text-gray-500 hover:text-black"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Products" && <AdminProducts />}
            {activeTab === "Orders" && <AdminOrders />}
            {activeTab === "Users" && <AdminUsers />}
        </div>
    );
};

export default Admin;

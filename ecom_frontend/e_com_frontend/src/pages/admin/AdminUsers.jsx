import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminUsers = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch(`${backendUrl}/auth/admin/users`, {
            credentials: "include",
        });
        if (!res.ok) {
            toast.error("Failed to fetch users");
            return;
        }
        const data = await res.json();
        setUsers(data);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">
                Users ({users.length})
            </h2>

            <table className="w-full text-sm text-left">
                <thead className="border-b">
                    <tr>
                        <th className="py-2 px-2">ID</th>
                        <th className="py-2 px-2">Username</th>
                        <th className="py-2 px-2">Name</th>
                        <th className="py-2 px-2">Email</th>
                        <th className="py-2 px-2">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="py-2 px-2">{user.id}</td>
                            <td className="py-2 px-2">{user.username}</td>
                            <td className="py-2 px-2">{user.name}</td>
                            <td className="py-2 px-2">{user.email}</td>
                            <td className="py-2 px-2">
                                <span
                                    className={
                                        user.roleType === "ADMIN"
                                            ? "text-red-600 font-semibold"
                                            : ""
                                    }
                                >
                                    {user.roleType}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;

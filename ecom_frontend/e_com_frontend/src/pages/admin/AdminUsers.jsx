import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminUsers = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        fetchUsers();
    }, [page]);

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
        setTotalElements(data.length);
    };

    const handleSearch = async () => {
        if (!search.trim()) {
            fetchUsers();
            return;
        }
        const res = await fetch(
            `${backendUrl}/auth/search?search=${encodeURIComponent(search)}&page=${page}&size=${pageSize}`,
            { credentials: "include" },
        );
        if (!res.ok) {
            toast.error("Failed to search users");
            return;
        }
        const data = await res.json();
        setUsers(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
    };

    const filteredUsers = search.trim()
        ? users
        : users.slice(page * pageSize, (page + 1) * pageSize);

    const localTotalPages = search.trim()
        ? totalPages
        : Math.ceil(users.length / pageSize);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                Users ({totalElements})
            </h2>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Search by name, username, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="border rounded px-3 py-2 text-sm flex-1"
                />
                <button
                    onClick={handleSearch}
                    className="bg-black text-white px-4 py-2 rounded text-sm"
                >
                    Search
                </button>
                {search && (
                    <button
                        onClick={() => { setSearch(""); setPage(0); fetchUsers(); }}
                        className="border rounded px-4 py-2 text-sm"
                    >
                        Clear
                    </button>
                )}
            </div>

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
                    {filteredUsers.map((user) => (
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

            {localTotalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        onClick={() => setPage(Math.max(page - 1, 0))}
                        disabled={page === 0}
                        className="border rounded px-3 py-1 text-sm disabled:opacity-30"
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {page + 1} of {localTotalPages}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(page + 1, localTotalPages - 1))}
                        disabled={page >= localTotalPages - 1}
                        className="border rounded px-3 py-1 text-sm disabled:opacity-30"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;

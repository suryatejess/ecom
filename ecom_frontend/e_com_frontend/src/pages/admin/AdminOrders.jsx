import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const AdminOrders = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const pageSize = 10;

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter]);

    const fetchOrders = async () => {
        let url = `${backendUrl}/order/admin/all?page=${page}&size=${pageSize}&sort=orderPlacedDate,desc`;
        if (statusFilter) {
            url += `&status=${statusFilter}`;
        }
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) {
            toast.error("Failed to fetch orders");
            return;
        }
        const data = await res.json();
        setOrders(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
    };

    const updateStatus = async (orderId, newStatus) => {
        const res = await fetch(`${backendUrl}/order/${orderId}/status`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            toast.success("Order status updated");
            fetchOrders();
        } else {
            toast.error("Failed to update status");
        }
    };

    const deleteOrder = async (orderId) => {
        const res = await fetch(`${backendUrl}/order/${orderId}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (res.ok) {
            toast.success("Order deleted");
            fetchOrders();
        } else {
            toast.error("Failed to delete order");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    Orders ({totalElements})
                </h2>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                    className="border rounded px-3 py-2 text-sm"
                >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <table className="w-full text-sm text-left">
                <thead className="border-b">
                    <tr>
                        <th className="py-2 px-2">ID</th>
                        <th className="py-2 px-2">User</th>
                        <th className="py-2 px-2">Receiver</th>
                        <th className="py-2 px-2">Address</th>
                        <th className="py-2 px-2">Items</th>
                        <th className="py-2 px-2">Date</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                            <td className="py-2 px-2">{order.id}</td>
                            <td className="py-2 px-2">{order.username}</td>
                            <td className="py-2 px-2">{order.receiverName}</td>
                            <td className="py-2 px-2 max-w-[150px] truncate">
                                {order.address}
                            </td>
                            <td className="py-2 px-2">
                                {order.items.map((item, i) => (
                                    <div key={i} className="text-xs">
                                        {item.productName} x{item.quantity}
                                    </div>
                                ))}
                            </td>
                            <td className="py-2 px-2 text-xs">
                                {new Date(
                                    order.orderPlacedDate,
                                ).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-2">
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) =>
                                        updateStatus(order.id, e.target.value)
                                    }
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="py-2 px-2">
                                <button
                                    onClick={() => deleteOrder(order.id)}
                                    className="text-red-600 font-medium text-sm"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        onClick={() => setPage(Math.max(page - 1, 0))}
                        disabled={page === 0}
                        className="border rounded px-3 py-1 text-sm disabled:opacity-30"
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setPage(Math.min(page + 1, totalPages - 1))
                        }
                        disabled={page >= totalPages - 1}
                        className="border rounded px-3 py-1 text-sm disabled:opacity-30"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;

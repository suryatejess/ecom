import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminProducts = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [addForm, setAddForm] = useState({
        name: "",
        imageLink: "",
        price: "",
        shortDescription: "",
        longDescription: "",
        quantity: "",
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch(`${backendUrl}/product/`);
        const data = await res.json();
        setProducts(data);
    };

    const deleteProduct = async (id) => {
        const res = await fetch(`${backendUrl}/product/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (res.ok) {
            toast.success("Product deleted");
            fetchProducts();
        } else {
            toast.error("Failed to delete product");
        }
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setEditForm({
            name: product.name,
            image: product.image || "",
            price: product.price,
            shortDesc: product.shortDesc,
            longDesc: product.longDesc || "",
            availableQuantity: product.availableQuantity,
        });
    };

    const saveEdit = async (id) => {
        const res = await fetch(`${backendUrl}/product/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        });
        if (res.ok) {
            toast.success("Product updated");
            setEditingId(null);
            fetchProducts();
        } else {
            toast.error("Failed to update product");
        }
    };

    const addProduct = async () => {
        const res = await fetch(`${backendUrl}/product/`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addForm),
        });
        if (res.ok) {
            toast.success("Product added");
            setShowAddForm(false);
            setAddForm({ name: "", imageLink: "", price: "", shortDescription: "", longDescription: "", quantity: "" });
            fetchProducts();
        } else {
            toast.error("Failed to add product");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Products ({products.length})</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-black text-white px-4 py-2 rounded text-sm"
                >
                    {showAddForm ? "Cancel" : "Add Product"}
                </button>
            </div>

            {showAddForm && (
                <div className="border rounded p-4 mb-6 space-y-3">
                    <h3 className="font-semibold">New Product</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="border rounded px-3 py-2 text-sm" />
                        <input placeholder="Image URL" value={addForm.imageLink} onChange={(e) => setAddForm({ ...addForm, imageLink: e.target.value })} className="border rounded px-3 py-2 text-sm" />
                        <input placeholder="Price" type="number" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} className="border rounded px-3 py-2 text-sm" />
                        <input placeholder="Quantity" type="number" value={addForm.quantity} onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })} className="border rounded px-3 py-2 text-sm" />
                        <input placeholder="Short Description" value={addForm.shortDescription} onChange={(e) => setAddForm({ ...addForm, shortDescription: e.target.value })} className="border rounded px-3 py-2 text-sm" />
                        <input placeholder="Long Description" value={addForm.longDescription} onChange={(e) => setAddForm({ ...addForm, longDescription: e.target.value })} className="border rounded px-3 py-2 text-sm" />
                    </div>
                    <button onClick={addProduct} className="bg-black text-white px-4 py-2 rounded text-sm">Save</button>
                </div>
            )}

            <table className="w-full text-sm text-left">
                <thead className="border-b">
                    <tr>
                        <th className="py-2 px-2">ID</th>
                        <th className="py-2 px-2">Name</th>
                        <th className="py-2 px-2">Price</th>
                        <th className="py-2 px-2">Qty</th>
                        <th className="py-2 px-2">Short Desc</th>
                        <th className="py-2 px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border-b">
                            {editingId === product.id ? (
                                <>
                                    <td className="py-2 px-2">{product.id}</td>
                                    <td className="py-2 px-2">
                                        <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="border rounded px-2 py-1 text-sm w-full" />
                                    </td>
                                    <td className="py-2 px-2">
                                        <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="border rounded px-2 py-1 text-sm w-20" />
                                    </td>
                                    <td className="py-2 px-2">
                                        <input type="number" value={editForm.availableQuantity} onChange={(e) => setEditForm({ ...editForm, availableQuantity: e.target.value })} className="border rounded px-2 py-1 text-sm w-16" />
                                    </td>
                                    <td className="py-2 px-2">
                                        <input value={editForm.shortDesc} onChange={(e) => setEditForm({ ...editForm, shortDesc: e.target.value })} className="border rounded px-2 py-1 text-sm w-full" />
                                    </td>
                                    <td className="py-2 px-2 space-x-2">
                                        <button onClick={() => saveEdit(product.id)} className="text-green-600 font-medium">Save</button>
                                        <button onClick={() => setEditingId(null)} className="text-gray-500">Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="py-2 px-2">{product.id}</td>
                                    <td className="py-2 px-2">{product.name}</td>
                                    <td className="py-2 px-2">{product.price}</td>
                                    <td className="py-2 px-2">{product.availableQuantity}</td>
                                    <td className="py-2 px-2">{product.shortDesc}</td>
                                    <td className="py-2 px-2 space-x-2">
                                        <button onClick={() => startEdit(product)} className="text-blue-600 font-medium">Edit</button>
                                        <button onClick={() => deleteProduct(product.id)} className="text-red-600 font-medium">Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;

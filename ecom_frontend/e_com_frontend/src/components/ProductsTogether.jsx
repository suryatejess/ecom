import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import.meta.env.VITE_API_BASE_URL;

const ProductsTogether = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${backendUrl}/product/`);

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [backendUrl]);

    if (loading) return <p className="p-8">Loading products...</p>;
    if (error) return <p className="p-8 text-red-500">{error}</p>;

    const image_ =
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80";
    const name_ = "Minimal ceramic vase";
    const price_ = 89;

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        id={product.id}
                        availableQuantity={product.availableQuantity}
                        longDesc={product.longDesc}
                        shortDesc={product.shortDesc}
                    />
                ))}
            </div>
        </>
    );
};

export default ProductsTogether;

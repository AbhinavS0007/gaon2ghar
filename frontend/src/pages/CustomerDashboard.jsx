import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function CustomerDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState({});
    const [myOrders, setMyOrders] = useState([]);
    const [imageIndexes, setImageIndexes] = useState({});


    const fetchProducts = async () => {
        const res = await api.get("/products");
        setProducts(res.data);
    };

    const fetchMyOrders = async () => {
        const res = await api.get("/orders/my");
        setMyOrders(res.data);
    };

    useEffect(() => {
        fetchProducts();
        fetchMyOrders();
    }, []);

    const handleQuantityChange = (productId, value) => {
        setOrders({ ...orders, [productId]: value });
    };

    const placeOrder = async (productId) => {
        const quantity = orders[productId] || 1;

        await api.post("/orders", {
            productId,
            quantity: Number(quantity),
        });

        fetchProducts();
        fetchMyOrders();
    };

    const getStatusColor = (status) => {
        if (status === "pending") return "bg-yellow-200 text-yellow-800";
        if (status === "accepted") return "bg-blue-200 text-blue-800";
        if (status === "delivered") return "bg-green-200 text-green-800";
        return "bg-gray-200";
    };

    const nextImage = (productId, total) => {
        setImageIndexes((prev) => ({
            ...prev,
            [productId]:
                ((prev[productId] || 0) + 1) % total,
        }));
    };

    const prevImage = (productId, total) => {
        setImageIndexes((prev) => ({
            ...prev,
            [productId]:
                ((prev[productId] || 0) - 1 + total) % total,
        }));
    };


    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">
                    Customer Dashboard
                </h2>

                {/* Product cards */}
                <h3 className="text-lg font-semibold mb-4">
                    Available Products
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {products && products.length > 0 ? (
                        products.map((p) => (
                            <div
                                key={p._id}
                                className="bg-white p-4 rounded shadow"
                            >
                                {/* Product Image */}
                                {p.images && p.images.length > 0 && (
                                    <div className="relative w-full h-40 mb-2">
                                        <img
                                            src={
                                                p.images[
                                                imageIndexes[p._id] || 0
                                                ]
                                            }
                                            alt={p.name}
                                            className="w-full h-full object-cover rounded"
                                        />

                                        {p.images.length > 1 && (
                                            <>
                                                {/* Left button */}
                                                <button
                                                    onClick={() =>
                                                        prevImage(p._id, p.images.length)
                                                    }
                                                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 rounded"
                                                >
                                                    ‹
                                                </button>

                                                {/* Right button */}
                                                <button
                                                    onClick={() =>
                                                        nextImage(p._id, p.images.length)
                                                    }
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 rounded"
                                                >
                                                    ›
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}


                                <h4 className="text-lg font-bold">{p.name}</h4>
                                <p className="text-gray-600">₹{p.price}</p>
                                <p className="text-sm text-gray-500 mb-2">
                                    Stock: {p.quantity}
                                </p>

                                {p.description && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        {p.description}
                                    </p>
                                )}

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    className="border p-1 w-full mb-2 rounded"
                                    onChange={(e) =>
                                        handleQuantityChange(p._id, e.target.value)
                                    }
                                />

                                <button
                                    onClick={() => placeOrder(p._id)}
                                    className="bg-green-600 text-white w-full py-2 rounded"
                                >
                                    Order
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full text-center">
                            No products available
                        </p>
                    )}
                </div>


                {/* My orders */}
                <h3 className="text-lg font-semibold mb-4">
                    My Orders
                </h3>

                <div className="space-y-3">
                    {myOrders.map((o) => (
                        <div
                            key={o._id}
                            className="bg-white p-4 rounded shadow flex justify-between items-center"
                        >
                            <div>
                                <p>
                                    {o.productId
                                        ? o.productId.name
                                        : "Product not available"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Qty: {o.quantity} | ₹{o.totalPrice}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded text-sm ${getStatusColor(
                                    o.status
                                )}`}
                            >
                                {o.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default CustomerDashboard;

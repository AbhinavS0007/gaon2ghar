import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function CustomerDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState({});
    const [myOrders, setMyOrders] = useState([]);
    const [imageIndexes, setImageIndexes] = useState({});
    const [quantities, setQuantities] = useState({});



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

    // const handleQuantityChange = (productId, value) => {
    //     setOrders({ ...orders, [productId]: value });
    // };

    // const placeOrder = async (productId) => {
    //     const quantity = orders[productId] || 1;

    //     await api.post("/orders", {
    //         productId,
    //         quantity: Number(quantity),
    //     });

    //     fetchProducts();
    //     fetchMyOrders();
    // };

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

    const handleQuantityChange = (productId, value) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Number(value),
        }));
    };


    const addToCart = async (productId) => {
        try {
            const quantity = quantities[productId] || 1;

            await api.post("/cart/add", {
                productId,
                quantity,
            });

            //   alert("Added to cart");
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Failed to add to cart");
        }
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div
                            key={p._id}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                        >
                            {/* Image */}
                            <div className="w-full h-48 bg-gray-100 overflow-hidden">
                                {p.images && p.images.length > 0 ? (
                                    <img
                                        src={p.images[0]}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h4 className="text-lg font-semibold">{p.name}</h4>
                                <p className="text-green-700 font-bold text-lg">₹{p.price}</p>
                                <p className="text-sm text-gray-500 mb-2">
                                    Stock: {p.quantity}
                                </p>

                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                    {p.description}
                                </p>

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    className="border p-2 w-full mb-3 rounded"
                                    onChange={(e) =>
                                        handleQuantityChange(p._id, e.target.value)
                                    }
                                />


                                <button
                                    onClick={() => addToCart(p._id)}
                                    className="mt-auto bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
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

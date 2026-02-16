import React, { useState, useEffect } from 'react'
import api from "../api/axios";
import Layout from "../components/Layout";

const Orders = () => {

    const [myOrders, setMyOrders] = useState([]);

    const fetchMyOrders = async () => {
        const res = await api.get("/orders/my");
        setMyOrders(res.data);
    };
    console.log(myOrders);


    useEffect(() => {
        fetchMyOrders();
    }, []);

    const getStatusColor = (status) => {
        if (status === "pending") return "bg-yellow-200 text-yellow-800";
        if (status === "accepted") return "bg-blue-200 text-blue-800";
        if (status === "delivered") return "bg-green-200 text-green-800";
        return "bg-gray-200";
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
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
    )
}

export default Orders
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";

const Orders = () => {
    const [myOrders, setMyOrders] = useState([]);

    const orderSteps = [
        "pending",
        "accepted",
        "packed",
        "out_for_delivery",
        "delivered",
    ];

    const getStepIndex = (status) => {
        return orderSteps.indexOf(status);
    };


    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const res = await api.get("/orders/my");
            setMyOrders(res.data.reverse());
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "accepted":
                return "bg-blue-100 text-blue-800";
            case "packed":
                return "bg-purple-100 text-purple-800";
            case "out_for_delivery":
                return "bg-orange-100 text-orange-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const cancelOrder = async (id) => {
        try {
            await api.patch(`/orders/${id}/cancel`);
            fetchMyOrders();
            toast.success("Order cancelled");
        } catch (err) {
            toast.error("Cancel failed");
        }
    };
    const rateOrder = async (id, rating) => {
        try {
            await api.patch(`/orders/${id}/rate`, {
                rating,
                review: "",
            });
            fetchMyOrders();
            toast.success("Rated successfully");
        } catch (err) {
            toast.error("Rating failed");
        }
    };


    return (
        <Layout>
            <div className="bg-gray-100 min-h-screen p-6">
                <div className="max-w-5xl mx-auto">

                    <h2 className="text-2xl font-bold mb-6">
                        My Orders
                    </h2>

                    {myOrders.length === 0 ? (
                        <div className="bg-white p-6 rounded shadow text-center">
                            No orders yet.
                        </div>
                    ) : (
                        myOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white p-5 rounded shadow mb-6 flex gap-6"
                            >
                                {/* LEFT SIDE - PRODUCT IMAGE */}
                                <div>
                                    <img
                                        src={
                                            order.productId?.images?.[0] ||
                                            "https://via.placeholder.com/120"
                                        }
                                        alt={order.productId?.name}
                                        className="w-28 h-28 object-cover rounded"
                                    />
                                </div>

                                {/* RIGHT SIDE - DETAILS */}
                                <div className="flex-1">

                                    {/* Top Row */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {order.productId?.name || "Product not available"}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                Order ID: {order._id.slice(-6)}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Status Badge */}
                                        <span
                                            className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* Middle Section */}
                                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                                        <p>Quantity: {order.quantity} kg</p>
                                        <p>Price per kg: ₹{order.productId?.price}</p>
                                        <p className="font-semibold text-black">
                                            Total: ₹{order.totalPrice}
                                        </p>
                                    </div>

                                    {/* Address Section */}
                                    {order.address && (
                                        <div className="mt-4 text-sm text-gray-500">
                                            <p className="font-semibold text-black">
                                                Delivery Address:
                                            </p>
                                            <p>{order.address}</p>
                                        </div>
                                    )}

                                    {order.status === "pending" && (
                                        <button
                                            onClick={() => cancelOrder(order._id)}
                                            className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Cancel Order
                                        </button>
                                    )}

                                    {order.status === "delivered" && order.rating === 0 && (
                                        <div className="mt-3">
                                            <select
                                                onChange={(e) =>
                                                    rateOrder(order._id, Number(e.target.value))
                                                }
                                                className="border p-1 rounded"
                                            >
                                                <option value="">Rate</option>
                                                <option value="5">⭐⭐⭐⭐⭐</option>
                                                <option value="4">⭐⭐⭐⭐</option>
                                                <option value="3">⭐⭐⭐</option>
                                                <option value="2">⭐⭐</option>
                                                <option value="1">⭐</option>
                                            </select>
                                        </div>
                                    )}



                                    {/* Delivery Timeline */}
                                    {order.status !== "rejected" && order.status !== "cancelled" && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs mb-2">
                                                {orderSteps.map((step, index) => (
                                                    <span
                                                        key={step}
                                                        className={`${index <= getStepIndex(order.status)
                                                            ? "text-green-600 font-semibold"
                                                            : "text-gray-400"
                                                            }`}
                                                    >
                                                        {step.replaceAll("_", " ")}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="w-full bg-gray-200 h-2 rounded-full">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${((getStepIndex(order.status) + 1) / orderSteps.length) * 100
                                                            }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                        ))


                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Orders;

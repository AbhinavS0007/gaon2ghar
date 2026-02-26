import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";

const Orders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setloading] = useState(false);


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
        setloading(true);
        try {
            const res = await api.get("/orders/my");
            setMyOrders(res.data.reverse());
        } catch (err) {
            console.error(err);
        }finally{
            setloading(false);
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
    if(loading){
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
              <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-green-500 border-r-yellow-400 animate-spin"></div>
            </div>
          );
    }


    return (
        <Layout>
          <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
      
              <h2 className="text-3xl font-extrabold mb-8 text-gray-800">
                My Orders
              </h2>
      
              {myOrders.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-md text-center text-gray-500">
                  No orders yet.
                </div>
              ) : (
                myOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white/80 backdrop-blur-lg border border-gray-200
                               p-6 rounded-3xl shadow-md hover:shadow-xl 
                               transition-all duration-300 mb-8 
                               flex flex-col md:flex-row gap-6"
                  >
      
                    {/* IMAGE */}
                    <div className="flex justify-center md:justify-start">
                      <img
                        src={
                          order.productId?.images?.[0] ||
                          "https://via.placeholder.com/120"
                        }
                        alt={order.productId?.name}
                        className="w-32 h-32 object-cover rounded-2xl shadow"
                      />
                    </div>
      
                    {/* DETAILS */}
                    <div className="flex-1">
      
                      {/* HEADER */}
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {order.productId?.name || "Product not available"}
                          </h3>
      
                          <p className="text-sm text-gray-500">
                            Order ID: {order._id.slice(-6)}
                          </p>
      
                          <p className="text-sm text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
      
                        {/* STATUS BADGE */}
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm ${getStatusColor(order.status)}`}
                        >
                          {order.status.replaceAll("_", " ")}
                        </span>
                      </div>
      
                      {/* ORDER INFO */}
                      <div className="mt-5 text-sm text-gray-600 space-y-1">
                        <p>Quantity: {order.quantity} kg</p>
                        <p>Price per kg: ₹{order.productId?.price}</p>
                        <p className="font-bold text-gray-900 text-lg">
                          Total: ₹{order.totalPrice}
                        </p>
                      </div>
      
                      {/* ADDRESS */}
                      {order.address && (
                        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                          <p className="font-semibold text-gray-800 mb-1">
                            Delivery Address:
                          </p>
                          <p>{order.address}</p>
                        </div>
                      )}
      
                      {/* ACTION BUTTONS */}
                      {order.status === "pending" && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="mt-4 px-4 py-2 rounded-xl 
                                     bg-red-500 text-white 
                                     hover:bg-red-600 
                                     transition-all duration-300"
                        >
                          Cancel Order
                        </button>
                      )}
      
                      {order.status === "delivered" && order.rating === 0 && (
                        <div className="mt-4">
                          <select
                            onChange={(e) =>
                              rateOrder(order._id, Number(e.target.value))
                            }
                            className="border border-gray-300 px-3 py-2 rounded-xl 
                                       focus:ring-2 focus:ring-green-500 
                                       focus:outline-none transition"
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
      
                      {/* DELIVERY PROGRESS */}
                      {order.status !== "rejected" &&
                        order.status !== "cancelled" && (
                          <div className="mt-6">
      
                            <div className="flex justify-between text-xs mb-3">
                              {orderSteps.map((step, index) => (
                                <span
                                  key={step}
                                  className={`capitalize ${
                                    index <= getStepIndex(order.status)
                                      ? "text-green-600 font-semibold"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step.replaceAll("_", " ")}
                                </span>
                              ))}
                            </div>
      
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-green-500 to-green-700 
                                           h-2 rounded-full transition-all duration-700"
                                style={{
                                  width: `${
                                    ((getStepIndex(order.status) + 1) /
                                      orderSteps.length) *
                                    100
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

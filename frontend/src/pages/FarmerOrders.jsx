import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/farmer");
      setOrders(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success("Order updated");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
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

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            Incoming Orders
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-center">
              No incoming orders
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-5 rounded shadow mb-6"
              >
                {/* Order Info */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {order.productId?.name}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Qty: {order.quantity}
                    </p>

                    <p className="text-sm text-gray-600">
                      Customer: {order.user?.name}
                    </p>

                    <p className="text-sm text-gray-600">
                      Address: {order.address}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-4 flex gap-3">

                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(order._id, "accepted")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(order._id, "rejected")
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {order.status === "accepted" && (
                    <button
                      onClick={() =>
                        updateStatus(order._id, "packed")
                      }
                      className="bg-purple-600 text-white px-4 py-2 rounded"
                    >
                      Mark as Packed
                    </button>
                  )}

                  {order.status === "packed" && (
                    <button
                      onClick={() =>
                        updateStatus(order._id, "out_for_delivery")
                      }
                      className="bg-orange-600 text-white px-4 py-2 rounded"
                    >
                      Out for Delivery
                    </button>
                  )}

                  {order.status === "out_for_delivery" && (
                    <button
                      onClick={() =>
                        updateStatus(order._id, "delivered")
                      }
                      className="bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Mark Delivered
                    </button>
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

export default FarmerOrders;

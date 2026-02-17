import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);

  // fetch farmer orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/farmer");
      setOrders(res.data.reverse());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // accept order
  const acceptOrder = async (id) => {
    try {
      await api.patch(`/orders/${id}/accept`);
      toast.success("Order accepted");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept order");
    }
  };

  // reject order
  const rejectOrder = async (id) => {
    try {
      await api.patch(`/orders/${id}/reject`);
      toast.success("Order rejected");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject order");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          Incoming Orders
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            No orders yet
          </div>
        ) : (
          orders.map((o) => (
            <div
              key={o._id}
              className="bg-white p-4 mb-4 rounded shadow flex justify-between items-center"
            >
              {/* Order details */}
              <div>
                <h4 className="font-bold text-lg">
                  {o.productId?.name}
                </h4>

                <p className="text-gray-600">
                  Qty: {o.quantity}
                </p>

                <p className="text-gray-600">
                  Customer: {o.customerId?.name}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Address: {o.address}
                </p>

                {/* Status badge */}
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded ${
                    o.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : o.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : o.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-200"
                  }`}
                >
                  {o.status}
                </span>
              </div>

              {/* Action buttons */}
              {o.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptOrder(o._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => rejectOrder(o._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default FarmerOrders;

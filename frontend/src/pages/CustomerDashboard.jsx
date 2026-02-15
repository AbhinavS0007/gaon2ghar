import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState({});
  const [myOrders, setMyOrders] = useState([]);

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
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded shadow"
            >
              <h4 className="text-lg font-bold">{p.name}</h4>
              <p className="text-gray-600">₹{p.price}</p>
              <p className="text-sm text-gray-500 mb-2">
                Stock: {p.quantity}
              </p>

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
                <p className="font-semibold">
                  {o.productId.name}
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

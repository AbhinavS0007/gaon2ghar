import { useState, useEffect } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function FarmerDashboard() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/my");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", form);
      setForm({ name: "", price: "", quantity: "" });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Farmer Dashboard</h2>

        {/* Add product card */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Add Product</h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button className="bg-green-600 text-white p-2 rounded col-span-full">
              Add Product
            </button>
          </form>
        </div>

        {/* Product cards */}
        <h3 className="text-lg font-semibold mb-4">My Products</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded shadow"
            >
              <h4 className="text-lg font-bold">{p.name}</h4>
              <p className="text-gray-600">₹{p.price}</p>
              <p className="text-sm text-gray-500">
                Stock: {p.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default FarmerDashboard;

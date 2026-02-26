import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { Toaster, toast } from "react-hot-toast";

function CustomerDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [myOrders, setMyOrders] = useState([]);
    const [imageIndexes, setImageIndexes] = useState({});
    const [quantities, setQuantities] = useState({});



    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await api.get("/products");
        setProducts(res.data);
        } catch (error) {
            console.log(error);
            
        }finally{
            setLoading(false)
        }
    };

    const fetchMyOrders = async () => {
        const res = await api.get("/orders/my");
        setMyOrders(res.data);
    };

    useEffect(() => {
        fetchProducts();
        fetchMyOrders();
    }, []);



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


    const addToCart = async (productId) => {
        try {
            const quantity = quantities[productId] || 1;

            await api.post("/cart/add", {
                productId,
                quantity,
            });

            toast.success("Added to cart");
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error("Failed to add to cart");
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
  <Toaster position="top-center" />

  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-10 px-4">
    <div className="max-w-7xl mx-auto">

      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Fresh From Farmers 🌾
        </h1>
        <p className="text-gray-500 mt-2">
          Directly sourced. No middlemen. Pure quality.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((p) => (
          <div
            key={p._id}
            className="group bg-white/70 backdrop-blur-lg border border-white/40
                       rounded-2xl shadow-lg overflow-hidden
                       transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              {p.images && p.images.length > 0 ? (
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 text-sm font-semibold rounded-full shadow">
                ₹{p.price}/Kg
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col">
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                {p.name}
              </h4>

              <p className="text-sm text-gray-500 mb-2">
                Stock: {p.quantity} Kg
              </p>

              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {p.description}
              </p>

             
              <button
                onClick={() => addToCart(p._id)}
                className="mt-auto bg-green-600 text-white py-2 rounded-xl font-semibold
                           transition-all duration-300 hover:bg-green-700 hover:scale-105 active:scale-95 shadow-md"
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</Layout>
    );
}

export default CustomerDashboard;

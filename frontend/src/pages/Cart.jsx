import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function Cart() {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState("");


    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await api.get("/cart");
            setCart(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //   cart.items[0].product.quantity


    const updateQuantity = async (productId, quantity) => {
        // Update UI instantly
        setCart((prevCart) => ({
            ...prevCart,
            items: prevCart.items.map((item) =>
                item.product._id === productId
                    ? { ...item, quantity }
                    : item
            ),
        }));

        // Update backend silently
        try {
            await api.put("/cart/update", {
                productId,
                quantity,
            });
        } catch (err) {
            console.error(err);
        }
    };



    const removeItem = async (productId) => {
        try {
            const res = await api.delete(`/cart/remove/${productId}`);
            setCart(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to remove item");
        }
    };



    //   const checkout = async () => {
    //     try {
    //       await api.post("/cart/checkout");
    //       alert("Order placed successfully");
    //       fetchCart();
    //     } catch (err) {
    //       console.log(err);
    //       alert("Checkout failed");
    //     }
    //   };

    const checkout = async () => {
        if (!address) {
            alert("Please enter address");
            return;
        }

        try {
            await api.post("/cart/checkout", { address });
            alert("Order placed successfully");
            fetchCart();
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Checkout failed");
        }
    };






    const totalProductValue = cart.items.reduce(
        (sum, item) =>
            sum + (item.product?.price || 0) * item.quantity,
        0
    );

    const deliveryCharges = 100

    const totalAmount = totalProductValue + 100;

    if (loading) {
        return <div className="p-6 text-center">Loading cart...</div>;
    }

    return (
        <Layout>
            <div className="bg-gray-100 min-h-screen p-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">

                    {/* Cart Items */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-2xl font-bold mb-4">My Cart</h2>

                        <textarea
                            placeholder="Enter delivery address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border p-2 rounded mt-4"
                        ></textarea>

                        {cart.items.length === 0 ? (
                            <p className="text-gray-600">Cart is empty</p>
                        ) : (
                            cart.items.map((item) => (
                                <div
                                    key={item.product?._id}
                                    className="bg-white p-4 rounded shadow flex gap-4 items-center"
                                >
                                    {/* Product Image */}
                                    <img
                                        src={
                                            item.product?.images?.[0] ||
                                            "https://via.placeholder.com/100"
                                        }
                                        alt={item.product?.name}
                                        className="w-24 h-24 object-cover rounded"
                                    />

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">
                                            {item.product?.name}
                                        </h3>

                                        <p className="text-gray-600">
                                            Stock: {item.product?.quantity} Kg
                                        </p>

                                        <p className="text-gray-600">
                                            ₹{item.product?.price} per kg
                                        </p>

                                        {/* Quantity Dropdown */}
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-sm text-gray-500">
                                                Qty:
                                            </span>
                                            <select
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(
                                                        item.product._id,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="border rounded px-2 py-1"
                                            >
                                                {[...Array(Math.floor(Math.min(40, item.product?.quantity) / 5))].map((_, i) => {
                                                    const value = (i + 1) * 5;
                                                    return (
                                                        <option key={value} value={value}>
                                                            {value} kg
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                    </div>

                                    {/* Price & Remove */}
                                    <div className="text-right">
                                        <p className="font-bold text-lg">
                                            ₹
                                            {item.product?.price * item.quantity}
                                        </p>

                                        <button
                                            onClick={() =>
                                                removeItem(item.product._id)
                                            }
                                            className="text-red-500 text-sm mt-2 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Price Summary */}
                    <div className="bg-white p-6 rounded shadow h-fit">
                        <h3 className="text-xl font-bold mb-4">
                            Price Details
                        </h3>

                        <div className="flex justify-between mb-2">
                            <span>Total</span>
                            <span>₹{totalProductValue}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Delivery Charges</span>
                            <span>₹{deliveryCharges}</span>
                        </div>

                        <hr className="my-3" />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Amount</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        





                        <button
                            onClick={checkout}
                            className="bg-green-600 text-white w-full mt-6 py-3 rounded font-semibold"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Cart;

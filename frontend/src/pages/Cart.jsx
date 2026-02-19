import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import DeliverTo from "../components/DeliverTo";
import AddressModal from "../components/AddressModal";
import AddAddressForm from "../components/AddAddressForm";
import { Toaster, toast } from "react-hot-toast";
import AddressSelector from "../components/AddressSelector";
import Pricedetails from "../components/Pricedetails";


function Cart() {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [defaultAddress, setDefaultAddress] = useState(null);






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


    const updateQuantity = async (productId, quantity) => {
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
            toast.error("Failed to remove item");
        }
    };






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
                        <AddressSelector
                            defaultAddress={defaultAddress}
                            setDefaultAddress={setDefaultAddress}
                        />


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
                                                {[...Array(Math.floor(Math.min(40, item.product?.quantity)))].map((_, i) => {
                                                    const value = (i + 1);
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
                    <Pricedetails
    defaultAddress={defaultAddress}
    cart={cart}
/>
                </div>
            </div>
        </Layout>
    );
}

export default Cart;

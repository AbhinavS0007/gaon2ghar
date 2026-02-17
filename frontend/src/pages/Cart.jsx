import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import DeliverTo from "../components/DeliverTo";
import AddressModal from "../components/AddressModal";
import AddAddressForm from "../components/AddAddressForm";
import { Toaster, toast } from "react-hot-toast";


function Cart() {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    // const [address, setAddress] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [addressView, setAddressView] = useState(null);

    const [deliveryInfo, setDeliveryInfo] = useState({
        deliverable: true,
        deliveryCharge: 0,
    });




    const fetchAddresses = async () => {
        try {
            const res = await api.get("/address");
            const data = res.data;

            setAddresses(data);

            const defaultAddr = data.find((a) => a.isDefault);
            if (defaultAddr) {
                setDefaultAddress(defaultAddr);
            }
        } catch (err) {
            console.error("Error loading addresses", err);
        }
    };



    const checkDelivery = async (pincode) => {
        try {
            const res = await api.get(`/delivery-zones/${pincode}`);
            setDeliveryInfo(res.data);
        } catch (err) {
            console.error("Delivery check failed", err);
            setDeliveryInfo({
                deliverable: false,
                deliveryCharge: 0,
            });
        }
    };


    useEffect(() => {
        fetchCart();
        fetchAddresses();
    }, []);

    useEffect(() => {
        if (defaultAddress?.pincode) {
            checkDelivery(defaultAddress.pincode);
        }
    }, [defaultAddress]);



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

    // console.log("this is cart", cart);




    const removeItem = async (productId) => {
        try {
            const res = await api.delete(`/cart/remove/${productId}`);
            setCart(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove item");
        }
    };

    const checkout = async () => {
        if (!defaultAddress) {
            toast.error("Please select address");
            return;
        }

        if (cart.items.length === 0) {
            toast.error("Please select Items");
            return;
        }


        try {
            await api.post("/cart/checkout", {
                address: defaultAddress,
                deliveryCharge: deliveryCharges,
            });

            toast.success("Order placed successfully");
            fetchCart();
        } catch (err) {
            console.log(err);
            console.log(err.response?.data?.message);

            toast.error("Checkout failed");
        }
    };






    const totalProductValue = cart.items.reduce(
        (sum, item) =>
            sum + (item.product?.price || 0) * item.quantity,
        0
    );

    const deliveryCharges = deliveryInfo.deliverable
        ? deliveryInfo.deliveryCharge
        : 0;

    const totalAmount = totalProductValue + deliveryCharges;


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

                        <DeliverTo
                            address={defaultAddress}
                            onChange={() => setAddressView("list")}
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
                        {deliveryInfo.deliverable ? (
                            <div className="flex justify-between mb-2">
                                <span>Delivery Charges</span>
                                <span>₹{deliveryCharges}</span>
                            </div>
                        ) : (
                            <div className="text-red-600 font-semibold mb-2">
                                Not deliverable at this location
                            </div>
                        )}


                        <hr className="my-3" />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Amount</span>
                            <span>₹{totalAmount}</span>
                        </div>






                        <button
                            onClick={checkout}
                            disabled={!deliveryInfo.deliverable}
                            className={`w-full mt-6 py-3 rounded font-semibold text-white
    ${deliveryInfo.deliverable
                                    ? "bg-green-600"
                                    : "bg-gray-400 cursor-not-allowed"}`}
                        >
                            {deliveryInfo.deliverable
                                ? "Place Order"
                                : "Delivery Not Available"}
                        </button>

                    </div>
                </div>
            </div>

            {addressView === "list" && (
                <AddressModal
                    addresses={addresses}
                    onSelect={async (addr) => {
                        try {
                            // update UI immediately
                            setDefaultAddress(addr);

                            // update database
                            await api.put(`/address/default/${addr._id}`);

                            // reload from DB
                            await fetchAddresses();

                            // close modal
                            setAddressView(null);
                        } catch (err) {
                            console.error("Failed to set default address", err);
                        }
                    }}
                    onAddNew={() => setAddressView("form")}
                    onClose={() => setAddressView(null)}
                />
            )}





            {addressView === "form" && (
                <AddAddressForm
                    onSave={async (data) => {
                        try {
                            await api.post("/address", data);

                            // reload addresses from database
                            await fetchAddresses();

                            setAddressView(null);
                        } catch (err) {
                            console.error("Address save failed", err);
                        }
                    }}
                    onCancel={() => setAddressView("list")}
                />
            )}


        </Layout>
    );
}

export default Cart;

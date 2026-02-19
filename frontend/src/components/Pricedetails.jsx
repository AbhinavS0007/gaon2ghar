import React from 'react'
import { useEffect, useState } from "react";
import api from "../api/axios";

import { toast } from "react-hot-toast";
import DeliveryCharges from './DeliveryCharges';


const Pricedetails = ({ defaultAddress,cart }) => {

    const [deliveryMethod, setDeliveryMethod] = useState("null");


    // const [cart, setCart] = useState({ items: [] });
    // const [loading, setLoading] = useState(true);
    // const [addresses, setAddresses] = useState([]);
    // const [defaultAddress, setDefaultAddress] = useState(null);

    const [deliveryInfo, setDeliveryInfo] = useState({
        deliverable: true,
        deliveryCharge: 0,
    });




    // const fetchAddresses = async () => {
    //     try {
    //         const res = await api.get("/address");
    //         const data = res.data;

    //         // setAddresses(data);

    //         const defaultAddr = data.find((a) => a.isDefault);
    //         if (defaultAddr) {
    //             // setDefaultAddress(defaultAddr);
    //         }
    //     } catch (err) {
    //         console.error("Error loading addresses", err);
    //     }
    // };



    const checkDelivery = async (pincode) => {
        try {
            const res = await api.get(`/delivery-zones/${pincode}`);
            setDeliveryInfo(res.data);
            console.log(res.data);
            
        } catch (err) {
            console.error("Delivery check failed", err);
            setDeliveryInfo({
                deliverable: false,
                deliveryCharge: 0,
            });
        }
    };
    console.log(defaultAddress?.pincode);
    


    // useEffect(() => {
    //     // fetchCart();
    //     fetchAddresses();
    // }, []);

    useEffect(() => {
        if (defaultAddress?.pincode) {
            checkDelivery(defaultAddress.pincode);
        }
    }, [defaultAddress]);



    // const fetchCart = async () => {
    //     try {
    //         const res = await api.get("/cart");
    //         setCart(res.data);
    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         // setLoading(false);
    //     }
    // };




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
                deliveryMethod: deliveryMethod,
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

    let deliveryCharges = 0;

    if (totalProductValue > 0) {
        if (deliveryMethod === "pickup") {
            deliveryCharges = 0;
        } else {
            deliveryCharges = deliveryInfo.deliverable
                ? deliveryInfo.deliveryCharge
                : 0;
        }
    }


    const totalAmount = totalProductValue + deliveryCharges;

    return (
        <>

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


                <hr className="my-3" />

                <div className="flex flex-col gap-2">
                    <h4 className="text-md font-bold mb-4">
                        Select Delivery Method -
                    </h4>

                    <div className='hidden'>
                        <input
                            type="radio"
                            id="home"
                            name="delivery_method"
                            value="home"
                            checked={deliveryMethod === "home"}
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                        />
                        <label htmlFor="home" className="ml-2">
                            Deliver at your address
                        </label>
                    </div>

                    <div>
                        <input
                            type="radio"
                            id="pickup"
                            name="delivery_method"
                            value="pickup"
                            checked={deliveryMethod === "pickup"}
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                        />
                        <label htmlFor="pickup" className="ml-2">
                            Pickup from farmer house
                        </label>
                    </div>
                </div>


                <button
                    onClick={deliveryMethod === "pickup" ? checkout : () => alert("Move to payment page")}
                    disabled={deliveryMethod === "home" && !deliveryInfo.deliverable}
                    className={`w-full mt-6 py-3 rounded font-semibold text-white
                        ${deliveryMethod === "home" && !deliveryInfo.deliverable
                            ? "bg-gray-400 cursor-not-allowed"
                            : deliveryMethod === "home"
                                ? "bg-orange-400"
                                : "bg-green-600"
                        }
                          
                        }`}
                >
                    {deliveryMethod === "pickup"
                        ? "Place Order"
                        : deliveryInfo.deliverable === true ?  deliveryMethod === "null" ? "Select payment method" : " Move to Payment Page" : "Not deliverable at this location"}
                </button>


            </div>
        </>
    );
}

export default Pricedetails
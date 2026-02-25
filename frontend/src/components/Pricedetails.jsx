import React from 'react'
import { useEffect, useState } from "react";
import api from "../api/axios";

import { toast } from "react-hot-toast";
import DeliveryCharges from './DeliveryCharges';


const Pricedetails = ({ defaultAddress, cart, fetchCart }) => {

    const [deliveryMethod, setDeliveryMethod] = useState("");

    const [deliveryInfo, setDeliveryInfo] = useState({
        deliverable: true,
        deliveryCharge: 0,
    });


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


    useEffect(() => {
        if (defaultAddress?.pincode) {
            checkDelivery(defaultAddress.pincode);
        }
    }, [defaultAddress]);


    



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

    const checkout = async () => {

        if (deliveryMethod !== "pickup" && !defaultAddress) {
            toast.error("Please select address");
            return;
        }

        if (cart.items.length === 0 || totalAmount === 0 || totalProductValue === 0) {
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
            if (fetchCart) {
                fetchCart();
            }
        } catch (err) {
            console.log(err);
            console.log(err.response?.data?.message);

            toast.error("Checkout failed");
        }
    };
    const goToPaymentPage = () => {

        if (cart.items.length === 0 || totalAmount === 0 || totalProductValue === 0) {
            toast.error("🛒 Your cart is empty");
            return;
        }
    
        toast.loading("Redirecting to payment...", { id: "paymentToast" });
    
        setTimeout(() => {
            toast.dismiss("paymentToast");
    
            toast(
                "💳 Online payment coming soon!\nFor now please choose pickup from farmer house.",
                {
                    icon: "🚀",
                    duration: 4000,
                }
            );
        }, 800);
    };

    // return (
    //     <>

    //         {/* Price Summary */}
    //         <div className="bg-white p-6 rounded shadow h-fit">
    //             <h3 className="text-xl font-bold mb-4">
    //                 Price Details
    //             </h3>

    //             <div className="flex justify-between mb-2">
    //                 <span>Total</span>
    //                 <span>₹{totalProductValue}</span>
    //             </div>

    //             {deliveryMethod === "pickup" ? (
    //                 <div className="mb-2 text-green-600 font-semibold">
    //                     🚜 You are picking up from farmer house
    //                 </div>
    //             ) : deliveryInfo.deliverable ? (
    //                 <div className="flex justify-between mb-2">
    //                     <span>Delivery Charges</span>
    //                     <span>₹{deliveryCharges}</span>
    //                 </div>
    //             ) : (
    //                 <div className="text-red-600 font-semibold mb-2">
    //                     Not deliverable at this location
    //                 </div>
    //             )}



    //             <hr className="my-3" />

    //             <div className="flex justify-between font-bold text-lg">
    //                 <span>Amount</span>
    //                 <span>₹{totalAmount}</span>
    //             </div>


    //             <hr className="my-3" />

    //             <div className="flex flex-col gap-2">
    //                 <h4 className="text-md font-bold mb-4">
    //                     Select Delivery Method -
    //                 </h4>

    //                 <div className='hidden'>
    //                     <input
    //                         type="radio"
    //                         id="home"
    //                         name="delivery_method"
    //                         value="home"
    //                         checked={deliveryMethod === "home"}
    //                         onChange={(e) => setDeliveryMethod(e.target.value)}
    //                     />
    //                     <label htmlFor="home" className="ml-2">
    //                         Deliver at your address
    //                     </label>
    //                 </div>

    //                 <div>
    //                     <input
    //                         type="radio"
    //                         id="pickup"
    //                         name="delivery_method"
    //                         value="pickup"
    //                         checked={deliveryMethod === "pickup"}
    //                         onClick={() =>
    //                             setDeliveryMethod(
    //                                 deliveryMethod === "pickup" ? "" : "pickup"
    //                             )
    //                         }
    //                     />
    //                     <label htmlFor="pickup" className="ml-2">
    //                         Pickup from farmer house
    //                     </label>
    //                     {deliveryMethod === "pickup" && (
    //                         <div className="mt-3 text-sm bg-green-50 p-3 rounded text-green-700">
    //                             📍 You will collect the order directly from the farmer's house.
    //                             Delivery charges are not applicable.
    //                         </div>
    //                     )}
    //                 </div>
    //             </div>


    //             <button
    //                 onClick={deliveryMethod === "pickup" ? checkout : goToPaymentPage}
    //                 disabled={deliveryMethod === "home" && !deliveryInfo.deliverable}
    //                 className={`w-full mt-6 py-3 rounded font-semibold text-white
    //                     ${deliveryMethod === "home" && !deliveryInfo.deliverable
    //                         ? "bg-gray-400 cursor-not-allowed"
    //                         : deliveryMethod === "home"
    //                             ? "bg-orange-400"
    //                             : "bg-green-600"
    //                     }
                          
    //                     }`}
    //             >
    //                 {deliveryMethod === "pickup"
    //                     ? "Place Order"
    //                     : deliveryInfo.deliverable === true ? deliveryMethod === "null" ? "Select payment method" : " Move to Payment Page" : "Not deliverable at this location"}
    //             </button>


    //         </div>
    //     </>
    // );
    return (
        <>
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200
                          p-6 md:p-8 rounded-3xl shadow-lg h-fit 
                          transition-all duration-300">
      
            <h3 className="text-2xl font-extrabold mb-6 text-gray-800">
              Price Details
            </h3>
      
            {/* Product Total */}
            <div className="flex justify-between text-gray-600 mb-3">
              <span>Total</span>
              <span className="font-medium">₹{totalProductValue}</span>
            </div>
      
            {/* Delivery Section */}
            {deliveryMethod === "pickup" ? (
              <div className="mb-3 p-3 bg-green-50 rounded-xl text-green-700 text-sm font-medium">
                🚜 You are picking up from farmer house
              </div>
            ) : deliveryInfo.deliverable ? (
              <div className="flex justify-between text-gray-600 mb-3">
                <span>Delivery Charges</span>
                <span className="font-medium">₹{deliveryCharges}</span>
              </div>
            ) : (
              <div className="mb-3 p-3 bg-red-50 rounded-xl text-red-600 text-sm font-semibold">
                Not deliverable at this location
              </div>
            )}
      
            <hr className="my-5 border-gray-200" />
      
            {/* Final Amount */}
            <div className="flex justify-between font-bold text-xl text-gray-900">
              <span>Amount</span>
              <span>₹{totalAmount}</span>
            </div>
      
            <hr className="my-6 border-gray-200" />
      
            {/* Delivery Method */}
            <div>
              <h4 className="text-md font-semibold mb-4 text-gray-700">
                Select Delivery Method
              </h4>
      
              {/* Hidden Home Option (untouched logic) */}
              <div className="hidden">
                <input
                  type="radio"
                  id="home"
                  name="delivery_method"
                  value="home"
                  checked={deliveryMethod === "home"}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                />
                <label htmlFor="home">Deliver at your address</label>
              </div>
      
              {/* Pickup Styled Card */}
              <div
                className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300
                  ${
                    deliveryMethod === "pickup"
                      ? "border-green-600 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-400"
                  }`}
                onClick={() =>
                  setDeliveryMethod(
                    deliveryMethod === "pickup" ? "" : "pickup"
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    🚜 Pickup from farmer house
                  </span>
      
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${
                        deliveryMethod === "pickup"
                          ? "border-green-600"
                          : "border-gray-300"
                      }`}
                  >
                    {deliveryMethod === "pickup" && (
                      <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                    )}
                  </div>
                </div>
      
                {deliveryMethod === "pickup" && (
                  <div className="mt-3 text-sm text-green-700">
                    📍 You will collect the order directly from the farmer's house.
                    Delivery charges are not applicable.
                  </div>
                )}
              </div>
            </div>
      
            {/* CTA Button */}
            <button
              onClick={
                deliveryMethod === "pickup"
                  ? checkout
                  : goToPaymentPage
              }
              disabled={
                deliveryMethod === "home" && !deliveryInfo.deliverable
              }
              className={`w-full mt-8 py-3 rounded-2xl font-semibold text-white
                transition-all duration-300 shadow-lg
                ${
                  deliveryMethod === "home" && !deliveryInfo.deliverable
                    ? "bg-gray-400 cursor-not-allowed"
                    : deliveryMethod === "home"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-600 hover:bg-green-700 hover:scale-[1.02] active:scale-95"
                }`}
            >
              {deliveryMethod === "pickup"
                ? "🚀 Place Order"
                : deliveryInfo.deliverable === true
                ? deliveryMethod === "null"
                  ? "Select payment method"
                  : "Move to Payment Page"
                : "Not deliverable at this location"}
            </button>
          </div>
        </>
      );
}

export default Pricedetails
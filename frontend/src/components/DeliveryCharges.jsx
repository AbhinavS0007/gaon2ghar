import React from 'react'
import { useEffect, useState } from "react";
import api from "../api/axios";

const DeliveryCharges = () => {

    const [cart, setCart] = useState({ items: [] });
    const [addresses, setAddresses] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState(null);
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
    }, [defaultAddress]);

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
            // setLoading(false);
        }
    };


    // const updateQuantity = async (productId, quantity) => {
    //     setCart((prevCart) => ({
    //         ...prevCart,
    //         items: prevCart.items.map((item) =>
    //             item.product._id === productId
    //                 ? { ...item, quantity }
    //                 : item
    //         ),
    //     }));

    //     // Update backend silently
    //     try {
    //         await api.put("/cart/update", {
    //             productId,
    //             quantity,
    //         });
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };
    //     if (!defaultAddress) {
    //         toast.error("Please select address");
    //         return;
    //     }

    //     if (cart.items.length === 0) {
    //         toast.error("Please select Items");
    //         return;
    //     }


    //     try {
    //         await api.post("/cart/checkout", {
    //             address: defaultAddress,
    //             deliveryCharge: deliveryCharges,
    //         });

    //         toast.success("Order placed successfully");
    //         fetchCart();
    //     } catch (err) {
    //         console.log(err);
    //         console.log(err.response?.data?.message);

    //         toast.error("Checkout failed");
    //     }
    // };






    const totalProductValue = cart.items.reduce(
        (sum, item) =>
            sum + (item.product?.price || 0) * item.quantity,
        0
    );

    let deliveryCharges = 0;

    if (totalProductValue > 0) {
        deliveryCharges = deliveryInfo.deliverable
            ? deliveryInfo.deliveryCharge
            : 0;
    }
    return (
        <>
            
        </>
    )
}

export default DeliveryCharges
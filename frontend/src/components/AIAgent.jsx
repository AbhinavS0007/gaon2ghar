import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import Layout from "./Layout";
import AddressSection from "./AddressSection";

function AIAgent() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState(null);

    const fetchAddresses = async () => {
        try {
            const res = await api.get("/address");
            const data = res.data;

            // setAddresses(data);

            const defaultAddr = data.find((a) => a.isDefault);
            if (defaultAddr) {
                setDefaultAddress(defaultAddr);
                console.log(defaultAddr);
            }

        } catch (err) {
            console.error("Error loading addresses", err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Please type your order");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/ai/order", {
                message,
                defaultAddress
            });

            toast.success(res.data.message);
            setMessage("");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };


    
    return (
        <Layout>
            <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                    🤖 AI Order Assistant
                </h2>
                {/* <AddressSection /> */}


                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Type: order 20 kg wheat"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        {loading ? "Processing..." : "Place Order"}
                    </button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    Example: <span className="font-medium">order 20 kg wheat</span>
                </p>
            </div>
        </Layout>
    );
}

export default AIAgent;

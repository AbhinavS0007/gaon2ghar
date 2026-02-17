import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

function AIAgent() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");


  const handleSend = async () => {
    if (!message) return;

    try {
      setLoading(true);

    //   const res = await api.post("/ai/order", {
    //     message,
    //   });

    const res = await api.post("/ai/order", {
        message,
        address,
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
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-3">
            AI Order Assistant
          </h2>
      
          <div className="flex flex-col gap-3">
      
            {/* Order Message Input */}
            <input
              type="text"
              placeholder="Type: order 20 kg wheat"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border px-3 py-2 rounded"
            />
      
            {/* Address Input */}
            <input
              type="text"
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border px-3 py-2 rounded"
            />
      
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Processing..." : "Send"}
            </button>
      
          </div>
        </div>
      );
}

export default AIAgent;

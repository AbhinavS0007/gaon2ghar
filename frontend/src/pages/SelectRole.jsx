import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-hot-toast";

function SelectRole() {
  const navigate = useNavigate();

  const chooseRole = async (role) => {
    try {
      const userId = localStorage.getItem("tempUserId");

      const res = await api.post("/auth/set-role", {
        userId,
        role,
      });

      localStorage.removeItem("tempUserId");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(`/${role}`);
    } catch (err) {
      toast.error("Failed to set role");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Choose Your Role
        </h2>
        <p className="text-gray-500 mb-8">
          Please select how you want to use Gaon2Ghar
        </p>

        <div className="space-y-4">


          <button
            onClick={() => chooseRole("customer")}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-lg 
                       hover:bg-green-700 transition duration-300 
                       shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            🛒 Continue as Customer
          </button>


          <button
            onClick={() => chooseRole("farmer")}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg 
                       hover:bg-blue-700 transition duration-300 
                       shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            🌾 Continue as Farmer
          </button>

        </div>

      </div>
    </div>
  );
}

export default SelectRole;
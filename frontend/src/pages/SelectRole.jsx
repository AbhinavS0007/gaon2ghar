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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl mb-6">Select Your Role</h2>
      <div className="flex gap-4">
        <button onClick={() => chooseRole("customer")}>Customer</button>
        <button onClick={() => chooseRole("farmer")}>Farmer</button>
      </div>
    </div>
  );
}

export default SelectRole;
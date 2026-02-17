import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      const { token, user } = res.data;

      // store token
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      // redirect based on role
      if (user.role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      console.log(err.response?.data?.message);
      toast.error("Login Failed")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <form
    onSubmit={handleSubmit}
    className="bg-white p-6 rounded shadow-md w-80"
  >
    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

    <input
      name="phone"
      placeholder="Phone"
      onChange={handleChange}
      className="w-full border p-2 mb-3"
    />

    <input
      name="password"
      type="password"
      placeholder="Password"
      onChange={handleChange}
      className="w-full border p-2 mb-3"
    />

    <button
      type="submit"
      className="w-full bg-green-600 text-white p-2 rounded"
    >
      Login
    </button>

    <p className="text-center mt-3">
      <Link to="/register" className="text-green-600">
        Register
      </Link>
    </p>
  </form>
</div>

  );
}

export default Login;

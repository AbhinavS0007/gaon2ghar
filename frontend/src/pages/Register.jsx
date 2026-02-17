import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

function Register() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      toast.success("Registered successfully");
      navigate("/");
    } catch (err) {
      console.log(err.response?.data?.message);
      toast.error("Something went wrong")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register
        </h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="customer">Customer</option>
          <option value="farmer">Farmer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/" className="text-green-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

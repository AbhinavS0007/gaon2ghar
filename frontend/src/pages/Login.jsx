import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await api.post("/auth/login", form);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful 🎉");

      // Redirect based on role
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          name="email"
          type="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="password"
          value={form.password}
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Login
        </button>

        <GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      if (res.data.needsRole) {
        localStorage.setItem("tempUserId", res.data.tempUserId);
        navigate("/select-role");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(`/${res.data.user.role}`);
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Google login failed");
    }
  }}
  onError={() => toast.error("Google Login Failed")}
/>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
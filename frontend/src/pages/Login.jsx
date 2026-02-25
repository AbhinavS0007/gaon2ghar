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

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      setLoading(true);

      const res = await api.post("/auth/login", form);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful 🎉");

      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);

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
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-blue-200 px-4">
  <Toaster position="top-center" />

  <form
    onSubmit={handleSubmit}
    className="backdrop-blur-lg bg-white/70 border border-white/40 
               p-8 rounded-2xl shadow-2xl w-full max-w-md 
               transition-all duration-300 hover:shadow-green-200/50"
  >
    <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
      Welcome Back 👋
    </h2>
    <p className="text-center text-gray-500 mb-6 text-sm">
      Login to continue to Gaon2Ghar
    </p>

    {/* Email */}
    <input
      name="email"
      type="email"
      value={form.email}
      placeholder="Enter your email"
      onChange={handleChange}
      className="w-full border border-gray-300 p-3 mb-4 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-green-500 
                 transition"
    />

    {/* Password */}
    <input
      name="password"
      type="password"
      value={form.password}
      placeholder="Enter your password"
      onChange={handleChange}
      className="w-full border border-gray-300 p-3 mb-6 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-green-500 
                 transition"
    />

    {/* Login Button */}
    <button
      type="submit"
      disabled={loading}
      className={`w-full py-3 rounded-xl font-semibold text-white 
        transition-all duration-300 shadow-lg
        ${
          loading
            ? "bg-green-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 hover:scale-[1.02] hover:shadow-xl"
        }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Logging in...
        </span>
      ) : (
        "Login"
      )}
    </button>

    {/* Divider */}
    <div className="flex items-center my-6">
      <div className="flex-1 h-px bg-gray-300"></div>
      <span className="px-3 text-gray-400 text-sm">OR</span>
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>

    {/* Google Login */}
    <div className="flex justify-center">
      {googleLoading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
          Signing in...
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google Login Failed")}
        />
      )}
    </div>

    <p className="text-center mt-6 text-sm text-gray-600">
      Don’t have an account?{" "}
      <Link
        to="/register"
        className="text-green-600 font-semibold hover:underline"
      >
        Register
      </Link>
    </p>
  </form>
</div>
  );
}

export default Login;
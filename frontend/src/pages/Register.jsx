import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

function Register() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.role) {
      toast.error("All fields are required");
      return;
    }

    if (!form.email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register-send-otp", {
        email: form.email,
      });

      toast.success("OTP sent to your email 💌");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register-verify-otp", {
        ...form,
        otp,
      });

      toast.success("Registration successful 🎉");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-blue-200 px-4">
      <Toaster position="top-center" />

      <div className="backdrop-blur-lg bg-white/70 border border-white/40 
                      p-8 rounded-2xl shadow-2xl w-full max-w-md 
                      transition-all duration-300 hover:shadow-green-200/50">

        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          {step === 1 ? "Create Account 🚀" : "Verify OTP 🔐"}
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          {step === 1
            ? "Join Gaon2Ghar and start your journey"
            : "Enter the OTP sent to your email"}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <input
              name="name"
              value={form.name}
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 mb-4 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 mb-4 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              placeholder="Create Password"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 mb-4 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 mb-6 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="">Select Role</option>
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
            </select>

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
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border border-gray-300 p-3 mb-6 rounded-xl 
                         text-center text-xl tracking-widest
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white 
                transition-all duration-300 shadow-lg
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] hover:shadow-xl"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Verifying...
                </span>
              ) : (
                "Verify & Register"
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-4 text-sm text-gray-600 hover:underline"
            >
              Change Details
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
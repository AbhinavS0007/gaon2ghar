import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

function Register() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // STEP 1: SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.password || !form.role) {
      toast.error("All fields are required");
      return;
    }

    try {
      await api.post("/auth/register-send-otp", {
        phone: form.phone,
      });

      toast.success("OTP sent to your phone");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    }
  };

  // STEP 2: VERIFY OTP + REGISTER
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const res = await api.post("/auth/register-verify-otp", {
        ...form,
        otp,
      });

      toast.success("Registration successful");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(`/`);
    //   navigate(`/${form.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" />

      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === 1 ? "Register" : "Verify OTP"}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <input
              name="name"
              value={form.name}
              placeholder="Name"
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              name="phone"
              value={form.phone}
              placeholder="Phone"
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

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="">Select Role</option>
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border p-2 mb-4 rounded text-center text-lg tracking-widest"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Verify & Register
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-2 text-sm text-gray-500"
            >
              Change Details
            </button>
          </form>
        )}

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/" className="text-green-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

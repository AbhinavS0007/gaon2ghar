// components/AddAddressForm.jsx
import React, { useState } from "react";

export default function AddAddressForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    houseNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
    isDefault: true,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Add New Address
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="houseNumber"
            placeholder="House/Flat No."
            value={form.houseNumber}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <input
            name="street"
            placeholder="Street / Area"
            value={form.street}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <input
            name="landmark"
            placeholder="Landmark (optional)"
            value={form.landmark}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
        </div>

        {/* Address Type */}
        <div className="flex gap-4 mt-4">
          {["Home", "Work", "Other"].map((type) => (
            <label key={type} className="flex items-center gap-1">
              <input
                type="radio"
                name="addressType"
                value={type}
                checked={form.addressType === type}
                onChange={handleChange}
              />
              {type}
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(form)}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Save Address
          </button>

          <button
            onClick={onCancel}
            className="border px-5 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

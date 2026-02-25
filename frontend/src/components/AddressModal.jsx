// components/AddressModal.jsx
import React from "react";

export default function AddressModal({
  addresses,
  onSelect,
  onAddNew,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm 
                    flex justify-center items-center 
                    z-[9999] px-4">

      <div className="bg-white w-full max-w-lg 
                      rounded-3xl shadow-2xl 
                      p-6 md:p-8 
                      animate-fadeIn">

        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
          Select Delivery Address
        </h2>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">

          {addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => onSelect(addr)}
              className="border border-gray-200 
                         p-4 rounded-2xl 
                         cursor-pointer 
                         transition-all duration-300
                         hover:border-green-500 
                         hover:bg-green-50 
                         hover:shadow-md"
            >
              <p className="font-semibold text-gray-800">
                {addr.fullName}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {addr.houseNumber}, {addr.street},{" "}
                {addr.city} - {addr.pincode}
              </p>
            </div>
          ))}

        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">

          <button
            onClick={onAddNew}
            className="w-full py-3 rounded-2xl 
                       bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white font-semibold 
                       shadow-md hover:shadow-lg
                       transition-all duration-300
                       hover:scale-[1.02] active:scale-95"
          >
            + Add New Address
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl 
                       border border-gray-300 
                       text-gray-700 font-medium
                       hover:bg-gray-100 
                       transition-all duration-200"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}
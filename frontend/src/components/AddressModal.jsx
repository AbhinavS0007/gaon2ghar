// components/AddressModal.jsx
import React from "react";

export default function AddressModal({
  addresses,
  onSelect,
  onAddNew,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white w-[500px] p-4 rounded">
        <h2 className="text-lg font-semibold mb-3">
          Select Delivery Address
        </h2>

        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border p-3 mb-2 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => onSelect(addr)}
          >
            <p className="font-semibold">{addr.fullName}</p>
            <p className="text-sm">
              {addr.houseNumber}, {addr.street},{" "}
              {addr.city} - {addr.pincode}
            </p>
          </div>
        ))}

<button
  onClick={onAddNew}
  className="w-full mt-3 bg-blue-600 text-white py-2 rounded"
>
  + Add New Address
</button>



        <button
          onClick={onClose}
          className="w-full mt-2 border py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

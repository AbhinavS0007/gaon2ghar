export default function DeliverTo({ address, onChange }) {
    return (
      <div className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-sm">Deliver to:</p>
  
          {address ? (
            <p className="font-semibold">
              {address.fullName}, {address.houseNumber},{" "}
              {address.street}, {address.city} - {address.pincode}
            </p>
          ) : (
            <p className="text-gray-500">No address selected</p>
          )}
        </div>
  
        <button
          onClick={onChange}
          className="border px-4 py-1 text-blue-600 font-semibold rounded"
        >
          Change
        </button>
      </div>
    );
  }
  
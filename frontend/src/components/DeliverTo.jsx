export default function DeliverTo({ address, onChange }) {
    return (
      <div className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center">
        <div>
          <p className="text-gray-800 text-lg font-bold my-1">Your Selected address :</p>
  
          {address ? (
            <p className="font-semibold m-2">
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
  
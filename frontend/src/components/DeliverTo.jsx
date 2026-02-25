export default function DeliverTo({ address, onChange }) {
  return (
    <div
      className="bg-white/80 backdrop-blur-lg 
                 border border-gray-200
                 rounded-3xl shadow-md 
                 p-5 md:p-6 
                 flex flex-col md:flex-row 
                 md:justify-between md:items-center
                 gap-4 transition-all duration-300
                 hover:shadow-lg"
    >
      <div className="flex-1">

        <p className="text-gray-800 text-lg font-bold mb-2">
          📍 Delivery Address
        </p>

        {address ? (
          <p className="text-gray-700 font-medium leading-relaxed">
            {address.fullName}, {address.houseNumber},{" "}
            {address.street}, {address.city} - {address.pincode}
          </p>
        ) : (
          <p className="text-gray-400">
            No address selected
          </p>
        )}
      </div>

      <button
        onClick={onChange}
        className="px-5 py-2 rounded-2xl
                   bg-gradient-to-r from-green-600 to-green-700
                   text-white font-semibold
                   shadow-md hover:shadow-lg
                   transition-all duration-300
                   hover:scale-[1.03] active:scale-95"
      >
        Change
      </button>
    </div>
  );
}
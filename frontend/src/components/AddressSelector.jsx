
import { useEffect, useState } from "react";
import api from "../api/axios";
import DeliverTo from "../components/DeliverTo";
import AddressModal from "../components/AddressModal";
import AddAddressForm from "../components/AddAddressForm";

function AddressSelector({ defaultAddress, setDefaultAddress }) {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [addressView, setAddressView] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address");
      const data = res.data;

      setAddresses(data);

      const defaultAddr = data.find((a) => a.isDefault);
      if (defaultAddr) {
        setDefaultAddress(defaultAddr);
      }
    } catch (err) {
      console.error("Error loading addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if(loading){
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-green-500 border-r-yellow-400 animate-spin"></div>
        </div>
      );
}

  return (
    <div className="max-w-4xl my-8">

      {/* Main Address Card */}
      <div className="bg-white/80 backdrop-blur-lg 
                      rounded-3xl shadow-lg 
                      border border-gray-200 
                      p-6 transition-all duration-300 
                      hover:shadow-xl">

        <DeliverTo
          address={defaultAddress}
          onChange={() => setAddressView("list")}
        />
      </div>

      {/* Address List Modal */}
      {addressView === "list" && (
        <AddressModal
          addresses={addresses}
          onSelect={async (addr) => {
            try {
              setDefaultAddress(addr);
              await api.put(`/address/default/${addr._id}`);
              await fetchAddresses();
              setAddressView(null);
            } catch (err) {
              console.error("Failed to set default address", err);
            }
          }}
          onAddNew={() => setAddressView("form")}
          onClose={() => setAddressView(null)}
        />
      )}

      {/* Add Address Form */}
      {addressView === "form" && (
        <AddAddressForm
          onSave={async (data) => {
            try {
              await api.post("/address", data);
              await fetchAddresses();
              setAddressView(null);
            } catch (err) {
              console.error("Address save failed", err);
            }
          }}
          onCancel={() => setAddressView("list")}
        />
      )}
    </div>
  );
}

export default AddressSelector;
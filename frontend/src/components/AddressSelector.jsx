// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import DeliverTo from "../components/DeliverTo";
// import AddressModal from "../components/AddressModal";
// import AddAddressForm from "../components/AddAddressForm";


// function AddressSelector({ defaultAddress, setDefaultAddress }) {
//     const [loading, setLoading] = useState(true);
//     const [addresses, setAddresses] = useState([]);
//     // const [defaultAddress, setDefaultAddress] = useState(null);
//     const [addressView, setAddressView] = useState(null);


//     const fetchAddresses = async () => {
//         try {
//             const res = await api.get("/address");
//             const data = res.data;

//             setAddresses(data);

//             const defaultAddr = data.find((a) => a.isDefault);
//             if (defaultAddr) {
//                 setDefaultAddress(defaultAddr);
//             }
//         } catch (err) {
//             console.error("Error loading addresses", err);
//         }
//         finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAddresses();
//     }, []);

//     if (loading) {
//         return <div className="p-6 text-center">Loading adress...</div>;
//     }

//     return (

//         <div className="max-w-4xl my-6 mx-">

//             <div className=" rounded-2xl shadow-lg border border-gray-100 p-4 transition-all duration-300 hover:shadow-xl">

//                 <div className="space-y-4">
//                     <DeliverTo
//                         address={defaultAddress}
//                         onChange={() => setAddressView("list")}
//                     />
//                 </div>


//             </div>


//             {addressView === "list" && (
//                 <AddressModal
//                     addresses={addresses}
//                     onSelect={async (addr) => {
//                         try {
//                             setDefaultAddress(addr);
//                             await api.put(`/address/default/${addr._id}`);
//                             await fetchAddresses();
//                             setAddressView(null);
//                         } catch (err) {
//                             console.error("Failed to set default address", err);
//                         }
//                     }}
//                     onAddNew={() => setAddressView("form")}
//                     onClose={() => setAddressView(null)}
//                 />
//             )}

//             {addressView === "form" && (
//                 <AddAddressForm
//                     onSave={async (data) => {
//                         try {
//                             await api.post("/address", data);
//                             await fetchAddresses();
//                             setAddressView(null);
//                         } catch (err) {
//                             console.error("Address save failed", err);
//                         }
//                     }}
//                     onCancel={() => setAddressView("list")}
//                 />
//             )}
//         </div>

//     );
// }

// export default AddressSelector;


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

  if (loading) {
    return (
      <div className="my-6 bg-white/70 backdrop-blur-md 
                      border border-gray-200 
                      rounded-3xl shadow-md 
                      p-6 text-center text-gray-500">
        Loading address...
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
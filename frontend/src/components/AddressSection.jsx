// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import DeliverTo from "./DeliverTo";
// import AddressModal from "./AddressModal";
// import AddAddressForm from "./AddAddressForm";

// function AddressSection({ onAddressChange }) {
//   const [addresses, setAddresses] = useState([]);
//   const [defaultAddress, setDefaultAddress] = useState(null);
//   const [addressView, setAddressView] = useState(null);

//   const [deliveryInfo, setDeliveryInfo] = useState({
//     deliverable: true,
//     deliveryCharge: 0,
//   });

//   const fetchAddresses = async () => {
//     try {
//       const res = await api.put(`/address/default/${addr._id}`);

//       const data = res.data;

//       setAddresses(data);

//       const defaultAddr = data.find((a) => a.isDefault);
//       setDefaultAddress(defaultAddr || null);
//     } catch (err) {
//       console.error("Error loading addresses", err);
//     }
//   };

//   const checkDelivery = async (pincode, addr) => {
//     try {
//       const res = await api.get(`/delivery-zones/${pincode}`);
//       setDeliveryInfo(res.data);

//       if (onAddressChange) {
//         onAddressChange(addr, res.data);
//       }
//     } catch (err) {
//       const fallback = {
//         deliverable: false,
//         deliveryCharge: 0,
//       };

//       setDeliveryInfo(fallback);

//       if (onAddressChange) {
//         onAddressChange(addr, fallback);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchAddresses();
//   }, []);

//   useEffect(() => {
//     if (defaultAddress?.pincode) {
//       checkDelivery(defaultAddress.pincode, defaultAddress);
//     }
//   }, [defaultAddress]);

//   return (
//     <>
//       <DeliverTo
//         address={defaultAddress}
//         onChange={() => setAddressView("list")}
//       />

//       {addressView === "list" && (
//         <AddressModal
//           addresses={addresses}
//           onSelect={async (addr) => {
//             try {
//               // update backend FIRST
//               await api.put(`/address/default/${addr._id}`);

//               // then reload fresh from DB
//               await fetchAddresses();

//               setAddressView(null);
//             } catch (err) {
//               console.error("Failed to set default address", err);
//             }
//           }}
//           onAddNew={() => setAddressView("form")}
//           onClose={() => setAddressView(null)}
//         />
//       )}

//       {addressView === "form" && (
//         <AddAddressForm
//           onSave={async (data) => {
//             try {
//               await api.post("/address", data);
//               await fetchAddresses();
//               setAddressView(null);
//             } catch (err) {
//               console.error("Address save failed", err);
//             }
//           }}
//           onCancel={() => setAddressView("list")}
//         />
//       )}
//     </>
//   );
// }

// export default AddressSection;

import { useEffect, useState } from "react";
import api from "../api/axios";
import DeliverTo from "./DeliverTo";
import AddressModal from "./AddressModal";
import AddAddressForm from "./AddAddressForm";

function AddressSection({ onAddressChange }) {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [addressView, setAddressView] = useState(null);

  const [deliveryInfo, setDeliveryInfo] = useState({
    deliverable: true,
    deliveryCharge: 0,
  });

  // ✅ Corrected Fetch
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address"); // FIXED

      const data = res.data;

      setAddresses(data);

      const defaultAddr = data.find((a) => a.isDefault);
      setDefaultAddress(defaultAddr || null);
    } catch (err) {
      console.error("Error loading addresses", err);
    }
  };

  const checkDelivery = async (pincode, addr) => {
    try {
      const res = await api.get(`/delivery-zones/${pincode}`);
      setDeliveryInfo(res.data);

      if (onAddressChange) {
        onAddressChange(addr, res.data);
      }
    } catch (err) {
      const fallback = {
        deliverable: false,
        deliveryCharge: 0,
      };

      setDeliveryInfo(fallback);

      if (onAddressChange) {
        onAddressChange(addr, fallback);
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (defaultAddress?.pincode) {
      checkDelivery(defaultAddress.pincode, defaultAddress);
    }
  }, [defaultAddress]);

  return (
    <>
      <DeliverTo
        address={defaultAddress}
        onChange={() => setAddressView("list")}
      />

      {addressView === "list" && (
        <AddressModal
          addresses={addresses}
          onSelect={async (addr) => {
            try {
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
    </>
  );
}

export default AddressSection;

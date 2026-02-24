import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import FarmerOrders from "./pages/FarmerOrders";
import AIAgent from "./components/AIAgent";
import SelectRole from "./pages/SelectRole";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders/my" element={<Orders />} />
        <Route path="/farmer-orders" element={<FarmerOrders />} />
        <Route path="/ai" element={<AIAgent />} />
        <Route path="/select-role" element={<SelectRole />} />




      </Routes>
    </BrowserRouter>
  );
}

export default App;

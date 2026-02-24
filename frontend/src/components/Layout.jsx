import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Layout({ children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* HEADER */}
      <header className="bg-green-600 text-white px-4 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-bold">🌾 Gaon2Ghar</h1>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          {role === "customer" && (
            <>
              <Link to="/customer">Dashboard</Link>
              <Link to="/orders/my">My Orders</Link>
              <Link to="/cart">Cart</Link>
              <Link
                to="/ai"
                className="bg-white text-green-600 px-3 py-1 rounded-lg"
              >
                🤖 AI
              </Link>
            </>
          )}

          {role === "farmer" && (
            <>
              <Link to="/farmer">Dashboard</Link>
              <Link to="/farmer-orders">Orders</Link>
            </>
          )}

          <button
            onClick={logout}
            className="bg-white text-green-600 px-3 py-1 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-6 space-y-5 text-gray-800 font-medium">
          
          {role === "customer" && (
            <>
              <Link
                to="/customer"
                className="block text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/orders/my"
                className="block text-lg"
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </Link>

              <Link
                to="/cart"
                className="block text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Cart
              </Link>

              <Link
                to="/ai"
                className="block text-lg text-green-600"
                onClick={() => setMenuOpen(false)}
              >
                🤖 AI Agent
              </Link>
            </>
          )}

          {role === "farmer" && (
            <>
              <Link
                to="/farmer"
                className="block text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/farmer-orders"
                className="block text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Orders
              </Link>
            </>
          )}

          <button
            onClick={logout}
            className="block text-lg text-red-500"
          >
            Logout
          </button>
        </div>
      )}

      {/* CONTENT */}
      <main className="p-4 md:p-8">{children}</main>

      {/* Floating AI Button Only Mobile */}
      {role === "customer" && (
        <Link
          to="/ai"
          className="md:hidden fixed bottom-6 right-6 bg-green-600 text-white 
                     w-14 h-14 flex items-center justify-center
                     rounded-full shadow-xl 
                     hover:bg-green-700 transition"
        >
          🤖
        </Link>
      )}
    </div>
  );
}

export default Layout;
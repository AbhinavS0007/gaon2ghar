import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navLinkStyle = (path) =>
    location.pathname === path
      ? "text-green-600 font-semibold"
      : "hover:text-green-600 transition";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md 
                         border-b border-gray-200 shadow-sm">

        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">

          {/* Logo */}
          <h1
            onClick={() => navigate("/")}
            className="text-xl md:text-2xl font-extrabold 
                       text-green-600 cursor-pointer"
          >
            🌾 Gaon2Ghar
          </h1>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">

            {role === "customer" && (
              <>
                <Link to="/customer" className={navLinkStyle("/customer")}>
                  Dashboard
                </Link>
                <Link to="/orders/my" className={navLinkStyle("/orders/my")}>
                  My Orders
                </Link>
                <Link to="/cart" className={navLinkStyle("/cart")}>
                  Cart
                </Link>
                <Link
                  to="/ai"
                  className="bg-green-600 text-white px-4 py-2 rounded-xl 
                             shadow hover:bg-green-700 transition"
                >
                  🤖 AI Agent
                </Link>
              </>
            )}

            {role === "farmer" && (
              <>
                <Link to="/farmer" className={navLinkStyle("/farmer")}>
                  Dashboard
                </Link>
                <Link to="/farmer-orders" className={navLinkStyle("/farmer-orders")}>
                  Orders
                </Link>
              </>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-red-500 
                         text-red-500 hover:bg-red-500 hover:text-white 
                         transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-3xl text-green-600"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl 
                      p-6 transform transition-transform duration-300
                      ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-400 text-xl mb-6"
          >
            ✕
          </button>

          <div className="flex flex-col gap-6 text-lg font-medium text-gray-700">

            {role === "customer" && (
              <>
                <Link to="/customer" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/orders/my" onClick={() => setMenuOpen(false)}>
                  My Orders
                </Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)}>
                  Cart
                </Link>
                <Link
                  to="/ai"
                  onClick={() => setMenuOpen(false)}
                  className="text-green-600 font-semibold"
                >
                  🤖 AI Agent
                </Link>
              </>
            )}

            {role === "farmer" && (
              <>
                <Link to="/farmer" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/farmer-orders" onClick={() => setMenuOpen(false)}>
                  Orders
                </Link>
              </>
            )}

            <button
              onClick={logout}
              className="text-red-500 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {children}
      </main>

      {/* Floating AI Button (Mobile Only) */}
      {role === "customer" && (
        <Link
          to="/ai"
          className="md:hidden fixed bottom-6 right-6 bg-green-600 text-white 
                     w-14 h-14 flex items-center justify-center
                     rounded-full shadow-xl hover:bg-green-700 
                     active:scale-95 transition"
        >
          🤖
        </Link>
      )}
    </div>
  );
}

export default Layout;
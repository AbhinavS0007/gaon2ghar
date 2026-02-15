import { Link, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Farmer Marketplace</h1>

        <div className="space-x-4">
          {role === "farmer" && (
            <Link to="/farmer" className="hover:underline">
              Dashboard
            </Link>
          )}
          {role === "customer" && (
            <Link to="/customer" className="hover:underline">
              Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="bg-white text-green-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}

export default Layout;

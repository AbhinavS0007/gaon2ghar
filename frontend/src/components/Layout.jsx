import { Link, useNavigate } from "react-router-dom";


function Layout({ children }) {
    const navigate = useNavigate();
    // const role = localStorage.getItem("role");
    
    const role = JSON.parse(localStorage.getItem("user")).role;
    // console.log(user.role);

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

                    {role === "customer" && (
                        <Link
                            to="/ai"
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                        >
                            🤖 AI Agent
                        </Link>
                    )}



                    {role === "customer" && (
                        <Link to="/orders/my" className="hover:underline">
                            My Orders
                        </Link>
                    )}

                    {role === "farmer" && (
                        <Link to="/farmer-orders" className="hover:underline">
                            Orders
                        </Link>
                    )}

                    {role === "customer" && (
                        <Link to="/cart" className="hover:underline">
                            Cart
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
            {role === "customer" && (
                <Link
                    to="/ai"
                    className="fixed bottom-8 right-8 bg-green-600 text-white 
           px-5 py-3 rounded-full shadow-2xl 
           hover:scale-105 hover:bg-green-700 
           transition-all duration-300 
           z-[9999]"

                >
                    <span className="animate-pulse">🤖</span>
                    AI Agent
                </Link>

            )}
        </div>
    );
}

export default Layout;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster, toast } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1037752143252-v7fk2i067pdt60qdv3855a1n5riekk9b.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>
    <Toaster position="top-center" />
  </React.StrictMode>
);

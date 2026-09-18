import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-surface-50 font-sans antialiased selection:bg-primary-500 selection:text-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1612",
            color: "#fff",
            border: "1px solid #382e25",
          },
        }}
      />
    </div>
  );
}

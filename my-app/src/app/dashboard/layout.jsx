"use client";

import { ToastContainer } from "react-toastify";
import Navbar from "../component/Navbar";
import Sidebar from "../component/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-transparent flex-col h-screen">
      <header>
        <Navbar />
      </header>
      <div className="flex flex-1 relative">
        {/* Fixed width sidebar */}
        <aside className="hidden w-[305px] xl:block bg-transparent flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main content area with proper spacing */}
        <main className="flex-1 bg-transparent mt-[80px] overflow-x-hidden">
          <div className="container mx-auto max-w-full">
            {children}
            <ToastContainer />
          </div>
        </main>
      </div>
    </div>
  );
}

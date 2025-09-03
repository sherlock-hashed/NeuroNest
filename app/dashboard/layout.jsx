"use client";
import React, { useState } from "react";
import Sidebar from "./_components/Sidebar";
import DashboardHeader from "./_components/DashboardHeader";
import CourseCountContext from "@/app/_context/CourseCountContext";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [totalCourse, setTotalCourse] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <CourseCountContext.Provider value={{ totalCourse, setTotalCourse }}>
      <div className="bg-white text-black min-h-screen flex">
        {/* Mobile sidebar overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 md:hidden ${
            isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 transform bg-white border-r z-30 transition-transform duration-300 w-64 md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onLinkClick={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden bg-white">
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </CourseCountContext.Provider>
  );
};

export default DashboardLayout;
// app/dashboard/_components/DashboardHeader.jsx
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { Menu } from "lucide-react";

const DashboardHeader = ({ onMenuClick }) => {
  return (
    <header className="p-4 border-b flex justify-between md:justify-end items-center bg-white sticky top-0 z-10 shadow-sm">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 text-black rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
};

export default DashboardHeader;
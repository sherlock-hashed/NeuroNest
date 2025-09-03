"use client";

import React from "react";
import { PricingTable } from "@clerk/nextjs";

const Upgrade = () => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Hero Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black mb-4 leading-tight">
            Upgrade to <span className="text-primary">NeuroNest Pro</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto px-2">
            Get unlimited courses and enjoy faster AI processing with{" "}
            <span className="font-semibold">NeuroNest Pro</span>.
          </p>
        </div>
      </div>

      {/* Pricing Table Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 lg:p-8 shadow-lg rounded-2xl">
          <PricingTable
            appearance={{
              elements: {
                card: "rounded-xl border shadow-sm",
                rootBox: "flex flex-col sm:flex-row gap-6 justify-center",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Upgrade;

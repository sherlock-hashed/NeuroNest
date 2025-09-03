// app/course/layout.jsx
import React from "react";
import DashboardHeader from "../dashboard/_components/DashboardHeader";

const CourseViewLayout = ({ children }) => {
  return (
    <main className="bg-white text-black min-h-screen">
      <DashboardHeader />
      <section className="max-w-5xl mx-auto px-6 sm:px-8 md:px-20 py-10">
        {children}
      </section>
    </main>
  );
};

export default CourseViewLayout;
// app/dashboard/page.jsx
import React from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import CourseList from "./_components/CourseList";

const Dashboard = () => {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <WelcomeBanner />
      <CourseList />
    </div>
  );
};

export default Dashboard;
// app/dashboard/_components/WelcomeBanner.jsx
"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const WelcomeBanner = () => {
  const { user } = useUser();
  return (
    <div className="p-6 bg-gray-100 text-black rounded-lg flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
      <Image src="/video-lesson.png" alt="Learning" width={100} height={100} />
      <div>
        <h2 className="text-2xl font-bold">Hey, {user?.fullName} 👋</h2>
        <p className="text-sm text-gray-700 mt-1">
          Welcome back! Let’s get started on your courses.
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Shield, Plus } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import CourseCountContext from "@/app/_context/CourseCountContext";
import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const Sidebar = ({ onLinkClick }) => {
  const path = usePathname();
  const { totalCourse = 0, setTotalCourse } = useContext(CourseCountContext) || {};
  const { isSignedIn } = useUser();
  const [userDetail, setUserDetail] = useState({ isMember: false, totalCourses: 0 });

  useEffect(() => {
    if (!isSignedIn) return;

    (async () => {
      try {
        const res = await axios.get("/api/user-info");
        setUserDetail(res.data);
        setTotalCourse(res.data.totalCourses);
      } catch (err) {
        console.error("Error fetching user info", err);
      }
    })();
  }, [isSignedIn, setTotalCourse]);

  const MenuList = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Upgrade", icon: Shield, path: "/dashboard/upgrade" },
  ];

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className="h-screen flex flex-col p-6 bg-white text-black shadow-lg md:shadow-none">
      <div className="flex items-center gap-2 mb-10">
        <Image src="/logo4.svg" alt="logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">NeuroNest</h1>
      </div>

      <div className="overflow-y-auto flex-1">
        <Link href="/create" onClick={handleLinkClick}>
          <Button
            className="w-full mb-6 text-white bg-black"
            disabled={!userDetail.isMember && totalCourse >= 7}
          >
            <Plus className="w-4 h-4 mr-2 stroke-white" /> 
            <span className="text-white">
              {userDetail.isMember
                ? "Create New"
                : totalCourse >= 7
                ? "Limit Reached"
                : "Create New"}
            </span>
          </Button>
        </Link>
        <nav className="space-y-2">
          {MenuList.map((item, idx) => {
            const isActive = path === item.path;
            return (
              <Link href={item.path} key={idx} onClick={handleLinkClick}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                    isActive ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sticky Course Info */}
      <div className="w-full mt-10 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
        {userDetail.isMember ? (
          <div className="border bg-green-100 p-4 rounded-md">
            <p className="text-sm font-semibold text-green-800">Pro Member: Unlimited Courses</p>
          </div>
        ) : (
          <div className="border bg-gray-100 p-4 rounded-md">
            <p className="text-sm mb-1">Remaining courses: {7 - totalCourse}</p>
            <Progress value={(totalCourse / 7) * 100} />
            <p className="text-xs mt-1">{totalCourse} of 7 used</p>
            <Link href="/dashboard/upgrade">
              <span className="text-xs text-black-600 mt-2 inline-block hover:underline">Upgrade Plan</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
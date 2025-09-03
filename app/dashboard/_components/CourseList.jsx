// app/dashboard/_components/CourseList.jsx
"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import CourseCountContext from "@/app/_context/CourseCountContext";

const shimmerArray = Array.from({ length: 6 });

const CourseList = () => {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

  const { totalCourse, setTotalCourse } = useContext(CourseCountContext) || {};

  const GetCourseList = async (isAuto = false) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    isAuto ? setIsAutoRefreshing(true) : setLoading(true);

    try {
      const result = await axios.post("/api/courses", {
        createdBy: user.primaryEmailAddress.emailAddress,
      });

      const parsedCourses = result.data.result.map((course) => ({
        ...course,
        courseLayout:
          typeof course.courseLayout === "string"
            ? JSON.parse(course.courseLayout)
            : course.courseLayout,
      }));

      setCourseList(parsedCourses);
      setLastUpdated(new Date().toLocaleTimeString());
      setTotalCourse?.(parsedCourses.length);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
      setIsAutoRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      GetCourseList();

      const interval = setInterval(() => {
        GetCourseList(true);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <section className="mt-10 text-black transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold">📚 Your Study Material</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated at:{" "}
              <span className="font-medium text-black">{lastUpdated}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAutoRefreshing && (
            <span className="text-xs text-blue-600 animate-pulse">
              Auto-refreshing...
            </span>
          )}
          <Button
            variant="outline"
            onClick={() => GetCourseList(false)}
            className="flex items-center gap-2 border-black text-black hover:bg-gray-100"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {!loading && courseList.length > 0 ? (
          courseList.map((course, index) => (
            <CourseCardItem course={course} key={index} />
          ))
        ) : loading ? (
          shimmerArray.map((_, index) => (
            <div
              key={index}
              className="h-56 w-full bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 mt-10">
            No courses available. Create a new one to get started!
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseList;
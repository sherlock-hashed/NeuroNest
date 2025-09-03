// app/course/[courseId]/_components/CourseIntroCard.jsx
"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

const CourseIntroCard = ({ course }) => {
  const [showMore, setShowMore] = useState(false);
  const overview = course?.courseLayout?.overview || "";
  const shortOverview = overview.length > 200 ? overview.slice(0, 200) + "..." : overview;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start p-6 border border-gray-200 rounded-xl shadow-sm bg-white">
      <Image src={'/knowledge.png'} alt='Course Icon' width={70} height={70} />
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{course?.courseLayout?.course_title}</h2>
        <p className="text-sm sm:text-base text-[#555] leading-relaxed">
          {showMore ? overview : shortOverview}
        </p>
        {overview.length > 200 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-fit p-0 text-sm text-black hover:underline"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Collapse Overview" : "Expand Overview"}{" "}
            {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        )}
        <Progress value={course?.progress || 0} className="h-2 bg-gray-200">
          <div className="bg-black h-2 w-full" />
        </Progress>
        <h3 className="text-sm sm:text-base text-[#555]">
          📘 <span className="font-medium">Chapters in this Course:</span>{" "}
          {course?.courseLayout?.sections?.length || 0}
        </h3>
      </div>
    </div>
  );
};

export default CourseIntroCard;
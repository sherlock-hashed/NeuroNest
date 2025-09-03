// app/course/[courseId]/page.jsx
'use client';

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";

const Course = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  const GetCourse = async () => {
    try {
      const result = await axios.get(`/api/courses?courseId=${courseId}`);
      setCourse(result.data.result);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  useEffect(() => {
    if (courseId) GetCourse();
  }, [courseId]);

  return (
    <div className="space-y-10">
      <CourseIntroCard course={course} />
      <StudyMaterialSection courseId={courseId} course={course} refreshCourse={GetCourse} />
      <ChapterList course={course} />
    </div>
  );
};

export default Course;
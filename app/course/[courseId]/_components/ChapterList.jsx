// app/course/[courseId]/_components/ChapterList.jsx
import React from "react";

const ChapterList = ({ course }) => {
  const CHAPTERS = course?.courseLayout?.sections;

  return (
    <div className="mt-5">
      <h2 className="font-medium text-xl sm:text-2xl">Chapters</h2>
      <div className="mt-3">
        {CHAPTERS?.map((chapter, index) => (
          <div
            key={chapter?.id ?? chapter?.title ?? index}
            className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-start sm:items-center p-4 border shadow-md mb-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          >
            <h2 className="font-medium text-sm sm:text-base">{chapter?.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;
// app/dashboard/_components/CourseCardItem.jsx
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CourseCardItem = ({ course }) => {
  return (
    <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start">
        <Image src="/knowledge.png" alt="Course" width={40} height={40} className="flex-shrink-0" />
      </div>

      <h3 className="text-lg font-semibold mt-3 line-clamp-2">
        {course?.courseLayout?.course_title}
      </h3>

      <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-grow">
        {course?.courseLayout?.overview}
      </p>

      <div className="mt-4">
        <Progress value={0} />
      </div>

      <div className="mt-4 text-right">
        {course?.status === "Generating" ? (
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <span>Generating...</span>
            <RefreshCw className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <Link href={`/course/${course?.courseId}`}>
            <Button>View</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCardItem;
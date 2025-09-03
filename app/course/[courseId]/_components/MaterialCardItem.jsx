// app/course/[courseId]/_components/MaterialCardItem.jsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";

const MaterialCardItem = ({ item, studyTypeContent, course, refreshData, refreshCourse }) => {
  const [loading, setLoading] = useState(false);
  const courseId = course?.courseId;

  const isContentGenerated = (() => {
    const data = studyTypeContent?.[item.type];
    if (!data) return false;
    if (item.type === "notes") return Array.isArray(data) && data.length > 0;
    if (item.type === "flashcard") return Array.isArray(data.content) && data.content.length > 0;
    if (item.type === "quiz") return Array.isArray(data.content?.questions) && data.content.questions.length > 0;
    if (item.type === "qna") return Array.isArray(data.content?.sections) && data.content.sections.length > 0;
    return false;
  })();

  // Poll to check if content is ready
  const pollForContentReady = async (maxTries = 10, delay = 3000) => {
    for (let i = 0; i < maxTries; i++) {
      const result = await axios.post("/api/study-type", {
        courseId,
        studyType: "ALL",
      });

      const updated = result.data?.[item.type];

      const ready = (() => {
        if (!updated) return false;

        if (item.type === "notes") {
          return Array.isArray(updated) && updated.length > 0;
        }

        if (item.type === "flashcard") {
          return Array.isArray(updated.content) && updated.content.length > 0;
        }

        if (item.type === "quiz") {
          return (
            Array.isArray(updated.content?.questions) &&
            updated.content.questions.length > 0
          );
        }

        if (item.type === "qna") {
          return (
            Array.isArray(updated.content?.sections) &&
            updated.content.sections.length > 0
          );
        }

        return false;
      })();

      if (ready) return true;

      await new Promise((res) => setTimeout(res, delay));
    }

    return false;
  };

  const GenerateContent = async () => {
    toast.loading("⏳ Generating content...");
    setLoading(true);

    const mapType = {
      notes: "Notes",
      flashcard: "Flashcard",
      quiz: "Quiz",
      qna: "QnA",
    };

    try {
      // Make only one API call for generation (fix double call issue)
      await axios.post("/api/study-type-content", {
        courseId,
        type: mapType[item.type] || item.type,
        sections: course?.courseLayout?.sections || [],
      });

      toast.info("Waiting for content to be ready...");
      const success = await pollForContentReady();
      if (success) {
        await refreshData();
        await refreshCourse();
        toast.success(`${item.name} is now available! 🎉`);
      } else {
        toast.error("Content generation timed out.");
      }
    } catch (error) {
      toast.error("Failed to generate content.");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center hover:shadow-md transition-all duration-200 ease-in-out space-y-2">
      <span
        className={`text-[11px] font-medium px-3 py-1 rounded-full ${
          isContentGenerated ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
        }`}
      >
        {isContentGenerated ? "✅ Available" : "⚙️ Content Not Ready"}
      </span>

      <Image
        src={item.icon}
        alt={item.name}
        width={40}
        height={40}
        className={`transition-opacity ${!isContentGenerated ? "opacity-70" : "opacity-100"}`}
      />

      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-sm text-gray-500">{item.desc}</p>

      {isContentGenerated ? (
        <Link href={`/course/${courseId}${item.path}`} className="w-full">
          <Button className="w-full" variant="outline">Open</Button>
        </Link>
      ) : (
        <Button
          className="w-full"
          variant="outline"
          disabled={loading}
          onClick={GenerateContent}
        >
          {loading && <RefreshCw className="animate-spin mr-2 h-4 w-4" />}
          Generate Now
        </Button>
      )}
    </div>
  );
};

export default MaterialCardItem;
// app/course/[courseId]/_components/StudyMaterialSection.jsx
import React, { useEffect, useState } from "react";
import MaterialCardItem from "./MaterialCardItem";
import axios from "axios";

const StudyMaterialSection = ({ courseId, course, refreshCourse }) => {
  const [studyTypeContent, setStudyTypeContent] = useState({});

  const MaterialList = [
    { name: "Notes/Chapters", desc: "Your summarized course content", icon: "/notes.png", path: "/notes", type: "notes" },
    { name: "Flashcard", desc: "Key terms and concepts", icon: "/flashcard.png", path: "/flashcards", type: "flashcard" },
    { name: "Quiz", desc: "Test your understanding", icon: "/quiz.png", path: "/quiz", type: "quiz" },
    { name: "QnA", desc: "Practice with questions and answers", icon: "/qa.png", path: "/qa", type: "qna" },
  ];

  const GetStudyMaterial = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId,
        studyType: "ALL",
      });
      setStudyTypeContent(result.data);
    } catch (err) {
      console.error("Failed to fetch study type content", err);
    }
  };

  useEffect(() => {
    if (courseId) GetStudyMaterial();
  }, [courseId]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold">🧠 Your Study Tools</h2>
        <p className="text-sm text-[#6b7280]">All learning tools tailored to your course.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MaterialList.map((item) => (
          <MaterialCardItem
            key={item.type}
            item={item}
            studyTypeContent={studyTypeContent}
            course={course}
            refreshData={GetStudyMaterial}
            refreshCourse={refreshCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default StudyMaterialSection;
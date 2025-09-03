// app/course/[courseId]/flashcards/_components/CompletionCard.jsx
import React from "react";

const CompletionCard = () => {
  return (
    <div className="p-4 sm:p-6 bg-black text-white rounded-2xl shadow-xl h-[250px] w-[200px] sm:h-[300px] sm:w-[250px] md:h-[380px] md:w-[300px] flex flex-col items-center justify-center text-center border border-gray-700 animate-fade-in">
      <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🎉</div>
      <h2 className="text-lg sm:text-2xl font-bold mb-2">You’ve completed all flashcards!</h2>
      <p className="text-xs sm:text-base text-gray-400">Great job — keep up the fantastic work! 💪</p>
    </div>
  );
};

export default CompletionCard;
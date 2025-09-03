// app/course/[courseId]/quiz/_components/QuizCardItem.jsx
'use client';

import React from "react";

const QuizCardItem = ({ quiz, userSelectedOption, selectedOption }) => {
  if (!quiz || !quiz.options) return null;

  return (
    <div className="mt-6 p-4 border rounded shadow-sm bg-white">
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 text-xs sm:text-sm">
        <span className="text-gray-500 mb-2 sm:mb-0">
          <strong>Topic:</strong> {quiz.topic}
        </span>
        <span className="text-gray-500">
          <strong>Difficulty:</strong> {quiz.level || quiz.difficulty}
        </span>
      </div>

      <h2 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6 text-center">{quiz.question}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {Object.entries(quiz.options).map(([key, value]) => {
          const isSelected = selectedOption === key;

          return (
            <div
              key={key}
              onClick={() => {
                if (selectedOption == null) {
                  userSelectedOption(key);
                }
              }}
              className={`cursor-pointer border rounded-full px-4 py-2 sm:px-4 sm:py-3 text-center text-sm sm:text-base transition 
              ${
                isSelected
                  ? "bg-black text-white border-black"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              <span className="font-semibold">{key}.</span> {value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCardItem;
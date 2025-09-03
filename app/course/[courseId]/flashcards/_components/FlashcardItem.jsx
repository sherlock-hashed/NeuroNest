// app/course/[courseId]/flashcards/_components/FlashcardItem.jsx
import React from "react";
import ReactCardFlip from "react-card-flip";

const FlashcardItem = ({ isFlipped, handleClick, flashcard }) => {
  return (
    <div className="transition-transform duration-300 ease-in-out transform hover:scale-105">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        {/* Front Side */}
        <div
          onClick={handleClick}
          className="p-4 sm:p-6 bg-black text-white font-semibold text-lg rounded-2xl cursor-pointer shadow-xl h-[250px] w-[200px] sm:h-[300px] sm:w-[250px] md:h-[380px] md:w-[300px] flex items-center justify-center text-center border border-gray-700"
        >
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl">{flashcard?.front}</h2>
        </div>

        {/* Back Side */}
        <div
          onClick={handleClick}
          className="p-4 sm:p-6 bg-black text-white font-medium text-lg rounded-2xl cursor-pointer shadow-xl h-[250px] w-[200px] sm:h-[300px] sm:w-[250px] md:h-[380px] md:w-[300px] flex items-center justify-center text-center border border-gray-700"
        >
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl">{flashcard?.back}</h2>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default FlashcardItem;
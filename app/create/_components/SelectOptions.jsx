import Image from "next/image";
import React, { useState } from "react";

function SelectOption({ onSelectStudyType }) {
  const options = [
    { name: "Exam", icon: "exam_1.png" },
    { name: "Job Interview", icon: "job.png" },
    { name: "Practice", icon: "practice.png" },
    { name: "Coding Prep", icon: "code.png" },
    { name: "Other", icon: "content.png" },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (optionName) => {
    setSelectedOption(optionName);
    if (onSelectStudyType) {
      onSelectStudyType(optionName);
    }
  };

  return (
    <div className="px-2 sm:px-0">
      <h2 className="text-center mb-4 text-base sm:text-lg font-semibold">
        What type of study material do you want to create?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {options.map((option, index) => (
          <div
            key={index}
            className={`cursor-pointer p-4 sm:p-5 rounded-xl border transition-shadow flex flex-col items-center justify-center hover:shadow-lg ${
              option.name === selectedOption
                ? "border-primary bg-primary/10 shadow-md"
                : "border-gray-300"
            }`}
            onClick={() => handleSelect(option.name)}
          >
            <Image
              src={`/${option.icon}`}
              alt={option.name}
              width={45}
              height={45}
              priority={true}
              className="sm:w-[50px] sm:h-[50px]"
            />
            <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-700 text-center">
              {option.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectOption;

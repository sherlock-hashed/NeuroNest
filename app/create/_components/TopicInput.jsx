import { Textarea } from "@/components/ui/textarea";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TopicInput = ({ setTopic, setDifficultyLevel }) => {
  return (
    <div className="mt-8 sm:mt-10 w-full flex flex-col max-w-3xl mx-auto px-2 sm:px-0">
      <label htmlFor="topic" className="mb-2 font-semibold text-base sm:text-lg">
        Enter your topic or paste the content below
      </label>
      <Textarea
        id="topic"
        placeholder="Type or paste your study topic/content here..."
        className="w-full resize-y min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
        onChange={(e) => setTopic(e.target.value)}
      />

      <label
        htmlFor="difficulty"
        className="mt-6 sm:mt-8 mb-2 font-semibold text-base sm:text-lg"
      >
        Select Difficulty Level
      </label>
      <Select onValueChange={(value) => setDifficultyLevel(value)} defaultValue="">
        <SelectTrigger id="difficulty" className="w-full max-w-xs">
          <SelectValue placeholder="Choose difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Moderate">Moderate</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

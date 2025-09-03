// app/course/[courseId]/flashcards/page.jsx
"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FlashcardItem from "./_components/FlashcardItem";
import CompletionCard from "./_components/CompletionCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Flashcards = () => {
  const { courseId } = useParams();
  const [flashCards, setFlashCards] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetFlashCards();
  }, []);

  useEffect(() => {
    if (typeof api?.on === "function") {
      api.on("select", () => {
        setIsFlipped(false);
      });
    }
  }, [api]);

  const GetFlashCards = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/study-type", {
        courseId,
        studyType: "flashcard",
      });

      const content = result?.data?.content || [];
      const updatedContent = [...content, { isCompletion: true }];
      setFlashCards(updatedContent);
    } catch (err) {
      console.error("Failed to fetch flashcards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 max-w-4xl mx-auto text-center">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary mb-2 sm:mb-4 animate-fade-in">
        🧠 Master Your Memory
      </h1>
      <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-10">
        Tap to flip the card. Swipe or use arrows to navigate.
      </p>

      <div className="flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4 mt-10 animate-pulse">
            <CustomSpinner />
            <span className="text-sm text-gray-500">Fetching your flashcards...</span>
          </div>
        ) : flashCards.length > 0 ? (
          <Carousel setApi={setApi} className="w-full max-w-sm sm:max-w-md md:max-w-xl">
            <CarouselContent>
              {flashCards.map((flashcard, index) => (
                <CarouselItem key={index} className="flex justify-center">
                  {flashcard.isCompletion ? (
                    <CompletionCard />
                  ) : (
                    <FlashcardItem
                      handleClick={handleClick}
                      isFlipped={isFlipped}
                      flashcard={flashcard}
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-gray-500 text-center">No flashcards available for this course yet.</p>
        )}
      </div>
    </div>
  );
};

export default Flashcards;

const CustomSpinner = () => (
  <div className="relative">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);
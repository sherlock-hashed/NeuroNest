// app/course/[courseId]/quiz/page.jsx
'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuizCardItem from "./_components/QuizCardItem";
import Loader from "@/components/Loader";

const Quiz = () => {
  const { courseId } = useParams();

  const [quizList, setQuizList] = useState([]);
  const [description, setDescription] = useState("");
  const [stepCount, setStepCount] = useState(0);
  const [isCorrectAns, setIsCorrectAnswer] = useState(null);
  const [correctAns, setCorrectAns] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) getQuiz();
  }, [courseId]);

  const getQuiz = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Quiz",
      });

      const content = result.data?.content || {};
      const quizData = Array.isArray(content.questions) ? content.questions : [];

      setDescription(content.description || "");
      setQuizList(quizData);
    } catch (err) {
      console.error("❌ Error loading quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (userAnswer) => {
    const currentQuestion = quizList[stepCount];
    const correctAnswerKey = currentQuestion?.correct_answer;

    setCorrectAns(correctAnswerKey);
    setSelectedOption(userAnswer);
    setIsCorrectAnswer(userAnswer === correctAnswerKey);
  };

  const nextQuestion = () => {
    if (stepCount < quizList.length - 1) {
      setStepCount(stepCount + 1);
      setCorrectAns(null);
      setIsCorrectAnswer(null);
      setSelectedOption(null);
    }
  };

  const progress = quizList.length > 0 ? ((stepCount + 1) / quizList.length) * 100 : 0;
  const currentQuestion = quizList[stepCount];

  if (loading) {
    return <Loader text="🧠 Sharpening your brain..." />;
  }

  if (!quizList.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        No quiz available for this course.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h2 className="font-extrabold text-2xl sm:text-3xl text-center mb-4 sm:mb-6 tracking-wide text-black">
        Quiz Time
      </h2>

      <div className="mb-4 w-full bg-gray-300 h-2 sm:h-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {description && <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">{description}</p>}

      <QuizCardItem
        quiz={currentQuestion}
        userSelectedOption={checkAnswer}
        selectedOption={selectedOption}
      />

      {isCorrectAns !== null && (
        <div
          className={`mt-4 p-4 border rounded ${
            isCorrectAns ? "border-black bg-gray-100" : "border-red-600 bg-red-100"
          }`}
        >
          <h3 className={`font-bold text-lg ${isCorrectAns ? "text-black" : "text-red-700"}`}>
            {isCorrectAns ? "✅ Correct!" : "❌ Incorrect"}
          </h3>

          {!isCorrectAns && (
            <p className="mt-2 text-sm sm:text-base">
              <strong>Correct Answer:</strong> {correctAns}
            </p>
          )}

          {currentQuestion?.explanation && (
            <p className="mt-2 text-sm sm:text-base text-gray-800">
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </p>
          )}
        </div>
      )}

      {isCorrectAns !== null && stepCount < quizList.length - 1 && (
        <button
          onClick={nextQuestion}
          className="mt-6 border border-black text-black px-4 py-2 rounded text-sm sm:text-base hover:bg-black hover:text-white transition"
        >
          Next Question →
        </button>
      )}

      {stepCount === quizList.length - 1 && isCorrectAns !== null && (
        <div className="mt-6 text-center font-semibold text-black text-lg">
          🎉 You’ve completed the quiz!
        </div>
      )}
    </div>
  );
};

export default Quiz;
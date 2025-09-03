// app/course/[courseId]/qa/page.jsx
'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { AnimatePresence, motion } from 'framer-motion';

const QnA = () => {
  const { courseId } = useParams();
  const router = useRouter();

  const [qnaData, setQnaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    if (courseId) getQnA();
  }, [courseId]);

  const getQnA = async () => {
    try {
      const result = await axios.post('/api/study-type', {
        courseId,
        studyType: 'QnA',
      });

      const content = result.data?.content || {};
      const sections = content.sections || [];
      setQnaData(sections);
    } catch (err) {
      console.error('❌ Error loading QnA:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentSectionIndex < qnaData.length) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const goBackToCourse = () => {
    router.push(`/course/${courseId}`);
  };

  if (loading) {
    return <Loader text="📚 Preparing your Q&A content..." />;
  }

  if (!qnaData.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        No Q&A available for this course.
      </div>
    );
  }

  const isCourseComplete = currentSectionIndex === qnaData.length;
  const progressPercentage = Math.min(
    Math.round((currentSectionIndex / qnaData.length) * 100),
    100
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 min-h-screen bg-white text-black flex flex-col justify-between">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">📘 Course Q&A</h2>

      {/* Progress Bar below heading */}
      <div className="w-full h-2 mb-6 sm:mb-8 bg-gray-200 rounded overflow-hidden">
        <motion.div
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {isCourseComplete ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="text-center mt-10 sm:mt-20"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4">🎉 You’ve mastered this module!</h3>
            <p className="mb-6 text-sm sm:text-lg text-gray-700">
              Great job going through all the Q&A sections.
            </p>
            <button
              onClick={goBackToCourse}
              className="px-5 py-2 text-sm font-medium bg-black text-white rounded hover:opacity-90 transition"
            >
              Back to Course Overview
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-base sm:text-xl font-semibold bg-gray-100 p-4 rounded mb-4 sm:mb-6">
              Section {currentSectionIndex + 1}: {qnaData[currentSectionIndex]?.section_title}
            </h3>

            <ul className="space-y-4 sm:space-y-6">
              {qnaData[currentSectionIndex].qna.map((item, idx) => (
                <li
                  key={idx}
                  className="p-4 sm:p-5 rounded shadow-sm hover:shadow-md transition bg-white border border-gray-200"
                >
                  <p className="font-semibold text-gray-800 mb-1">Question:</p>
                  <p className="mb-2 sm:mb-3 text-sm sm:text-base text-gray-900 leading-relaxed">{item.question}</p>
                  <p className="font-semibold text-gray-800 mb-1">Answer:</p>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{item.answer}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      {!isCourseComplete && (
        <div className="flex justify-between items-center mt-8 sm:mt-12">
          <button
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0}
            className="px-4 py-2 text-sm font-medium border border-black rounded disabled:opacity-30"
          >
            ← Back
          </button>

          <div className="text-sm text-gray-700">
            {`Section ${currentSectionIndex + 1} of ${qnaData.length}`}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium bg-black text-white rounded hover:opacity-90"
          >
            {currentSectionIndex === qnaData.length - 1 ? 'Finish Section' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QnA;
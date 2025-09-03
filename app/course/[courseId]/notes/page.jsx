"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TRANSITION_DURATION = 300; // ms

// Skeleton component for loading state
const NotesSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse p-4 bg-white rounded-md shadow max-w-full max-h-[75vh] overflow-hidden">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );
};

const ViewNotes = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const nextStepRef = useRef(null);

  useEffect(() => {
    GetNotes();
  }, []);

  const GetNotes = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/study-type", {
        courseId,
        studyType: "notes",
      });
      setNotes(result?.data || []);
      setStepCount(0);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeStep = (newStep) => {
    if (newStep < 0 || newStep > notes.length || isTransitioning) return;
    setIsTransitioning(true);
    nextStepRef.current = newStep;

    setTimeout(() => {
      setStepCount(nextStepRef.current);
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  };

  const handleNext = () => changeStep(stepCount + 1);
  const handlePrev = () => changeStep(stepCount - 1);

  const getSanitizedHTML = (index) => {
    if (index >= notes.length) return "";
    const rawHTML = notes[index]?.notes || "";
    return rawHTML.replace(/```html/g, "").replace(/```/g, "").trim();
  };

  const handleExportAll = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth() - (2 * margin);
    let yPosition = margin;

    // A4 size in mm
    const a4Height = 297;

    for (const [index, note] of notes.entries()) {
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      tempElement.style.width = `${pageWidth}mm`;
      
      // Add a header for each note in the PDF
      const noteTitle = document.createElement('h3');
      noteTitle.textContent = `Chapter ${index + 1} Notes`;
      noteTitle.style.cssText = 'font-size: 16px; font-weight: bold; margin-bottom: 10px;';
      tempElement.appendChild(noteTitle);

      const noteContent = document.createElement('div');
      noteContent.innerHTML = getSanitizedHTML(index);
      noteContent.style.cssText = 'font-size: 12px; line-height: 1.5;';
      tempElement.appendChild(noteContent);
      
      document.body.appendChild(tempElement);

      const canvas = await html2canvas(tempElement, {
        scale: 2, // A moderate scale for good quality without excessive file size
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(tempElement);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgProps = doc.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      if (yPosition + imgHeight > a4Height - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.addImage(imgData, 'JPEG', margin, yPosition, pageWidth, imgHeight);
      yPosition += imgHeight + 10; // Add space between notes
    }
    
    doc.save(`notes-${courseId}.pdf`);
  };

  const goBackToCourse = () => router.push(`/course/${courseId}`);
  const isCompleted = stepCount === notes.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {loading ? (
        <>
          <p className="text-gray-700 text-lg font-semibold select-none text-center">
            Preparing your notes... Hang tight!
          </p>
          <NotesSkeleton />
        </>
      ) : (
        <>
          {!isCompleted ? (
            <>
              <div className="flex justify-end mb-4">
                <Button onClick={handleExportAll} className="px-6 sm:px-8">
                  Export All to PDF
                </Button>
              </div>

              <div className="flex gap-2 sm:gap-4 items-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={stepCount === 0 || isTransitioning}
                  className="px-2 sm:px-4 text-xs sm:text-sm"
                >
                  Previous
                </Button>

                {notes.map((_, index) => (
                  <div
                    key={index}
                    className={`w-full h-2 rounded-full transition-all ${
                      index <= stepCount ? "bg-primary" : "bg-gray-200"
                    }`}
                  ></div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={stepCount >= notes.length || isTransitioning}
                  className="px-2 sm:px-4 text-xs sm:text-sm"
                >
                  Next
                </Button>
              </div>
              
              <div className="max-w-full">
                <div
                  className={`prose lg:prose-lg max-w-full max-h-[75vh] overflow-y-auto p-4 sm:px-6 sm:py-4 bg-white border rounded-md shadow transition-opacity duration-${TRANSITION_DURATION} ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                  style={{ transitionProperty: "opacity, transform" }}
                >
                  <div dangerouslySetInnerHTML={{ __html: getSanitizedHTML(stepCount) }} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 mt-8 sm:mt-16 prose text-center max-w-xl mx-auto">
              <h2 className="text-xl sm:text-3xl font-extrabold text-green-700">
                🎉 Congratulations! You've completed all the notes.
              </h2>
              <p className="text-sm sm:text-lg text-gray-700">
                Great job going through the entire course notes. You’re all set to
                continue your learning journey!
              </p>
              <Button onClick={goBackToCourse} variant="default" size="lg" className="px-6 sm:px-8">
                Back to Course Overview
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewNotes;
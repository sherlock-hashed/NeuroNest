"use client";

import React, { useState, useEffect } from "react";
import SelectOption from "./_components/SelectOptions";
import { Button } from "@/components/ui/button";
import { TopicInput } from "./_components/TopicInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Create() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

  const handleUserInput = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const GenerateCourseOutline = async () => {
    const courseId = uuidv4();

    if (!isLoaded || !isSignedIn) {
      toast.error("Please sign in to continue.");
      return;
    }

    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("User email not found. Please check your profile.");
      return;
    }

    if (!formData.topic || !formData.courseType || !formData.difficultyLevel) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      toast("Generating your personalized study material, please wait...");

      await axios.post("/api/generate-course-outline", {
        courseId,
        ...formData,
        createdBy: user.primaryEmailAddress.emailAddress,
      });

      setLoading(false);
      toast.success("Course content generated successfully!");
      router.replace("/dashboard");
    } catch (error) {
      setLoading(false);
      console.error("Error generating course outline:", error);

      if (error.response) {
        toast.error(
          `Error: ${error.response.data.error || "Unknown error occurred."}`
        );
      } else if (error.request) {
        toast.error(
          "Network error: No response from server. Please check your connection."
        );
      } else {
        toast.error(`Unexpected error: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 mt-12 sm:mt-16 lg:mt-20 w-full max-w-5xl mx-auto">
      <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-primary mb-3 text-center leading-snug">
        Build Your Personalized Study Material
      </h2>
      <p className="text-gray-600 text-sm sm:text-base md:text-lg text-center mb-8 sm:mb-10 max-w-xl mx-auto">
        Complete the steps below to generate detailed and customized study
        content tailored just for you.
      </p>

      <div className="w-full">
        {step === 0 ? (
          <SelectOption
            onSelectStudyType={(value) => handleUserInput("courseType", value)}
          />
        ) : (
          <TopicInput
            setTopic={(value) => handleUserInput("topic", value)}
            setDifficultyLevel={(value) =>
              handleUserInput("difficultyLevel", value)
            }
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 w-full mt-12 sm:mt-16">
        {step !== 0 ? (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
        ) : (
          <span />
        )}

        {step === 0 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!formData.courseType || loading}
            className="w-full sm:w-auto"
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={GenerateCourseOutline}
            disabled={!formData.topic || !formData.difficultyLevel || loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </div>
            ) : (
              "Generate Study Material"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Create;

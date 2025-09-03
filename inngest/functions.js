import {
  generateNotesAiModel,
  generateQuizAiModel,
  generateStudyTypeContentAiModel,
  generateQnAAiModel, // ✅ Add QnA model
} from "@/configs/AiModel";

import { inngest } from "./client";
import { db } from "@/configs/db";

import {
  USER_TABLE,
  STUDY_MATERIAL_TABLE,
  CHAPTER_NOTES_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
} from "@/configs/schema";

import { eq } from "drizzle-orm";

// Hello world test
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log("Event received:", event);
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

// New user handler
export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const { user } = event.data;

    const result = await step.run("Check User and Create New if not in DB", async () => {
      const existing = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));

      if (existing?.length === 0) {
        const userResp = await db
          .insert(USER_TABLE)
          .values({
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
          })
          .returning({ id: USER_TABLE.id });

        return userResp;
      }

      return existing;
    });

    return "Success";
  }
);

// Trigger course generation
export const GenerateCourse = inngest.createFunction(
  { id: "generate-course-outline" },
  { event: "course.generate" },
  async ({ event, step }) => {
    const { difficultyLevel, studyType, topic } = event.data;
    const createdBy = "user123"; // Replace with real user from auth

    const dbStepResult = await step.run("Add User Input to DB", async () => {
      return await db
        .insert(STUDY_MATERIAL_TABLE)
        .values({
          courseType: studyType,
          topic: topic,
          difficultyLevel: difficultyLevel,
          createdBy: createdBy,
        })
        .returning({ id: STUDY_MATERIAL_TABLE.id });
    });

    return {
      message: "Study material generation initiated successfully!",
      studyMaterialId: dbStepResult[0].id,
    };
  }
);

// Generate Notes per chapter
export const GenerateNotes = inngest.createFunction(
  { id: "generate-course" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data;

    await step.run("Generate Chapter Notes", async () => {
      const Chapters = course?.courseLayout?.sections || [];
      let index = 0;

      for (const chapter of Chapters) {
        const aiResp = await generateNotesAiModel(course.topic, chapter);

        await db.insert(CHAPTER_NOTES_TABLE).values({
          chapterId: index,
          courseId: course?.courseId,
          notes: aiResp,
        });

        index++;
      }

      return "Completed";
    });

    await step.run("Update Course Status to Ready", async () => {
      await db
        .update(STUDY_MATERIAL_TABLE)
        .set({ status: "Ready" })
        .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

      return "Success";
    });

    return "Done";
  }
);


// Generate Flashcards / Quiz / QnA
export const GenerateStudyTypeContent = inngest.createFunction(
  { id: "Generate Study Type Content" },
  { event: "studyType.content" },
  async ({ event, step }) => {
    const { studyType, prompt, recordId } = event.data;

    const AiResult = await step.run("Generate AI Content", async () => {
      let result;

      if (studyType === "Flashcard") {
        result = await generateStudyTypeContentAiModel(prompt);
        return result;
      } else if (studyType === "Quiz") {
        result = await generateQuizAiModel(prompt);
      } else if (studyType === "QnA") {
        result = await generateQnAAiModel(prompt);
      } else {
        throw new Error(`Unknown studyType: ${studyType}`);
      }

      const cleaned = result
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "")
        .trim();

      try {
        return JSON.parse(cleaned);
      } catch (error) {
        console.error("❌ Failed to parse AI JSON result:", cleaned);
        throw new Error("AI result is not valid JSON");
      }
    });

    await step.run("Save AI Content to DB", async () => {
      await db
        .update(STUDY_TYPE_CONTENT_TABLE)
        .set({ content: AiResult, status: "Ready" })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
      return "Saved";
    });

    return "Done";
  }
);


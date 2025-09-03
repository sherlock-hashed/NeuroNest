import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";

export async function POST(req) {
  const { sections, courseId, type } = await req.json();

  if (!sections || !courseId || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sectionSummaries = sections
    .map((section, index) => {
      const title = section?.section_title || section?.title || section;
      const content = section?.content || "";
      return `Section ${index + 1}: ${title}\n\n${content}`;
    })
    .join("\n\n---\n\n");

  let PROMPT = "";

  if (type === "Flashcard") {
    PROMPT = `
Generate a maximum of 7 flashcards in JSON format, each containing a "front" (question or term) and a "back" (answer or explanation). The flashcards should be based on the following content:

${sectionSummaries}

Distribute the cards across the topics to give a well-rounded overview. The questions should be concise, and the answers should be technically accurate and brief (1–3 sentences). Prioritize key concepts, common use cases, and important distinctions. Format the result as a JSON array.

Make sure all flashcards are relevant and helpful. Do not exceed 7 cards.
`;
  } else if (type === "Quiz") {
    PROMPT = `
You are an expert educational content creator. Based on the following sections of a course, generate a comprehensive multiple-choice quiz in JSON format.

Content to base the quiz on:
${sectionSummaries}

Instructions:

1. Generate a maximum of *10 multiple-choice questions*.
2. Ensure the questions are *well-distributed* across all topics or sections.
3. Each question must include:
   - A *question* string.
   - An *options* object with keys A, B, C, and D.
   - A *correct_answer* key with one of the values "A", "B", "C", or "D".
   - An *explanation* of why the selected answer is correct.
   - A *topic* field showing the section or topic it belongs to (use the title from the section if available).
   - A unique *id* (1 through N).
4. Use clear, unambiguous language suitable for beginner to intermediate developers.
5. Focus on conceptual understanding rather than memorization.
6. Avoid repeating options or questions.

Output Format (JSON):

{
  "description": "This quiz assesses key concepts, comparisons, and practical knowledge from the given material.",
  "questions": [
    {
      "id": 1,
      "topic": "Topic Name",
      "question": "Your question text here?",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "correct_answer": "B",
      "explanation": "Short explanation of why B is correct."
    }
  ]
}
`;
  } else if (type === "QnA") {
    PROMPT = `
You are a QnA generation assistant. Given a document or content divided into specific sections, generate a list of QnA pairs per section.

Instructions:
- Output format:

{
  "sections": [
    {
      "section_title": "Section Name",
      "qna": [
        { "question": "What is...", "answer": "..." }
      ]
    }
  ]
}

⚠️ Return only valid JSON. No markdown. No explanation.

Content:
${sectionSummaries}
`;
  } else {
    return NextResponse.json({ error: "Invalid type provided" }, { status: 400 });
  }

  // Insert new record with status Generating
  const result = await db
    .insert(STUDY_TYPE_CONTENT_TABLE)
    .values({ courseId, type, status: "Generating" })
    .returning({ id: STUDY_TYPE_CONTENT_TABLE.id });

  // Trigger async generation through Inngest
  await inngest.send({
    name: "studyType.content",
    data: {
      studyType: type,
      prompt: PROMPT,
      courseId,
      recordId: result[0].id,
    },
  });

  return NextResponse.json({ id: result[0].id });
}
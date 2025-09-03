import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
  const { courseId, studyType } = await req.json();

  if (studyType === "ALL") {
    const notes = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

    const contentList = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));

    const contentMap = {};
    contentList.forEach((item) => {
      contentMap[item.type.toLowerCase()] = item;
    });

    const result = {
      notes,
      flashcard: contentMap["flashcard"] || null,
      quiz: contentMap["quiz"] || null,
      qna: contentMap["qna"] || null,
    };

    return NextResponse.json(result);
  } else if (studyType === "notes") {
    const notes = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

    return NextResponse.json(notes);
  } else {
    const result = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(
        and(
          eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
          eq(
            STUDY_TYPE_CONTENT_TABLE.type,
            studyType.charAt(0).toUpperCase() + studyType.slice(1)
          )
        )
      );

    const content = result[0]?.content;
    let parsedContent = [];

    try {
      parsedContent = typeof content === "string" ? JSON.parse(content) : content || [];
    } catch (err) {
      console.error("Failed to parse content:", err);
    }

    return NextResponse.json({ content: parsedContent });
  }
}
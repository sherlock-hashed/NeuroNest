// // app/api/generate-course-outline/route.js
// import courseOutlineAIModel from '@/configs/AiModel';
// import { NextResponse } from 'next/server';
// import { db } from '@/configs/db'; // Assuming your database configuration is here
// import { STUDY_MATERIAL_TABLE } from '@/configs/schema'; // Assuming your Drizzle schema is here
// import { inngest } from '@/inngest/client';
// import { auth } from '@clerk/nextjs/server'

// export async function POST(req) {
//   try {
//     const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();

//     if (!courseId || !topic || !courseType || !difficultyLevel || !createdBy) {
//       return NextResponse.json(
//         { error: 'Missing required fields', details: 'Please ensure all fields (courseId, topic, courseType, difficultyLevel, createdBy) are provided.' },
//         { status: 400 }
//       );
//     }

//     const PROMPT = `Generate comprehensive study material for the topic "${topic}", suitable for a ${difficultyLevel} level preparation. The goal is to create content that breaks down the concepts clearly and logically so that students can easily understand and retain the material for a ${courseType} format.

//   The format should be structured as a JSON object with the following properties:

//   {
//     "course_title": "string",
//     "overview": "string",
//     "sections": [
//       {
//         "title": "string",
//         "content": "string - Detailed explanation with definitions, examples, and illustrations if applicable",
//         "key_points": ["string"],
//         "questions": ["string", "string", "string"] // 2-3 practice questions, adjusted to 3 for clarity
//       }
//     ]
//   }

//   Ensure the material includes:
//   - Key concepts related to "${topic}"
//   - Definitions and explanations
//   - Relevant examples
//   - Practice questions with difficulty matching ${difficultyLevel} level

//   Ensure the tone is beginner-friendly but technically correct. Emphasize clarity, with structured explanations.

//   IMPORTANT: The entire output MUST be a valid JSON object and nothing else. Do not include any explanatory text, markdown backticks (e.g., \\\json), or any other characters outside the JSON object. Just the raw JSON.`;


//     // const aiResp = await courseOutlineAIModel(PROMPT);
//     const aiResp = await courseOutlineAIModel(topic, courseType, difficultyLevel); // ✅ Correct

//     const aiResult = aiResp;

//     // Basic validation for the AI result being an object
//     if (typeof aiResult !== 'object' || aiResult === null) {
//       console.error('AI model returned non-object or null result:', aiResult);
//       return NextResponse.json(
//         { error: 'AI model returned invalid format', details: 'The AI did not produce a valid JSON object.' },
//         { status: 500 }
//       );
//     }

//     const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
//       courseId:courseId,
//       courseType:courseType,
//       createdBy:createdBy,
//       topic:topic,
//       courseLayout: JSON.stringify(aiResult), // Store the parsed JSON object
//     }).returning({resp:STUDY_MATERIAL_TABLE});

//     // Trigger the inngest func.
//     const result = await inngest.send({
//       name:'notes.generate',
//       data:{
//         course:dbResult[0].resp
//       }
//     })
//     console.log(result);


//     return NextResponse.json({result:dbResult[0]});

//   } catch (error) {
//     console.error('Error in generate-course-outline API:', error);
//     // Pass the more specific error message from AiModel.js back to the client
//     return NextResponse.json(
//       { error: 'Internal server error', details: error.message || 'An unknown error occurred on the server.' },
//       { status: 500 }
//     );
//   }
// }

import courseOutlineAIModel from '@/configs/AiModel';
import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { STUDY_MATERIAL_TABLE } from '@/configs/schema';
import { inngest } from '@/inngest/client';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();
    if (!courseId || !topic || !courseType || !difficultyLevel || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { userId, has } = await auth();
    const isPro = has({ plan: 'monthly_plan' });

    const existing = await db.select().from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy));
    if (!isPro && existing.length >= 7) {
      return NextResponse.json({ error: 'Course limit reached; upgrade to Pro.' }, { status: 403 });
    }

    const aiResp = await courseOutlineAIModel(topic, courseType, difficultyLevel);
    if (typeof aiResp !== 'object' || aiResp === null) {
      return NextResponse.json({ error: 'AI model invalid output' }, { status: 500 });
    }

    const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
      courseId, courseType, createdBy, topic,
      courseLayout: JSON.stringify(aiResp),
    }).returning({ resp: STUDY_MATERIAL_TABLE });

    await inngest.send({ name: 'notes.generate', data: { course: dbResult[0].resp } });
    return NextResponse.json({ result: dbResult[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error', details: err.message }, { status: 500 });
  }
}

// configs/AiModel.js
// Required dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from '@google/genai';
import { AsyncCallbackSet } from 'next/dist/server/lib/async-callback-set';

/**
 * Generates course material using the Google Gemini AI model.
 */
async function courseOutlineAIModel(topic, courseType, difficultyLevel) {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const tools = [{ googleSearch: {} }];

  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };

  const model = 'gemini-2.5-flash';

  const prompt = `Generate comprehensive study material for the topic "${topic}", suitable for a ${difficultyLevel} level preparation. The goal is to create content that breaks down the concepts clearly and logically so that students can easily understand and retain the material for a ${courseType} format.

Format as a JSON object:

{
  "course_title": "string",
  "overview": "string",
  "sections": [
    {
      "title": "string",
      "content": "string",
      "key_points": ["string"],
      "questions": ["string", "string", "string"]
    }
  ]
}

Ensure valid JSON. Do not include any markdown or extra characters.`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let completeResponse = '';
    for await (const chunk of responseStream) {
      completeResponse += chunk.text;
    }

    let jsonString = completeResponse.trim();
    const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    }

    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error in generateCourseMaterial:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
}

// configs/AiModel.js


/**
 * Generates structured, exam-ready HTML notes.
 */
export const generateNotesAiModel = async function (subject, chapters) {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const tools = [{ googleSearch: {} }];

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
    tools,
  };

  const model = "gemini-2.5-flash";

  const prompt = `
You are an expert in creating academic content.

Generate well-structured, exam-ready HTML notes for the subject: **"${subject}"**.
Format the output using clean semantic HTML (NO <html>, <head>, or <body> tags).
Use proper spacing, clear indentation, and semantic tags for accessibility and readability.

Use this format for each chapter:

<h1>Chapter Title</h1>
<h2>Introduction</h2>
<p>...</p>

<h2>Topics</h2>
<h3>Sub-topic Title</h3>
<p>Explanation</p>
<ul>
  <li>Bullet point if needed</li>
</ul>

<h2>Summary / Key Points</h2>
<ul>
  <li>...</li>
</ul>

<h2>Sample Questions</h2>
<h3>Short Answer Questions</h3>
<ol>
  <li>What is ...?</li>
</ol>

<h3>Long Answer Questions</h3>
<ol>
  <li>Explain the ...</li>
</ol>

<h3>MCQs</h3>
<ol>
  <li>Question? <br /><strong>Answer:</strong> Option B</li>
</ol>

Generate HTML for the following chapters:
${JSON.stringify(chapters)}

Only return raw HTML. Use proper spacing and semantic HTML structure.
`;

  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = "";
    for await (const chunk of responseStream) {
      fullResponse += chunk.text;
    }

    return fullResponse;
  } catch (error) {
    console.error("Error generating notes:", error);
    throw new Error(`Failed to generate notes: ${error.message}`);
  }
};


/**
 * Generates up to 5 JSON-formatted flashcards using a dynamic prompt.
 * @param {string} prompt - Prompt describing the content to generate flashcards from.
 */
export async function generateStudyTypeContentAiModel(prompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
  };

  const model = "gemini-2.5-flash";

  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = '';
    for await (const chunk of responseStream) {
      fullResponse += chunk.text;
    }

    let jsonString = fullResponse.trim();
    const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    }

    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error("Error generating flashcards:", error.message);
    throw new Error(`Failed to generate flashcards: ${error.message}`);
  }
}

export async function generateQuizAiModel(prompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
  };

  const model = 'gemini-2.5-flash';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = '';

  for await (const chunk of response) {
    fullResponse += chunk.text || '';
  }

  return fullResponse;
}

export async function generateQnAAiModel(prompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
  };

  const model = 'gemini-2.5-flash';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = '';

  for await (const chunk of response) {
    fullResponse += chunk.text || '';
  }

  return fullResponse;
}



export default courseOutlineAIModel;

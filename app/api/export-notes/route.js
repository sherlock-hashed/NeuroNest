import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import puppeteer from "puppeteer";

const HTML_STYLE = `
  <style>
    body { font-family: 'Inter', Arial, sans-serif; padding: 32px; max-width: 700px; margin: 0 auto; color: #222; background: #fff; }
    h1, h2, h3 { color: #3758f9; margin: 20px 0 10px; }
    h1 { font-size: 2em; } h2 { font-size: 1.4em; } h3 { font-size: 1.12em; }
    ul, ol { margin-left: 28px; padding-left: 10px; font-size: 1em; }
    li { margin-bottom: 4px; line-height: 1.6; }
    strong { color: #333; font-weight: bold; }
    p { margin: 10px 0 15px; line-height: 1.75; font-size: 1.06em; }
    hr { border: none; border-bottom: 1px solid #e1e1e1; margin: 35px 0 25px 0; }
  </style>
`;

export async function POST(req) {
  try {
    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const notes = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

    if (!notes || notes.length === 0) {
      return NextResponse.json({ error: "No notes found" }, { status: 404 });
    }

    const bodyHTML = notes.map((note, idx) => `
      <section>
        <h1>Chapter ${idx + 1}</h1>
        ${note.notes}
        <hr/>
      </section>
    `).join("");

    const fullHTML = `
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Course Notes</title>
          ${HTML_STYLE}
        </head>
        <body>
          <h1 style="text-align:center; margin-bottom:24px">Course Notes Export</h1>
          ${bodyHTML}
        </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(fullHTML, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "30px", right: "35px", bottom: "35px", left: "30px" },
      displayHeaderFooter: false,
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="course_${courseId}_notes.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Export Error:", error);
    return NextResponse.json({ error: "PDF export failed", details: error?.message }, { status: 500 });
  }
}

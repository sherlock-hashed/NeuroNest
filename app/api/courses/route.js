// import { db } from "@/configs/db";
// import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
// import { eq } from "drizzle-orm";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     const {createdBy} = await req.json();

//     const result = await db.select().from(STUDY_MATERIAL_TABLE)
//     .where(eq(STUDY_MATERIAL_TABLE.createdBy,createdBy));

//     return NextResponse.json({result:result})
// }
// app/api/courses/route.js
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { createdBy } = await req.json();

    if (!createdBy) {
      return NextResponse.json({ error: "Missing createdBy" }, { status: 400 });
    }

    const result = await db.select().from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy))
      .orderBy(desc(STUDY_MATERIAL_TABLE.id));

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const courseId = searchParams?.get('courseId');

  const course = await db.select().from(STUDY_MATERIAL_TABLE)
    .where(eq(STUDY_MATERIAL_TABLE?.courseId, courseId));

  return NextResponse.json({ result: course[0] });
}
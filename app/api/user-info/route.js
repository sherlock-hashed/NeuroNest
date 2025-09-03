import { auth } from '@clerk/nextjs/server';
import { db } from '@/configs/db';
import { STUDY_MATERIAL_TABLE } from '@/configs/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId, has } = await auth();
    const isMember = has({ plan: 'monthly_plan' });
    const courses = await db.select().from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, userId));

    return new Response(JSON.stringify({ isMember, totalCourses: courses.length }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed fetching user info' }), { status: 500 });
  }
}

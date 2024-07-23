import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config';
import { responses, forms } from '@/config/schema';
import { and, eq, sql } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formId = request.nextUrl.searchParams.get('formId');
  if (!formId) {
    return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
  }

  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    const count = await db.select({ count: sql<number>`count(*)` })
      .from(responses)
      .innerJoin(forms, eq(responses.formId, forms.id))
      .where(and(
        eq(responses.formId, parseInt(formId)),
        eq(forms.createdBy, userEmail!)
      ));

    return NextResponse.json({ count: count[0].count });
  } catch (error) {
    console.error('Error fetching response count:', error);
    return NextResponse.json({ error: 'Failed to fetch response count' }, { status: 500 });
  }
}
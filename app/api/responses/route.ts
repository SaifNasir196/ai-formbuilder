import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config';
import { responses, forms } from '@/config/schema';
import { and, eq } from 'drizzle-orm';
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

    // Check if the user owns the form
    const formOwnership = await db.select({ id: forms.id })
      .from(forms)
      .where(and(eq(forms.id, parseInt(formId)), eq(forms.createdBy, userEmail!)))
      .limit(1);

    if (formOwnership.length === 0) {
      return NextResponse.json({ error: 'Unauthorized access to form' }, { status: 403 });
    }

    const formResponses = await db.select().from(responses)
      .where(eq(responses.formId, parseInt(formId)));

    return NextResponse.json(formResponses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { formId, response } = await request.json();

    const result = await db.insert(responses).values({
      formId,
      response: response,
      respondedAt: new Date(),
    }).returning({ id: responses.id });

    return NextResponse.json({ id: result[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Failed to create response' }, { status: 500 });
  }
}
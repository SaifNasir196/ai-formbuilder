import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config';
import { forms } from '@/config/schema';
import { and, eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';


export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const response = await db.select().from(forms)
      .where(and(eq(forms.id, parseInt(params.formId)), eq(forms.createdBy, userEmail)));

    if (response.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ form: response[0] });
  } catch (error) {
    console.error('Error fetching form data:', error);
    return NextResponse.json({ error: 'Failed to fetch form data' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const { jsonform } = await request.json();

    const res = await db.update(forms)
      .set({ jsonform: JSON.stringify(jsonform) })
      .where(and(eq(forms.id, parseInt(params.formId)), eq(forms.createdBy, userEmail)));

    return NextResponse.json({ message: 'Form updated successfully' });
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    await db.delete(forms)
      .where(and(eq(forms.id, parseInt(params.formId)), eq(forms.createdBy, userEmail)));

    return NextResponse.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/config';
import { forms } from '@/config/schema'; // Your Drizzle schema

export async function GET(request: NextRequest) {
  console.time('Total API time');
  const { userId } = auth();

  if (!userId) {
    console.timeEnd('Total API time');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.time('Fetch user email');
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    console.timeEnd('Fetch user email');

    
    if (!userEmail) {
      console.timeEnd('Total API time');
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    console.time('Database query');
    const formList = await db.select().from(forms)
        .where(eq(forms.createdBy, userEmail))
        .orderBy(desc(forms.id));
    
    console.timeEnd('Database query');
    console.timeEnd('Total API time');

    return NextResponse.json(formList);
  } catch (error) {
    console.error('Error fetching form list:', error);
    console.timeEnd('Total API time');
    return NextResponse.json({ error: 'Failed to fetch form list' }, { status: 500 });
  }
}
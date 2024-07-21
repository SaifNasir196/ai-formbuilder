import { NextRequest, NextResponse } from 'next/server';
import { eq, desc, and } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/config';
import { forms } from '@/config/schema'; // Your Drizzle schema

export async function GET(request: NextRequest) {
//   console.time('Total API time');
  const { userId } = auth();

  if (!userId) {
    // console.timeEnd('Total API time');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // console.time('Fetch user email');
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    // console.timeEnd('Fetch user email');

    
    if (!userEmail) {
    //   console.timeEnd('Total API time');
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // console.time('Database query');
    const formList = await db.select().from(forms)
        .where(eq(forms.createdBy, userEmail))
        .orderBy(desc(forms.id));
    
    // console.timeEnd('Database query');
    // console.timeEnd('Total API time');

    return NextResponse.json(formList);
  } catch (error) {
    console.error('Error fetching form list:', error);
    // console.timeEnd('Total API time');
    return NextResponse.json({ error: 'Failed to fetch form list' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (!userEmail)
    return NextResponse.json({ error: 'User email not found' }, { status: 400 });

  try {
    const { message, duplicated = 0 } = await request.json();
    let data;

    if (!duplicated) {
      // send request to Gemini
      const response = await fetch(process.env.NEXT_PUBLIC_URL + '/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok)
        throw new Error('Network response was not ok');

      // parse response
      data = await response.json();
      data = data?.response;
      
    } else {
      // duplicate is a formId of an existing form
      // only get the jsonform of the existing form
      // const data = await db.select().from(forms).where(and(eq(forms.id, duplicated), eq(forms.createdBy ,userEmail)));
      data = await db.select( {jsonform: forms.jsonform} ).from(forms).where(and(eq(forms.id, duplicated), eq(forms.createdBy ,userEmail)));
      data = data[0].jsonform;
      console.log('data:', data);
    }

    // insert form into database
    const res = await db.insert(forms).values({
        jsonform: data || "",
        createdBy: userEmail as string,
        createdAt: new Date(),
    }).returning({ id: forms.id });

    if (!res[0].id && res.length === 0)
      throw new Error("Failed to create form");

    return NextResponse.json({ id: res[0].id }, { status: 201 });

  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}


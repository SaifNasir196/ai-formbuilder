import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formList = await prisma.form.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        id: 'desc',
      }
    });

    return NextResponse.json(formList);
  } catch (error) {
    console.error('Error fetching form list:', error);
    return NextResponse.json({ error: 'Failed to fetch form list' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, duplicated = false } = await request.json();
    let data;

    if (!duplicated) {
      // send request to Gemini
      const url = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_URL : process.env.NEXT_PUBLIC_PROD_URL
      if (url === undefined) {
        throw new Error('URL not found');
      }

      const response = await fetch(url  + '/api/gemini', {
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
      // only get the jsonform of the existing form
      data = await prisma.form.findUnique({
        where: {
          id: parseInt(message),
          userId: user?.id,
        },
        select: {
          jsonform: true,
        }
      });
      console.log('data:', data);
    }

    // rename title  (temp solution)
    const dataObj = data && JSON.parse(data);
    dataObj.title = dataObj.title + ' - Copy';
    // insert form into database

    const res = await prisma.form.create({
      data: {
        jsonform: JSON.stringify(dataObj),
        userId: user?.id,
      },
      select: {
        id: true,
      }
    });

    if (!res || !res.id)
      throw new Error("Failed to create form");

    return NextResponse.json({ id: res.id }, { status: 201 });

  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}


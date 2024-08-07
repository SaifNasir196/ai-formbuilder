import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';


export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  
  const user = await currentUser();
  if (!user){
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await prisma.form.findUnique({
      where: {
        id: parseInt(params.formId),
        userId: user?.id,
      },
    });

    if (!res) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ form: res });
  } catch (error) {
    console.error('Error fetching form data:', error);
    return NextResponse.json({ error: 'Failed to fetch form data' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  const user = await currentUser();
  if (!user){
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  try {
    const { jsonform } = await request.json();

    const res = await prisma.form.update({
      where: {
        id: parseInt(params.formId),
        userId: user?.id,
      },
      data: {
        jsonform: JSON.stringify(jsonform),
      },
    });

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
  const user = await currentUser();
  if (!user){
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await prisma.form.delete({
      where: {
        id: parseInt(params.formId),
        userId: user?.id,
      },
    });

    return NextResponse.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}
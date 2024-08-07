import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { use } from 'react';
import { Prisma } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { responseId: string } }
) {
  const user = await currentUser();
  if (!user){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const submission = await prisma.formSubmission.findUnique({
      where: {
        id: parseInt(params.responseId),
        form: {
          userId: user.id,
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Response not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching response:', error);
    return NextResponse.json({ error: 'Failed to fetch response' }, { status: 500 });
  }
}

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { responseId: string } }
// ) {
//   const { userId } = auth();
//   if (!userId) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const { response } = await request.json();
//     const user = await currentUser();
//     const userEmail = user?.primaryEmailAddress?.emailAddress;

//     const result = await db.update(responses)
//       .set({ response: JSON.stringify(response) })
//       .where(and(
//         eq(responses.id, parseInt(params.responseId)),
//       ))
//       .returning({ id: responses.id });

//     if (result.length === 0) {
//       return NextResponse.json({ error: 'Response not found or unauthorized' }, { status: 404 });
//     }

//     return NextResponse.json({ id: result[0].id });
//   } catch (error) {
//     console.error('Error updating response:', error);
//     return NextResponse.json({ error: 'Failed to update response' }, { status: 500 });
//   }
// }


export async function DELETE(
  request: NextRequest,
  { params }: { params: { formId: number, responseId: number } }
) {
  const user = await currentUser();
  if (!user){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await prisma.formSubmission.delete({
      where: {
        id: params.responseId,
        form: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ message: 'Response deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Response not found or unauthorized' }, { status: 404 });
    }
    console.error('Error deleting response:', error);
    return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 });
  }
}
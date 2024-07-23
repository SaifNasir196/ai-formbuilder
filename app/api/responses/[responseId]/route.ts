import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config';
import { responses, forms } from '@/config/schema';
import { and, eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { responseId: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    const response = await db.select()
      .from(responses)
      .innerJoin(forms, eq(responses.formId, forms.id))
      .where(and(
        eq(responses.id, parseInt(params.responseId)),
        eq(forms.createdBy, userEmail!)
      ))
      .limit(1);

    if (response.length === 0) {
      return NextResponse.json({ error: 'Response not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(response[0].responses);
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
  { params }: { params: { formId:number, responseId: number } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    const result = await db.delete(responses)
      .where(and(
        eq(responses.id, params.responseId),
        eq(responses.formId, params.formId),
        eq(forms.createdBy, userEmail!),
      ))
      .returning({ id: responses.id });

    if (result.length === 0) {
      return NextResponse.json({ error: 'Response not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 });
  }
}
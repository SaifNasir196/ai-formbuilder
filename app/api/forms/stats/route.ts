import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const user = await currentUser();
    if (!user){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const stats = await prisma.form.aggregate({
            where: {
                userId: user?.id,
            },
            _sum: {
                submissions: true,
                visits: true,
            }
        });

        const visits = stats._sum.visits || 0;
        const submissions = stats._sum.submissions || 0;

        const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
        const bounceRate = 100 - submissionRate;



        return NextResponse.json({ visits, submissions, submissionRate, bounceRate });
    } catch (error) {
        console.error('Error fetching form list:', error);
        // console.timeEnd('Total API time');
        return NextResponse.json({ error: 'Failed to fetch form list' }, { status: 500 });
    }
}

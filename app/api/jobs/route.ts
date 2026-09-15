import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('function');
    const location = searchParams.get('location');

    const filter: any = { status: 'OPEN' };

    if (department) {
      filter.department = {
        contains: department,
        mode: 'insensitive'
      };
    }

    if (location) {
      filter.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    const jobs = await prisma.jobOpening.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        department: true,
        location: true,
        createdAt: true,
        // Don't send description and formConfig in the list view to keep payload small
      }
    });

    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

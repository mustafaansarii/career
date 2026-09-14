import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, email, phone, role, resumeLink } = body;

    // Validate required fields
    if (!name || !email || !phone || !role || !resumeLink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: userId || null,
        name,
        email,
        phone,
        role,
        resumeLink,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Failed to submit application', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


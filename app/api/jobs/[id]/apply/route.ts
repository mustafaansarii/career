import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const job = await prisma.jobOpening.findUnique({
      where: { id, status: 'OPEN' }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or closed' }, { status: 404 });
    }

    const formConfig = job.formConfig as any[];

    // Basic validation based on the form configuration
    for (const field of formConfig) {
      if (field.required && !body[field.name]) {
        return NextResponse.json(
          { error: `Missing required field: ${field.label || field.name}` },
          { status: 400 }
        );
      }
    }

    // Extract basic fields if available, otherwise just use unknown
    const applicantName = body.fullName || body.name || 'Unknown Candidate';
    const applicantEmail = body.email || 'unknown@example.com';

    const application = await prisma.jobApplication.create({
      data: {
        jobId: id,
        applicantName,
        applicantEmail,
        answers: body
      }
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

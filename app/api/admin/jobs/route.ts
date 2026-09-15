import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default form configuration when creating a new job if none provided
const DEFAULT_FORM_CONFIG = [
  { name: 'resume', label: 'Resume/CV', type: 'file', required: true },
  { name: 'fullName', label: 'Full name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', required: true },
  { name: 'currentLocation', label: 'Current location', type: 'text', required: false },
  { name: 'currentCompany', label: 'Current company', type: 'text', required: true },
  { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'url', required: true },
  { name: 'twitterUrl', label: 'Twitter URL', type: 'url', required: false },
  { name: 'githubUrl', label: 'GitHub URL', type: 'url', required: false },
  { name: 'portfolioUrl', label: 'Portfolio URL', type: 'url', required: false },
  { name: 'otherWebsite', label: 'Other website', type: 'url', required: false },
  { name: 'additionalInfo', label: 'Additional info', type: 'textarea', required: false },
];

export async function GET() {
  try {
    const jobs = await prisma.jobOpening.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, department, location, jobType, description, formConfig } = body;

    if (!title || !department || !location || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const job = await prisma.jobOpening.create({
      data: {
        title,
        department,
        location,
        jobType: jobType || 'Full-Time',
        description,
        formConfig: formConfig || DEFAULT_FORM_CONFIG,
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

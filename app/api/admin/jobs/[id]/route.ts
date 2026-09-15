import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Only extract the fields we allow to update
    const { title, department, location, jobType, description, formConfig, status } = body;

    const job = await prisma.jobOpening.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(department && { department }),
        ...(location && { location }),
        ...(jobType && { jobType }),
        ...(description && { description }),
        ...(formConfig && { formConfig }),
        ...(status && { status }),
      }
    });

    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.jobOpening.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

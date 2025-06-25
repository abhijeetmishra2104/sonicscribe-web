import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const files = await prisma.audioFile.findMany({
      orderBy: { uploadedAt: 'desc' },
    });

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch files' }, { status: 500 });
  }
}

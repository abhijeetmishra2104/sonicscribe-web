import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  try {
    const { response: unauthorized } = await requireAuth(req);
    if (unauthorized) return unauthorized;

    const files = await prisma.audioFile.findMany({
      orderBy: { uploadedAt: 'desc' },
    });

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch files' }, { status: 500 });
  }
}

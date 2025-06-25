import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { Readable } from 'stream';
import type { UploadApiResponse } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'audio-uploads',
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    // Save to Prisma DB
    const dbRecord = await prisma.audioFile.create({
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: file.name,
        uploadedAt: new Date(),
      },
    });

    // Send Cloudinary URL to Flask API
    const flaskResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analyze-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: uploadResult.secure_url }),
    });

    const raw = await flaskResponse.text();

    try {
      const parsed = JSON.parse(raw);
      return NextResponse.json({
        success: true,
        file: dbRecord,
        analysis: typeof parsed.result === 'string' ? parsed.result : JSON.stringify(parsed.result),
      });
    } catch (e) {
      console.error("❌ Failed to parse Flask JSON response:", raw);
      return NextResponse.json({
        success: false,
        error: "Invalid response from AI analysis service",
        raw,
      }, { status: 500 });
    }

  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    }, { status: 500 });
  }
}

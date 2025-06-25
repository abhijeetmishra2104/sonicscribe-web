import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { Readable } from 'stream';
import type { UploadApiResponse } from 'cloudinary';

const prisma = new PrismaClient();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to stream
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

    // Save record to DB
    const dbRecord = await prisma.audioFile.create({
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: file.name,
        uploadedAt: new Date(),
      },
    });

    // Send URL to Flask backend
    const flaskResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analyze-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: uploadResult.secure_url }),
    });

    let aiResult;

try {
  aiResult = await flaskResponse.json(); // Let fetch handle parsing
} catch (e) {
  const rawText = await flaskResponse.text();
  console.error("❌ Failed to parse Flask JSON. Raw response:", rawText);
  return NextResponse.json({
    error: "Invalid JSON from Flask",
    raw: rawText,
  }, { status: 500 });
}

return NextResponse.json({
  success: true,
  file: dbRecord,
  analysis: {
    transcript: aiResult.transcript,
    response: aiResult.response,
  },
});

  } catch (error) {
    console.error("❌ Unexpected error in POST handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

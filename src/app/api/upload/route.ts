import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { Readable } from 'stream';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  const uploadResult = await new Promise((resolve, reject) => {
    const streamUpload = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'audio-uploads',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.pipe(streamUpload);
  });

  const result = uploadResult as any;

  const dbRecord = await prisma.audioFile.create({
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: file.name,
      uploadedAt: new Date(),
    },
  });

  // 🔥 Send the Cloudinary URL to Flask app
  const flaskResponse = await fetch('http://flask-app1:8080/process-audio-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: result.secure_url }),
});

  const text = await flaskResponse.text();
try {
  const aiResult = JSON.parse(text);
  return NextResponse.json({
    success: true,
    file: dbRecord,
    analysis: aiResult.result,
  });
} catch (e) {
  console.error("❌ JSON parsing failed. Raw response:", text);
  return NextResponse.json({ error: "Flask response not JSON", raw: text }, { status: 500 });
}

}


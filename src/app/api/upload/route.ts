import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { Readable } from 'stream';
import type { UploadApiResponse } from 'cloudinary';
import { requireAuth } from '@/lib/api-auth';

const prisma = new PrismaClient();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { response: unauthorized } = await requireAuth(req);
    if (unauthorized) return unauthorized;

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

    // Send URL to Flask backend. A connection failure here used to fall through
    // to the outer catch and surface as a bare "Internal Server Error", which
    // gave no hint that the analysis service was simply down.
    let flaskResponse: Response;
    try {
      flaskResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analyze-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: uploadResult.secure_url }),
      });
    } catch (e) {
      console.error("❌ Could not reach the analysis service:", e);
      return NextResponse.json({
        error: `Could not reach the analysis service at ${process.env.NEXT_PUBLIC_API_BASE_URL}. Make sure it is running.`,
      }, { status: 502 });
    }

    // Read the body once as text: calling .json() first and then .text() in the
    // catch throws "Body is unusable", masking the real parse failure.
    const rawText = await flaskResponse.text();

    let flaskData;
    try {
      flaskData = JSON.parse(rawText);
    } catch {
      console.error("❌ Failed to parse Flask JSON. Raw response:", rawText);
      return NextResponse.json({
        error: `Analysis service returned a non-JSON response (HTTP ${flaskResponse.status}).`,
        raw: rawText.slice(0, 500),
      }, { status: 502 });
    }

    if (!flaskResponse.ok || !flaskData.success) {
      return NextResponse.json({
        error: flaskData.error || `Analysis service failed (HTTP ${flaskResponse.status}).`,
      }, { status: 502 });
    }

    // Extract structured response. Guard the destructure: a success:true payload
    // with no `analysis` would throw here and be swallowed by the outer catch as
    // a bare "Internal Server Error", hiding that the fault is upstream.
    if (!flaskData.analysis) {
      return NextResponse.json({
        error: "Analysis service reported success but returned no analysis payload.",
      }, { status: 502 });
    }

    const { transcript, structured, triage } = flaskData.analysis;

    return NextResponse.json({
      success: true,
      file: dbRecord,
      analysis: {
        transcript,
        structured, // structured fields like name, age, symptoms, etc.
        triage,     // optional triage info if provided
      },
    });

  } catch (error) {
    console.error("❌ Unexpected error in POST handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const textInput = formData.get('text_input') as string | null;
    const audioFile = formData.get('audio_file') as File | null;

    const flaskFormData = new FormData();

    if (textInput) {
      flaskFormData.append('text_input', textInput);
    }

    if (audioFile) {
      const buffer = Buffer.from(await audioFile.arrayBuffer());
      const blob = new Blob([buffer], { type: audioFile.type });
      flaskFormData.append('audio_file', blob, audioFile.name);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analyze-symptoms`, {
      method: 'POST',
      body: flaskFormData,
    });

    const raw = await response.text();

    console.log("✅ Flask response status:", response.status);
    console.log("🧪 Flask raw body:", raw);

    try {
      const data = JSON.parse(raw);

      if (data.response) {
        return NextResponse.json({
          success: true,
          result: typeof data.response === 'string' ? data.response.trim() : JSON.stringify(data.response),
          transcript: data.transcript ?? null,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Flask returned no response.',
          raw,
        }, { status: 500 });
      }
    } catch (e) {
      console.error("❌ Failed to parse JSON from Flask:", raw);
      return NextResponse.json({
        success: false,
        error: "Invalid response format from Flask server",
        raw,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error contacting Flask app:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reach Flask server',
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
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

  try {
    const response = await fetch('http://flask-app2:5001/analyze', {
  method: 'POST',
  body: flaskFormData as any,
});

const data = await response.json();

if (data.success && data.response) {
  return NextResponse.json({ success: true, result: data.response.trim() });
} else {
  return NextResponse.json({
    success: false,
    error: 'Flask returned no response.',
  }, { status: 500 });
}


  } catch (error) {
    console.error('Error contacting Flask app:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reach Flask server',
    }, { status: 500 });
  }
}

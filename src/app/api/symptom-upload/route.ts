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

  // add just before your try/catch or replace the fetch block
try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analyze-symptoms`, {
    method: 'POST',
    body: flaskFormData as any,
  });

  // log status for debugging
  console.log('Flask response status:', response.status, response.statusText);

  const text = await response.text(); // always get raw body
  // try to parse JSON if content-type is JSON
  const contentType = response.headers.get('content-type') || '';
  let data: any;
  if (contentType.includes('application/json')) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON body from Flask:', e);
      console.error('Flask body:', text);
      return NextResponse.json({ success: false, error: 'Invalid JSON from Flask' }, { status: 500 });
    }
  } else {
    // not JSON — log and return the raw text to help debugging
    console.error('Flask returned non-JSON response:', text);
    return NextResponse.json({ success: false, error: 'Flask returned non-JSON response', body: text }, { status: response.status });
  }

  // existing handling
  if (data.response) {
    const result =
      typeof data.response === "string"
        ? data.response.trim()
        : JSON.stringify(data.response);

    return NextResponse.json({
      success: true,
      result,
      transcript: data.transcript || null,
    });
  } else {
    console.error('Flask JSON had no `response` field:', data);
    return NextResponse.json({ success: false, error: "Flask returned no response.", body: data }, { status: 500 });
  }

} catch (error) {
  console.error('Error contacting Flask app:', error);
  return NextResponse.json({
    success: false,
    error: 'Failed to reach Flask server',
  }, { status: 500 });
}
}

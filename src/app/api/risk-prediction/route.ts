import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Optional: Validate required fields
    const requiredFields = ['age', 'gender', 'primaryDiagnosis', 'numProcedures', 'daysInHospital', 'comorbidityScore', 'dischargeTo'];
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error('❌ Flask server error response:', rawText);
      return NextResponse.json({ error: 'Flask server error', detail: rawText }, { status: 500 });
    }

    try {
      const result = JSON.parse(rawText);
      return NextResponse.json(result);
    } catch (e) {
      console.error('❌ Failed to parse Flask JSON:', rawText);
      return NextResponse.json({ error: 'Invalid JSON from Flask', raw: rawText }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in /api/risk-prediction route:', error);
    return NextResponse.json(
      { error: 'Failed to contact Flask server' },
      { status: 500 }
    );
  }
}

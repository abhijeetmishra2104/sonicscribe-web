import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Flask error response:', text);
      return NextResponse.json({ error: 'Flask server error', detail: text }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/risk-prediction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prediction from Flask server' },
      { status: 500 }
    );
  }
}

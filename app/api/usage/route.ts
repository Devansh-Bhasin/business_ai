import { NextResponse } from 'next/server';
import { getUsageSnapshot } from '@/lib/usage';

export async function GET(request: Request) {
  try {
    const sessionId = String(request.headers.get('x-session-id') || '').trim();

    if (!sessionId || sessionId.length < 12) {
      return NextResponse.json({ error: 'Missing session identifier.' }, { status: 400 });
    }

    const usage = await getUsageSnapshot(sessionId);
    return NextResponse.json({ usage });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

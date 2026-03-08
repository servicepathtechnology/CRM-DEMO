import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const analytics = await db.getAnalytics();
    return NextResponse.json(analytics);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'ANALYTICS_ERROR' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!body.type || !body.content || !body.performedBy) {
      return NextResponse.json({ error: 'Missing required fields', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const activities = await db.addActivity(id, body);
    if (!activities) {
      return NextResponse.json({ error: 'Lead not found', code: 'NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json(activities, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'CREATE_ACTIVITY_ERROR' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  try {
    const data = await db.getLeads(params);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'FETCH_ERROR' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.email || !body.leadSource || !body.status || !body.assignedTo) {
      return NextResponse.json({ error: 'Missing required fields', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const newLead = await db.createLead(body);
    return NextResponse.json(newLead, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'CREATE_ERROR' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lead = await db.getLeadById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found', code: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'FETCH_ERROR' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const updatedLead = await db.updateLead(id, updates);
    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found', code: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json(updatedLead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'UPDATE_ERROR' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = await db.deleteLead(id);
    if (!success) {
      return NextResponse.json({ error: 'Lead not found', code: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'DELETE_ERROR' }, { status: 500 });
  }
}

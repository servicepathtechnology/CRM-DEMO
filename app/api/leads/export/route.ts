import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { leadsToCSV } from '@/lib/csv-export';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  
  // Override pagination for export to get all matching results
  params.limit = '0';

  try {
    const { leads } = await db.getLeads(params);
    const csvStr = leadsToCSV(leads);
    
    // Create Date formatted string for filename
    const dateStr = new Date().toISOString().split('T')[0];

    return new NextResponse(csvStr, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-export-${dateStr}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'EXPORT_ERROR' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

// PERBAIKAN JALUR IMPORT (MANUAL):
import dbConnect from '../../../lib/db';
import Pengaduan from '../../../models/Pengaduan';

export async function GET() {
  await dbConnect();
  try {
    // Ambil data urut dari yang terbaru
    const data = await Pengaduan.find({}).sort({ tanggal: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
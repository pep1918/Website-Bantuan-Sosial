import { NextResponse } from 'next/server';

// ============================================================
// PERBAIKAN: Gunakan jalur manual (../../../) 
// ============================================================
import dbConnect from '../../../lib/db'; 
import Penyaluran from '../../../models/Penyaluran'; 

// GET: Ambil semua riwayat
export async function GET() {
  await dbConnect();
  try {
    const data = await Penyaluran.find({}).sort({ tanggal_salur: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Catat penyaluran baru
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const record = new Penyaluran(body);
    await record.save();
    return NextResponse.json({ success: true, message: "Penyaluran berhasil dicatat!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Pengaduan from '../../../models/Pengaduan';

export async function GET() {
  await dbConnect();
  try {
    // Ambil data urut terbaru
    const data = await Pengaduan.find({}).sort({ tanggal: -1 });

    // Hitung Statistik (Grouping manual)
    const stats = {
        infrastruktur: data.filter(d => d.kategori === 'INFRASTRUKTUR').length,
        keamanan: data.filter(d => d.kategori === 'KEAMANAN').length,
        sosial: data.filter(d => d.kategori === 'SOSIAL').length,
        urgensi_tinggi: data.filter(d => d.urgensi === 'TINGGI').length
    };

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
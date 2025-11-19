import { NextResponse } from 'next/server';

// PERBAIKAN DI SINI: Menggunakan jalur relatif (titik-titik) agar pasti ketemu
import dbConnect from '../../../lib/db';
import Pengaduan from '../../../models/Pengaduan';
import KasRT from '../../../models/KasRT';

export async function GET() {
  await dbConnect();
  
  const allKas = await KasRT.find({});
  
  const saldoKas = allKas.reduce((acc, curr) => 
    curr.tipe === 'MASUK' ? acc + curr.nominal : acc - curr.nominal, 0
  );

  const danaBansos = allKas
    .filter(k => k.tipe === 'KELUAR' && k.keterangan.toLowerCase().includes('bansos'))
    .reduce((acc, curr) => acc + curr.nominal, 0);

  return NextResponse.json({ 
    success: true, 
    kas_rt: saldoKas, 
    dana_bansos: danaBansos 
  });
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const aduanBaru = new Pengaduan(body);
    await aduanBaru.save();
    return NextResponse.json({ success: true, message: "Laporan berhasil dikirim!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
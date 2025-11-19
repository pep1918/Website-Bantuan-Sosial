import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Pengaduan from '../../../models/Pengaduan';
import KasRT from '../../../models/KasRT';
import Penyaluran from '../../../models/Penyaluran';

export async function GET(request) {
  await dbConnect();
  
  // 1. Cek apakah ada parameter 'type' di URL (Contoh: /api/public?type=kas)
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    // === JIKA MINTA DETAIL ===
    if (type === 'kas') {
        // Ambil 10 transaksi terakhir kas
        const data = await KasRT.find({}).sort({ tanggal: -1 }).limit(10);
        return NextResponse.json({ success: true, data });
    }
    
    if (type === 'penyaluran') {
        // Ambil 10 penyaluran terakhir
        const data = await Penyaluran.find({}).sort({ tanggal_salur: -1 }).limit(10);
        return NextResponse.json({ success: true, data });
    }

    // === JIKA MINTA RINGKASAN (DEFAULT) ===
    
    // Hitung Kas
    const allKas = await KasRT.find({});
    const saldoKas = allKas.reduce((acc, curr) => 
      curr.tipe === 'MASUK' ? acc + curr.nominal : acc - curr.nominal, 0
    );

    // Hitung Bansos
    const aggregasiBansos = await Penyaluran.aggregate([
        { $group: { _id: null, total: { $sum: "$nominal" } } }
    ]);
    const totalBansos = aggregasiBansos.length > 0 ? aggregasiBansos[0].total : 0;

    // Hitung Penerima
    const jumlahPenerima = await Penyaluran.countDocuments();

    return NextResponse.json({ 
      success: true, 
      kas_rt: saldoKas, 
      dana_bansos: totalBansos,
      total_penerima: jumlahPenerima 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST (Tetap sama, untuk kirim laporan)
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    const t = body.isi_laporan.toLowerCase();
    let kategori = 'LAINNYA';
    let urgensi = 'RENDAH';

    if (t.includes('jalan') || t.includes('lampu') || t.includes('rusak')) kategori = 'INFRASTRUKTUR';
    else if (t.includes('maling') || t.includes('aman')) kategori = 'KEAMANAN';
    else if (t.includes('bansos') || t.includes('miskin')) kategori = 'SOSIAL';

    if (t.includes('segera') || t.includes('bahaya')) urgensi = 'TINGGI';

    const aduanBaru = new Pengaduan({ ...body, kategori, urgensi });
    await aduanBaru.save();
    
    return NextResponse.json({ success: true, message: "Laporan berhasil dikirim!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
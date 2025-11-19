import { NextResponse } from 'next/server';

// PERBAIKAN JALUR IMPORT (MANUAL):
import dbConnect from '../../../lib/db'; 
import Warga from '../../../models/Warga';
import KasRT from '../../../models/KasRT';
import Pengaduan from '../../../models/Pengaduan';

export async function GET() {
  await dbConnect();
  try {
    // 1. Hitung Warga
    const totalWarga = await Warga.countDocuments();
    const layak = await Warga.countDocuments({ status_kelayakan: 'LAYAK' });
    const pending = await Warga.countDocuments({ status_approval: 'PENDING_RW' });

    // 2. Hitung Kas
    const allKas = await KasRT.find({});
    const totalKas = allKas.reduce((acc, curr) => 
        curr.tipe === 'MASUK' ? acc + curr.nominal : acc - curr.nominal, 0
    );

    // 3. Hitung Aduan Baru
    const aduanBaru = await Pengaduan.countDocuments({ status: 'DITERIMA' });

    return NextResponse.json({
        total: totalWarga,
        layak: layak,
        pending: pending,
        kas: totalKas,
        aduan: aduanBaru
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

// PERBAIKAN JALUR IMPORT (MANUAL):
import dbConnect from '../../../lib/db';
import Warga from '../../../models/Warga';
import { hitungSAW } from '../../../lib/saw';

export async function POST() {
  await dbConnect();
  try {
    const allWarga = await Warga.find({});
    
    if (allWarga.length === 0) return NextResponse.json({ message: "Data kosong" }, { status: 400 });

    // Jalankan Logika SAW
    const rankedData = hitungSAW(allWarga);

    // Update Database Massal
    const updates = rankedData.map(async (item) => {
        const statusBaru = parseFloat(item.skor_saw) >= 0.7 ? 'LAYAK' : 'TIDAK_LAYAK';
        return Warga.findByIdAndUpdate(item._id, {
            skor_saw: item.skor_saw,
            status_kelayakan: statusBaru
        });
    });

    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
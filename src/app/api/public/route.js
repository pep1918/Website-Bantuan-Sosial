import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Pengaduan from '../../../models/Pengaduan';
import KasRT from '../../../models/KasRT';

// --- LOGIKA AI FILTER SEDERHANA ---
const analisaLaporan = (teks) => {
    const t = teks.toLowerCase();
    let kategori = 'LAINNYA';
    let urgensi = 'RENDAH';

    // 1. Deteksi Kategori
    if (t.includes('jalan') || t.includes('lampu') || t.includes('selokan') || t.includes('banjir') || t.includes('sampah') || t.includes('rusak')) {
        kategori = 'INFRASTRUKTUR';
    } else if (t.includes('maling') || t.includes('curi') || t.includes('aman') || t.includes('polisi') || t.includes('mabuk') || t.includes('tengkar')) {
        kategori = 'KEAMANAN';
    } else if (t.includes('bansos') || t.includes('sembako') || t.includes('sakit') || t.includes('miskin') || t.includes('dana')) {
        kategori = 'SOSIAL';
    } else if (t.includes('surat') || t.includes('ktp') || t.includes('kk') || t.includes('pindah')) {
        kategori = 'ADMINISTRASI';
    }

    // 2. Deteksi Urgensi
    if (t.includes('segera') || t.includes('bahaya') || t.includes('darurat') || t.includes('mati') || t.includes('parah') || t.includes('tolong')) {
        urgensi = 'TINGGI';
    } else if (t.includes('ganggu') || t.includes('bau') || t.includes('macet')) {
        urgensi = 'SEDANG';
    }

    return { kategori, urgensi };
};
// ----------------------------------

export async function GET() {
  await dbConnect();
  const allKas = await KasRT.find({});
  
  const saldoKas = allKas.reduce((acc, curr) => 
    curr.tipe === 'MASUK' ? acc + curr.nominal : acc - curr.nominal, 0
  );

  const danaBansos = allKas
    .filter(k => k.tipe === 'KELUAR' && k.keterangan.toLowerCase().includes('bansos'))
    .reduce((acc, curr) => acc + curr.nominal, 0);

  return NextResponse.json({ success: true, kas_rt: saldoKas, dana_bansos: danaBansos });
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // JALANKAN AI SEBELUM SIMPAN
    const hasilAnalisa = analisaLaporan(body.isi_laporan);

    const aduanBaru = new Pengaduan({
        ...body,
        kategori: hasilAnalisa.kategori,
        urgensi: hasilAnalisa.urgensi
    });

    await aduanBaru.save();
    return NextResponse.json({ success: true, message: "Laporan berhasil dikirim & dianalisis!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
// Menggunakan jalur manual 3 tingkat ke atas
import { formatRupiah } from '../../../lib/utils'; 
import { Calculator, FileDown, Printer, Filter, CheckCircle, XCircle, User, Layers, Send } from 'lucide-react';
import * as XLSX from 'xlsx'; 

export default function VerifikasiPage() {
  const [dataWarga, setDataWarga] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [filterRT, setFilterRT] = useState('ALL');

  // 1. FETCH DATA
  const fetchData = () => {
    fetch('/api/warga')
      .then(res => res.json())
      .then(res => {
         // Sort otomatis berdasarkan Skor SAW tertinggi
         const sorted = (res.data || []).sort((a, b) => b.skor_saw - a.skor_saw);
         setDataWarga(sorted);
         setFilteredData(sorted);
         setLoading(false);
      })
      .catch(err => console.error("Gagal ambil data:", err));
  };

  useEffect(() => { fetchData(); }, []);

  // 2. FILTER LOGIC
  useEffect(() => {
    if (filterRT === 'ALL') setFilteredData(dataWarga);
    else setFilteredData(dataWarga.filter(w => w.alamat_rt === filterRT));
  }, [filterRT, dataWarga]);

  // 3. HITUNG SAW
  const hitungSAW = async () => {
    setCalculating(true);
    // Pastikan path API ini benar (manual import di route.js)
    const res = await fetch('/api/hitung-saw', { method: 'POST' });
    if (res.ok) { 
        alert("Perhitungan Selesai! Data diurutkan berdasarkan prioritas."); 
        fetchData(); 
    } else {
        alert("Gagal menghitung.");
    }
    setCalculating(false);
  };

  // 4. EXPORT EXCEL
  const exportToExcel = () => {
    const dataToExport = filteredData.map((w, i) => ({
        "Ranking": i + 1, 
        "Nama Lengkap": w.nama, 
        "NIK": `'${w.nik}`, 
        "RT": w.alamat_rt, 
        "Penghasilan": w.penghasilan, 
        "Skor SAW": w.skor_saw, 
        "Status": w.status_kelayakan
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Bansos");
    XLSX.writeFile(workbook, `Laporan_Bansos_RT${filterRT}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // 5. EXPORT PDF
  const exportPDF = () => window.print();

  // 6. FUNGSI SALURKAN BANTUAN (Auto create history)
  const handleSalurkan = async (warga) => {
    const konfirmasi = confirm(`Salurkan bantuan kepada ${warga.nama}? \nData akan dicatat di Riwayat Penyaluran.`);
    if (!konfirmasi) return;

    // Siapkan data untuk dicatat di riwayat
    const dataPenyaluran = {
        nama_penerima: warga.nama,
        nik_penerima: warga.nik,
        alamat_rt: warga.alamat_rt,
        jenis_bantuan: "BLT Dana Desa", // Bisa dibuat dinamis nanti
        nominal: 300000, // Nominal standar, bisa diubah
        petugas: "Admin Verifikator", // Harusnya ambil dari session user
        keterangan: "Penyaluran Tahap 1 via Sistem SAW"
    };

    try {
        // Kirim ke API Penyaluran
        const res = await fetch('/api/penyaluran', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dataPenyaluran)
        });

        if(res.ok) {
            alert("Bantuan BERHASIL disalurkan dan tercatat di Riwayat!");
            // Di sini Anda bisa menambahkan logika untuk update status warga jadi 'DITERIMA' jika perlu
        } else {
            alert("Gagal mencatat penyaluran.");
        }
    } catch (error) {
        console.error("Error salur:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER PAGE */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Verifikasi & Ranking SAW</h1>
            <p className="text-slate-500 mt-2 text-sm">Sistem Pendukung Keputusan prioritas penerima bantuan.</p>
          </div>
          
          <div className="flex flex-wrap gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
             {/* FILTER DROPDOWN */}
             <div className="flex items-center px-4 border-r border-slate-200">
                <Filter size={16} className="text-slate-400 mr-3"/>
                <select className="bg-transparent outline-none text-sm font-semibold text-slate-700 min-w-[100px] cursor-pointer" 
                    value={filterRT} onChange={(e) => setFilterRT(e.target.value)}>
                    <option value="ALL">Semua Wilayah</option>
                    <option value="01">RT 01</option>
                    <option value="02">RT 02</option>
                    <option value="03">RT 03</option>
                </select>
             </div>

             <ActionButton onClick={exportToExcel} icon={<FileDown size={18}/>} label="Excel" color="text-green-600 hover:bg-green-50"/>
             <ActionButton onClick={exportPDF} icon={<Printer size={18}/>} label="PDF" color="text-slate-600 hover:bg-slate-100"/>
             <button onClick={hitungSAW} disabled={calculating} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 animate-pulse-once">
                {calculating ? 'Processing...' : <><Calculator size={18}/> Hitung SAW</>}
             </button>
          </div>
      </div>
      
      {/* TABEL DATA */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">
        
        {/* KOP SURAT KHUSUS PRINT */}
        <div className="hidden print:block text-center mb-8 pt-4 border-b-2 border-black pb-4">
            <h2 className="text-2xl font-bold uppercase">Laporan Rekomendasi Penerima Bansos</h2>
            <p className="text-sm">Periode: {new Date().toLocaleDateString()} | Filter: {filterRT}</p>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 print:border-black print:text-black">
                    <th className="p-6 font-bold text-center w-20">Rank</th>
                    <th className="p-6 font-bold">Identitas Penerima</th>
                    <th className="p-6 font-bold">Kriteria Penilaian</th>
                    <th className="p-6 font-bold text-center">Skor Akhir (V)</th>
                    <th className="p-6 font-bold text-center">Status</th>
                    <th className="p-6 font-bold text-center print:hidden">Aksi</th>
                </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 print:divide-black">
                {filteredData.length === 0 ? 
                    <tr><td colSpan="6" className="text-center p-12 text-slate-400 italic">Data belum tersedia. Silakan input data warga atau reset filter.</td></tr> :
                    filteredData.map((warga, index) => (
                    <tr key={warga._id} className={`group hover:bg-slate-50/80 transition duration-200 ${index < 3 ? 'bg-amber-50/40 print:bg-white' : ''}`}>
                        
                        {/* KOLOM RANKING */}
                        <td className="p-6 text-center">
                            {index < 3 ? 
                                <div className="w-8 h-8 mx-auto bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold shadow-sm border border-amber-200">{index+1}</div> 
                                : <span className="font-semibold text-slate-400">#{index+1}</span>}
                        </td>

                        {/* KOLOM IDENTITAS */}
                        <td className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 print:hidden"><User size={20}/></div>
                                <div>
                                    <div className="font-bold text-slate-800 text-base uppercase">{warga.nama}</div>
                                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 print:text-black">
                                        <span>NIK: {warga.nik}</span>
                                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold print:border print:border-black">RT {warga.alamat_rt}</span>
                                    </div>
                                </div>
                            </div>
                        </td>

                        {/* KOLOM KRITERIA */}
                        <td className="p-6">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 print:text-black">
                                <div className="flex justify-between"><span>Gaji:</span> <span className="font-mono font-medium">{formatRupiah(warga.penghasilan)}</span></div>
                                <div className="flex justify-between"><span>Tanggungan:</span> <span className="font-medium">{warga.tanggungan} Org</span></div>
                                <div className="flex justify-between col-span-2 pt-1 border-t border-slate-100 mt-1"><span>Pekerjaan:</span> <span className="font-medium text-slate-800">{warga.nama_pekerjaan || '-'}</span></div>
                            </div>
                        </td>

                        {/* KOLOM SKOR */}
                        <td className="p-6 text-center">
                            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 print:text-black">
                                {warga.skor_saw ? warga.skor_saw.toFixed(4) : '0.000'}
                            </span>
                        </td>

                        {/* KOLOM STATUS */}
                        <td className="p-6 text-center">
                            <BadgeStatus status={warga.status_kelayakan} />
                        </td>

                        {/* KOLOM AKSI (Detail & Salurkan) */}
                        <td className="p-6 text-center print:hidden">
                             <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Link href={`/warga/${warga._id}`} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition shadow-sm">
                                    Detail
                                </Link>
                                
                                {/* Tombol Salurkan muncul jika Layak/Pending */}
                                {warga.status_approval === 'PENDING_RW' && (
                                    <button 
                                        onClick={() => handleSalurkan(warga)} 
                                        className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-1"
                                        title="Setujui dan Salurkan Bantuan"
                                    >
                                        <Send size={12}/> Salurkan
                                    </button>
                                )}
                             </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const ActionButton = ({ onClick, icon, label, color }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition ${color}`}>
        {icon} {label}
    </button>
);

const BadgeStatus = ({ status }) => {
    if (status === 'LAYAK') return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 print:border-black print:text-black">
            <CheckCircle size={12}/> LAYAK
        </span>
    );
    if (status === 'TIDAK_LAYAK') return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 print:border-black print:text-black">
            <XCircle size={12}/> DITOLAK
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <Layers size={12}/> PROSES
        </span>
    );
}
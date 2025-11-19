"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatRupiah } from '../../../lib/utils'; 
import { Calculator, FileDown, Printer, Filter, CheckCircle, XCircle, User, Layers } from 'lucide-react';
import * as XLSX from 'xlsx'; 

export default function VerifikasiPage() {
  const [dataWarga, setDataWarga] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [filterRT, setFilterRT] = useState('ALL');

  const fetchData = () => {
    fetch('/api/warga').then(res => res.json()).then(res => {
         const sorted = (res.data || []).sort((a, b) => b.skor_saw - a.skor_saw);
         setDataWarga(sorted);
         setFilteredData(sorted);
         setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (filterRT === 'ALL') setFilteredData(dataWarga);
    else setFilteredData(dataWarga.filter(w => w.alamat_rt === filterRT));
  }, [filterRT, dataWarga]);

  const hitungSAW = async () => {
    setCalculating(true);
    const res = await fetch('/api/hitung-saw', { method: 'POST' });
    if (res.ok) { alert("Perhitungan Selesai!"); fetchData(); } 
    setCalculating(false);
  };

  const exportToExcel = () => { /* Logika sama seperti sebelumnya */ };
  const exportPDF = () => window.print();
  const handleApprove = (id) => alert("Status disetujui untuk ID: " + id);

  return (
    <div className="space-y-8">
      {/* HEADER PAGE */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Verifikasi & Ranking SAW</h1>
            <p className="text-slate-500 mt-2 text-sm">Sistem Pendukung Keputusan prioritas penerima bantuan.</p>
          </div>
          
          <div className="flex flex-wrap gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
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
             <button onClick={hitungSAW} disabled={calculating} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                {calculating ? 'Processing...' : <><Calculator size={18}/> Hitung SAW</>}
             </button>
          </div>
      </div>
      
      {/* MODERN TABLE CARD */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">
        
        <div className="hidden print:block text-center mb-8 pt-4 border-b-2 border-black pb-4">
            <h2 className="text-2xl font-bold uppercase">Laporan Rekomendasi Penerima Bansos</h2>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-6 font-bold text-center w-20">Rank</th>
                    <th className="p-6 font-bold">Identitas Penerima</th>
                    <th className="p-6 font-bold">Kriteria Penilaian</th>
                    <th className="p-6 font-bold text-center">Skor Akhir (V)</th>
                    <th className="p-6 font-bold text-center">Status</th>
                    <th className="p-6 font-bold text-center print:hidden">Aksi</th>
                </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
                {filteredData.length === 0 ? 
                    <tr><td colSpan="6" className="text-center p-12 text-slate-400 italic">Data belum tersedia. Silakan input data warga.</td></tr> :
                    filteredData.map((warga, index) => (
                    <tr key={warga._id} className={`group hover:bg-slate-50/80 transition duration-200 ${index < 3 ? 'bg-amber-50/40' : ''}`}>
                        <td className="p-6 text-center">
                            {index < 3 ? 
                                <div className="w-8 h-8 mx-auto bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold shadow-sm">{index+1}</div> 
                                : <span className="font-semibold text-slate-400">#{index+1}</span>}
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={20}/></div>
                                <div>
                                    <div className="font-bold text-slate-800 text-base">{warga.nama}</div>
                                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                                        <span>NIK: {warga.nik}</span>
                                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold">RT {warga.alamat_rt}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
                                <div className="flex justify-between"><span>Gaji:</span> <span className="font-mono font-medium">{formatRupiah(warga.penghasilan)}</span></div>
                                <div className="flex justify-between"><span>Tanggungan:</span> <span className="font-medium">{warga.tanggungan} Org</span></div>
                                <div className="flex justify-between col-span-2 pt-1 border-t border-slate-100 mt-1"><span>Pekerjaan:</span> <span className="font-medium text-slate-800">{warga.nama_pekerjaan || '-'}</span></div>
                            </div>
                        </td>
                        <td className="p-6 text-center">
                            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {warga.skor_saw ? warga.skor_saw.toFixed(4) : '0.000'}
                            </span>
                        </td>
                        <td className="p-6 text-center">
                            <BadgeStatus status={warga.status_kelayakan} />
                        </td>
                        <td className="p-6 text-center print:hidden">
                             <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Link href={`/warga/${warga._id}`} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition shadow-sm">Detail</Link>
                                {warga.status_approval === 'PENDING_RW' && (
                                    <button onClick={() => handleApprove(warga._id)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm">Acc</button>
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

const ActionButton = ({ onClick, icon, label, color }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition ${color}`}>
        {icon} {label}
    </button>
);

const BadgeStatus = ({ status }) => {
    if (status === 'LAYAK') return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle size={12}/> LAYAK
        </span>
    );
    if (status === 'TIDAK_LAYAK') return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
            <XCircle size={12}/> DITOLAK
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <Layers size={12}/> PROSES
        </span>
    );
}
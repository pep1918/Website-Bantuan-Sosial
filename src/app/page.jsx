"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, Wallet, Megaphone, ArrowRight, Banknote } from 'lucide-react';

// Fungsi format rupiah manual (jika di utils belum export)
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function LandingPage() {
  // State untuk data uang & laporan
  const [stats, setStats] = useState({ kas_rt: 0, dana_bansos: 0 });
  const [laporan, setLaporan] = useState({ nama_pelapor: '', rt_tujuan: '01', isi_laporan: '' });
  const [loading, setLoading] = useState(false);

  // Ambil data uang saat website dibuka
  useEffect(() => {
    fetch('/api/public')
      .then(res => res.json())
      .then(data => {
        if(data.success) setStats({ kas_rt: data.kas_rt, dana_bansos: data.dana_bansos });
      });
  }, []);

  // Fungsi Kirim Laporan
  const handleKirimLaporan = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch('/api/public', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(laporan)
    });

    if(res.ok) {
      alert("Terima kasih! Laporan Anda berhasil dikirim ke Ketua RT.");
      setLaporan({ nama_pelapor: '', rt_tujuan: '01', isi_laporan: '' }); // Reset form
    } else {
      alert("Gagal mengirim laporan.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
               <ShieldCheck /> DESA MAJU JAYA
            </div>
            {/* PERBAIKAN LINK LOGIN: Karena folder Anda (auth)/login, maka linknya /login */}
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition">
              Login Petugas <ArrowRight size={16}/>
            </Link>
        </div>
      </nav>

      {/* HEADER BESAR */}
      <header className="bg-slate-900 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Transparansi & Pelayanan Warga</h1>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8">Pantau dana sosial dan sampaikan aspirasi Anda langsung ke pengurus RT.</p>
      </header>

      {/* KOTAK TRANSPARANSI DANA (Penting untuk Warga) */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <StatCard icon={<Wallet size={32} />} label="Sisa Kas RT" value={formatRupiah(stats.kas_rt)} color="bg-emerald-500" />
        <StatCard icon={<Banknote size={32} />} label="Dana Bansos Tersalurkan" value={formatRupiah(stats.dana_bansos)} color="bg-blue-500" />
        <StatCard icon={<Users size={32} />} label="Penerima Bantuan" value="Data Terupdate" color="bg-orange-500" />
      </div>

      {/* FORMULIR PENGADUAN / KELUH KESAH */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
         <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Megaphone className="text-blue-600"/> Sampaikan Keluhan / Aspirasi
            </h2>
            
            <form onSubmit={handleKirimLaporan} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama (Opsional)</label>
                        <input type="text" placeholder="Boleh dikosongkan" className="w-full p-3 rounded-lg border bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={e => setLaporan({...laporan, nama_pelapor: e.target.value})} value={laporan.nama_pelapor} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kirim ke</label>
                        <select className="w-full p-3 rounded-lg border bg-slate-50 outline-none"
                            onChange={e => setLaporan({...laporan, rt_tujuan: e.target.value})}>
                            <option value="01">Ketua RT 01</option>
                            <option value="02">Ketua RT 02</option>
                            <option value="03">Ketua RT 03</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Isi Laporan</label>
                    <textarea rows="4" required placeholder="Tuliskan keluhan atau masukan Anda di sini..." 
                        className="w-full p-3 rounded-lg border bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setLaporan({...laporan, isi_laporan: e.target.value})} value={laporan.isi_laporan}></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition">
                    {loading ? 'Sedang Mengirim...' : 'Kirim Laporan'}
                </button>
            </form>
         </div>
      </section>
    </div>
  );
}

// Komponen Kecil untuk Kartu
const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-b-4 border-slate-100 flex flex-col items-center text-center">
        <div className={`p-3 rounded-full text-white mb-3 ${color}`}>{icon}</div>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <p className="text-slate-500 text-sm">{label}</p>
    </div>
);
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
// PERBAIKAN: Sudah ditambahkan 'Activity' di sini
import { ShieldCheck, Wallet, Megaphone, ArrowRight, Banknote, Users, X, Loader2, Calendar, Activity } from 'lucide-react';

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function LandingPage() {
  const [stats, setStats] = useState({ kas_rt: 0, dana_bansos: 0, total_penerima: 0 });
  const [laporan, setLaporan] = useState({ nama_pelapor: '', rt_tujuan: '01', isi_laporan: '' });
  const [loading, setLoading] = useState(false);

  // STATE UNTUK MODAL DETAIL
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', type: '', data: [] });
  const [loadingModal, setLoadingModal] = useState(false);

  // 1. Fetch Data Ringkasan Awal
  useEffect(() => {
    fetch('/api/public').then(res => res.json()).then(data => {
        if(data.success) {
            setStats({ 
                kas_rt: data.kas_rt, 
                dana_bansos: data.dana_bansos, 
                total_penerima: data.total_penerima 
            });
        }
      });
  }, []);

  // 2. Fungsi Buka Detail (Saat Kartu Diklik)
  const openDetail = async (type, title) => {
    setShowModal(true);
    setModalContent({ title, type, data: [] });
    setLoadingModal(true);

    try {
        const res = await fetch(`/api/public?type=${type}`);
        const result = await res.json();
        if(result.success) {
            setModalContent({ title, type, data: result.data });
        }
    } catch (error) {
        console.error("Gagal ambil detail");
    }
    setLoadingModal(false);
  };

  // 3. Kirim Laporan
  const handleKirimLaporan = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/public', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(laporan)
    });
    if(res.ok) {
      alert("Laporan terkirim! Terima kasih.");
      setLaporan({ nama_pelapor: '', rt_tujuan: '01', isi_laporan: '' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden relative">
      
      {/* BACKGROUND GLOW */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                 <ShieldCheck className="text-white" size={24} />
               </div>
               <span className="font-bold text-xl text-white tracking-tight">DESA MAJU JAYA</span>
            </div>
            <Link href="/login" className="group bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 border border-white/10">
              Login Petugas <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-32 pb-20 px-6 text-center relative">
        <div className="max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest mb-6 uppercase">
                Sistem Informasi Desa Terpadu
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Transparansi Dana & <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Pelayanan Warga Digital</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Pantau dana sosial, sampaikan aspirasi, dan akses layanan desa secara *real-time*. Klik kartu di bawah untuk melihat detail laporan.
            </p>
        </div>
      </header>

      {/* STATS CARDS (CLICKABLE) */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* KARTU KAS RT */}
            <div onClick={() => openDetail('kas', 'Laporan Kas RT (10 Terakhir)')} className="cursor-pointer">
                <StatCard 
                    icon={<Wallet size={32} className="text-emerald-400"/>} 
                    label="Total Kas RT (Aktif)" 
                    value={formatRupiah(stats.kas_rt)} 
                    desc="Klik untuk lihat detail transaksi"
                    gradient="from-emerald-500/20 to-emerald-900/20"
                    border="border-emerald-500/30"
                />
            </div>
            
            {/* KARTU BANSOS */}
            <div onClick={() => openDetail('penyaluran', 'Riwayat Penyaluran Bantuan')} className="cursor-pointer">
                <StatCard 
                    icon={<Banknote size={32} className="text-blue-400"/>} 
                    label="Dana Bansos Tersalurkan" 
                    value={formatRupiah(stats.dana_bansos)}  
                    desc="Klik untuk lihat penerima bantuan"
                    gradient="from-blue-500/20 to-blue-900/20"
                    border="border-blue-500/30"
                />
            </div>

            {/* KARTU PENERIMA */}
            <div onClick={() => openDetail('penyaluran', 'Daftar Penerima Bantuan')} className="cursor-pointer">
                <StatCard 
                    icon={<Users size={32} className="text-orange-400"/>} 
                    label="Penerima Bantuan" 
                    value={`${stats.total_penerima} Warga`} 
                    desc="Total warga yang telah menerima"
                    gradient="from-orange-500/20 to-orange-900/20"
                    border="border-orange-500/30"
                />
            </div>
        </div>
      </div>

      {/* MODAL / POPUP DETAIL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div className="bg-[#1e293b] w-full max-w-3xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calendar size={20} className="text-blue-400"/> {modalContent.title}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-700 rounded-full transition text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loadingModal ? (
                        <div className="flex justify-center py-10 text-blue-400"><Loader2 size={40} className="animate-spin"/></div>
                    ) : modalContent.data.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">Belum ada data untuk ditampilkan.</div>
                    ) : (
                        <div className="space-y-3">
                            {modalContent.type === 'kas' ? (
                                // LIST DATA KAS
                                modalContent.data.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                        <div>
                                            <p className="font-bold text-slate-200">{item.keterangan}</p>
                                            <p className="text-xs text-slate-500">{new Date(item.tanggal).toLocaleDateString('id-ID', {dateStyle:'full'})}</p>
                                        </div>
                                        <span className={`font-mono font-bold ${item.tipe === 'MASUK' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {item.tipe === 'MASUK' ? '+' : '-'} {formatRupiah(item.nominal)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                // LIST DATA PENYALURAN
                                modalContent.data.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                                {item.nama_penerima.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200">{item.nama_penerima}</p>
                                                <p className="text-xs text-slate-500">RT {item.alamat_rt} • {item.jenis_bantuan}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-mono font-bold text-emerald-400">{formatRupiah(item.nominal)}</span>
                                            <span className="text-[10px] text-slate-500">{new Date(item.tanggal_salur).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
                
                {/* Modal Footer */}
                <div className="p-4 bg-slate-800/50 border-t border-slate-700 text-center">
                    <p className="text-xs text-slate-500">Data ditampilkan secara transparan dari sistem desa.</p>
                </div>
            </div>
        </div>
      )}

      {/* LAYANAN PENGADUAN */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800">
         <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Megaphone size={24} />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">Suara Anda Didengar</h2>
                <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                    Jangan ragu menyampaikan keluhan lingkungan, kerusakan fasilitas, atau pertanyaan seputar bansos. Identitas pelapor dijamin aman.
                </p>
                <div className="space-y-4">
                    <FeatureItem text="Laporan langsung ke Ketua RT" />
                    <FeatureItem text="Monitoring status penyelesaian" />
                    <FeatureItem text="Respon cepat 1x24 Jam" />
                </div>
            </div>

            <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
                <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Formulir Aspirasi</h3>
                <form onSubmit={handleKirimLaporan} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Nama (Opsional)" placeholder="Hamba Allah" 
                            onChange={e => setLaporan({...laporan, nama_pelapor: e.target.value})} />
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Tujuan</label>
                            <select className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                                onChange={e => setLaporan({...laporan, rt_tujuan: e.target.value})}>
                                <option value="01">Pengurus RT 01</option>
                                <option value="02">Pengurus RT 02</option>
                                <option value="03">Pengurus RT 03</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Isi Laporan</label>
                        <textarea rows="4" required className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                            placeholder="Jelaskan detail laporan Anda..."
                            onChange={e => setLaporan({...laporan, isi_laporan: e.target.value})} value={laporan.isi_laporan}></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2">
                        {loading ? 'Mengirim...' : 'Kirim Laporan Sekarang'} <ArrowRight size={18}/>
                    </button>
                </form>
            </div>
         </div>
      </section>

      <footer className="bg-[#0f172a] py-8 text-center border-t border-slate-800">
        <p className="text-slate-500 text-sm">&copy; 2025 Sistem Informasi Desa Maju Jaya. <span className="text-slate-700 mx-2">|</span> Transparency for All.</p>
      </footer>
    </div>
  );
}

// COMPONENT CARD
const StatCard = ({ icon, label, value, desc, gradient, border }) => (
    <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${gradient} border ${border} backdrop-blur-xl overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300`}>
        <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:scale-110 transition-transform duration-500">{icon}</div>
        <div className="relative z-10">
            <h3 className="text-4xl font-extrabold text-white mb-1">{value}</h3>
            <p className="text-slate-300 font-medium mb-4">{label}</p>
            <div className="inline-flex items-center gap-1 text-xs text-white/60 bg-white/10 px-3 py-1 rounded-full group-hover:bg-white/20 transition-colors">
                <Activity size={12} /> {desc}
            </div>
        </div>
    </div>
);

const FeatureItem = ({ text }) => (
    <div className="flex items-center gap-3 text-slate-300">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <p>{text}</p>
    </div>
);

const InputGroup = ({ label, placeholder, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{label}</label>
        <input type="text" className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder={placeholder} onChange={onChange} />
    </div>
);
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Wallet, Megaphone, ArrowRight, Banknote, Users, Activity } from 'lucide-react';

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function LandingPage() {
  const [stats, setStats] = useState({ kas_rt: 0, dana_bansos: 0 });
  const [laporan, setLaporan] = useState({ nama_pelapor: '', rt_tujuan: '01', isi_laporan: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/public').then(res => res.json()).then(data => {
        if(data.success) setStats({ kas_rt: data.kas_rt, dana_bansos: data.dana_bansos });
      });
  }, []);

  const handleKirimLaporan = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/public', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(laporan)
    });
    if(res.ok) {
      alert("Laporan terkirim! Terima kasih atas partisipasi Anda.");
      setLaporan({ nama_pelapor: '', rt_tujuan: '01', isi_laporan: '' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* BACKGROUND GLOW EFFECTS */}
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

      {/* HERO SECTION */}
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
                Pantau dana sosial, sampaikan aspirasi, dan akses layanan desa secara *real-time*. Membangun desa yang jujur, adil, dan makmur.
            </p>
        </div>
      </header>

      {/* STATS CARDS (Glassmorphism) */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                icon={<Wallet size={32} className="text-emerald-400"/>} 
                label="Total Kas RT (Aktif)" 
                value={formatRupiah(stats.kas_rt)} 
                desc="Dana operasional warga terkini"
                gradient="from-emerald-500/20 to-emerald-900/20"
                border="border-emerald-500/30"
            />
            <StatCard 
                icon={<Banknote size={32} className="text-blue-400"/>} 
                label="Dana Bansos Tersalurkan" 
                value={formatRupiah(stats.dana_bansos)} 
                desc="Total bantuan tahun 2024"
                gradient="from-blue-500/20 to-blue-900/20"
                border="border-blue-500/30"
            />
             <StatCard 
                icon={<Users size={32} className="text-orange-400"/>} 
                label="Penerima Bantuan" 
                value="Data Terupdate" 
                desc="Verifikasi transparan via sistem"
                gradient="from-orange-500/20 to-orange-900/20"
                border="border-orange-500/30"
            />
        </div>
      </div>

      {/* LAYANAN PENGADUAN (Dark Mode Form) */}
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
        <p className="text-slate-500 text-sm">&copy; 2025 Sistem Informasi Desa Maju Jaya.</p>
      </footer>
    </div>
  );
}

const StatCard = ({ icon, label, value, desc, gradient, border }) => (
    <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${gradient} border ${border} backdrop-blur-xl overflow-hidden group hover:-translate-y-2 transition-all duration-300`}>
        <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:scale-110 transition-transform duration-500">{icon}</div>
        <div className="relative z-10">
            <h3 className="text-4xl font-extrabold text-white mb-1">{value}</h3>
            <p className="text-slate-300 font-medium mb-4">{label}</p>
            <div className="inline-flex items-center gap-1 text-xs text-white/60 bg-white/10 px-3 py-1 rounded-full">
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
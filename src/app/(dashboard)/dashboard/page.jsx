"use client";
import { useEffect, useState } from 'react';
import { Users, Wallet, CheckCircle, Activity, Megaphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Gunakan jalur manual 3 tingkat
import { formatRupiah } from '../../../lib/utils';

export default function DashboardPage() {
  // State Data Real-time (Ada tambahan aduan)
  const [stats, setStats] = useState({ total: 0, layak: 0, pending: 0, kas: 0, aduan: 0 });
  const [user, setUser] = useState('Petugas');

  // Dummy Data untuk Grafik (Visualisasi)
  const chartData = [
    { name: 'RT 01', total: 45, layak: 30 },
    { name: 'RT 02', total: 32, layak: 20 },
    { name: 'RT 03', total: 28, layak: 15 },
    { name: 'RT 04', total: 19, layak: 12 },
  ];

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) setUser(JSON.parse(session).name);

    // FETCH DATA REAL DARI API
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
          // Update state dengan data asli dari database
          setStats({
              total: data.total || 0,
              layak: data.layak || 0,
              pending: data.pending || 0,
              kas: data.kas || 0,
              aduan: data.aduan || 0
          });
      })
      .catch(err => console.error("Gagal ambil stats:", err));
  }, []);

  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8">
      {/* GREETING HEADER */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col md:flex-row justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-800">Halo, {user} 👋</h1>
            <p className="text-slate-500 mt-2 text-sm">{currentDate} &bull; Pantau data desa secara real-time.</p>
        </div>
        <div className="mt-4 md:mt-0">
            <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100 animate-pulse">
                Status Sistem: Online 🟢
            </span>
        </div>
      </div>

      {/* STATS GRID (5 KARTU) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <ModernCard title="Total Warga" value={stats.total} icon={<Users size={24} className="text-white"/>} color="bg-blue-500" />
        <ModernCard title="Kas RT" value={formatRupiah(stats.kas)} icon={<Wallet size={24} className="text-white"/>} color="bg-emerald-500" isMoney />
        <ModernCard title="Layak Bansos" value={stats.layak} icon={<CheckCircle size={24} className="text-white"/>} color="bg-violet-500" />
        <ModernCard title="Proses Validasi" value={stats.pending} icon={<Activity size={24} className="text-white"/>} color="bg-orange-400" />
        <ModernCard title="Aspirasi Baru" value={stats.aduan} icon={<Megaphone size={24} className="text-white"/>} color="bg-pink-500" />
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg mb-6">Sebaran Penerima per Wilayah</h3>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}} cursor={{fill: '#f8fafc'}}/>
                        <Bar dataKey="total" name="Total Warga" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="layak" name="Layak" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* INFO CARD */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-30"></div>
            <div>
                <h3 className="font-bold text-xl mb-2">Info Sistem SAW</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Sistem otomatis menghitung ranking kelayakan berdasarkan:
                </p>
                <ul className="text-sm text-slate-300 mt-4 space-y-2 list-disc pl-5">
                    <li>Penghasilan (50%)</li>
                    <li>Tanggungan (30%)</li>
                    <li>Pekerjaan (20%)</li>
                </ul>
            </div>
            <button className="mt-6 w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-bold transition backdrop-blur-md border border-white/10">
                Lihat Detail Perhitungan
            </button>
        </div>
      </div>
    </div>
  );
}

// Komponen Kartu Modern
const ModernCard = ({ title, value, icon, color, isMoney }) => (
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl shadow-md ${color}`}>
                {icon}
            </div>
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            {/* Ukuran font menyesuaikan panjang angka */}
            <h3 className={`font-extrabold text-slate-800 ${isMoney && String(value).length > 10 ? 'text-xl' : 'text-3xl'}`}>
                {value}
            </h3>
        </div>
    </div>
);
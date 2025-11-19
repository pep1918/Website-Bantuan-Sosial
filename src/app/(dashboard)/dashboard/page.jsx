"use client";
import { useEffect, useState } from 'react';
import { Users, Wallet, CheckCircle, Activity, Megaphone, TrendingUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRupiah } from '../../../lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, layak: 0, pending: 0, kas: 0, aduan: 0 });
  const [user, setUser] = useState('Petugas');

  // Data Dummy Grafik (Agar terlihat penuh)
  const chartData = [
    { name: 'RT 01', total: 45, layak: 30 },
    { name: 'RT 02', total: 32, layak: 20 },
    { name: 'RT 03', total: 28, layak: 15 },
    { name: 'RT 04', total: 50, layak: 35 },
    { name: 'RT 05', total: 20, layak: 10 },
  ];

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) setUser(JSON.parse(session).name);

    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
          setStats({
              total: data.total || 0,
              layak: data.layak || 0,
              pending: data.pending || 0,
              kas: data.kas || 0,
              aduan: data.aduan || 0
          });
      })
      .catch(err => console.error(err));
  }, []);

  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-10">
      
      {/* 1. HERO WELCOME HEADER (Lebih Besar) */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden flex flex-col md:flex-row justify-between items-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="relative z-10">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Halo, {user} 👋</h1>
            <p className="text-slate-500 mt-3 text-lg font-medium">{currentDate}</p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0">
            <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600 font-bold text-sm uppercase tracking-wider">System Online</span>
            </div>
        </div>
      </div>

      {/* 2. STATS CARDS (Grid Responsif Besar) */}
      {/* Di layar besar (xl) bagi 3 kolom, baris kedua 2 kolom. Agar kartu LEBAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        
        <BigCard 
            title="Total Warga" 
            value={stats.total} 
            icon={<Users size={32} className="text-white"/>} 
            color="bg-blue-600" 
            desc="Terdata dalam sistem"
        />
        
        <BigCard 
            title="Saldo Kas RT" 
            value={formatRupiah(stats.kas)} 
            icon={<Wallet size={32} className="text-white"/>} 
            color="bg-emerald-600" 
            desc="Dana operasional aktif"
            isMoney
        />
        
        <BigCard 
            title="Layak Bansos" 
            value={stats.layak} 
            icon={<CheckCircle size={32} className="text-white"/>} 
            color="bg-violet-600" 
            desc="Rekomendasi sistem SAW"
        />

        <BigCard 
            title="Menunggu Validasi" 
            value={stats.pending} 
            icon={<Activity size={32} className="text-white"/>} 
            color="bg-orange-500" 
            desc="Data warga belum dicek RW"
        />

        <BigCard 
            title="Aspirasi Baru" 
            value={stats.aduan} 
            icon={<Megaphone size={32} className="text-white"/>} 
            color="bg-pink-500" 
            desc="Pesan masuk minggu ini"
        />
        
        {/* Kartu Pintasan Cepat */}
        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 flex flex-col justify-center items-start hover:shadow-xl transition-all group cursor-pointer">
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Input Data Baru</h3>
            <p className="text-slate-400 mb-4">Tambahkan data warga...</p>
            <div className="p-3 bg-blue-50 rounded-full text-blue-600 group-hover:translate-x-2 transition-transform">
                <ArrowRight size={24}/>
            </div>
        </div>
      </div>

      {/* 3. CHART & INFO SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* GRAFIK (Lebih Lebar) */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Statistik Sebaran</h3>
                    <p className="text-slate-400">Perbandingan total warga vs penerima layak</p>
                </div>
            </div>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 14, fontWeight: 600}} dy={10}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', padding: '12px'}}
                        />
                        <Bar dataKey="total" name="Total Populasi" fill="#cbd5e1" radius={[6, 6, 6, 6]} barSize={40} />
                        <Bar dataKey="layak" name="Layak Terima" fill="#4f46e5" radius={[6, 6, 6, 6]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* PANEL INFORMASI (Lebih Tinggi) */}
        <div className="bg-[#1e293b] p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-center">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
            
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-4">Algoritma SAW</h3>
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-xl font-bold text-indigo-300">50%</div>
                        <div>
                            <h4 className="font-bold text-lg">Penghasilan</h4>
                            <p className="text-slate-400 text-sm">Prioritas pada penghasilan rendah.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-xl font-bold text-emerald-300">30%</div>
                        <div>
                            <h4 className="font-bold text-lg">Tanggungan</h4>
                            <p className="text-slate-400 text-sm">Semakin banyak tanggungan, skor naik.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-xl font-bold text-orange-300">20%</div>
                        <div>
                            <h4 className="font-bold text-lg">Pekerjaan</h4>
                            <p className="text-slate-400 text-sm">Pekerjaan tidak tetap diprioritaskan.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

// Component Kartu Besar (Big Card)
const BigCard = ({ title, value, icon, color, desc, isMoney }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl shadow-lg ${color} transform group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
                <TrendingUp size={14} className="text-emerald-500"/>
                <span className="text-xs font-bold text-emerald-600">+2.4%</span>
            </div>
        </div>
        <div>
            <h3 className={`font-black text-slate-800 mb-1 tracking-tight ${isMoney ? 'text-3xl' : 'text-5xl'}`}>
                {value}
            </h3>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mb-2">{title}</p>
            <p className="text-xs text-slate-400 font-medium">{desc}</p>
        </div>
    </div>
);
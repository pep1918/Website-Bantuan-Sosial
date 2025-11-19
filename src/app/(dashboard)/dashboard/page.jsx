"use client";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, CheckCircle, XCircle, Banknote } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, layak: 0, ditolak: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data real dari API
    async function fetchData() {
      try {
        const res = await fetch('/api/warga');
        const { data } = await res.json();
        
        setStats({
            total: data.length,
            layak: data.filter(w => w.status_kelayakan === 'LAYAK').length,
            ditolak: data.filter(w => w.status_kelayakan === 'TIDAK_LAYAK').length,
            pending: data.filter(w => w.status_approval === 'PENDING_RW').length
        });
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    fetchData();
  }, []);

  const dataPie = [
    { name: 'Layak', value: stats.layak },
    { name: 'Tidak Layak', value: stats.ditolak },
  ];
  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Statistik Desa</h1>
        <p className="text-slate-500 mt-1">Monitoring real-time data sosial ekonomi warga.</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Terdata" value={stats.total} icon={<Users />} color="bg-blue-500" />
        <StatCard title="Lolos Verifikasi" value={stats.layak} icon={<CheckCircle />} color="bg-green-500" />
        <StatCard title="Ditolak Sistem" value={stats.ditolak} icon={<XCircle />} color="bg-red-500" />
        <StatCard title="Pending RW" value={stats.pending} icon={<Banknote />} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4">Distribusi Kelayakan Ekonomi</h3>
          <div className="h-[300px] flex justify-center items-center">
            {stats.total === 0 ? <p className="text-slate-400">Belum ada data</p> : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {dataPie.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-lg mb-2">Panduan Sistem</h3>
            <p className="text-slate-500 mb-4">Sistem otomatis menolak jika gaji &gt; 3 Juta.</p>
            <div className="w-full bg-slate-50 p-4 rounded-lg text-left text-sm space-y-2">
                <p>✅ <b>Hijau:</b> Layak menerima bantuan.</p>
                <p>🔴 <b>Merah:</b> Tidak layak (Ekonomi Mampu).</p>
            </div>
         </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
    </div>
    <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-slate-200`}>
      {icon}
    </div>
  </div>
);
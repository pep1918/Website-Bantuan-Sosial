"use client";
import { useEffect, useState } from 'react';
import { MessageSquare, User, Clock } from 'lucide-react';

export default function AspirasiPage() {
  const [aspirasi, setAspirasi] = useState([]);

  useEffect(() => {
    fetch('/api/aspirasi').then(r => r.json()).then(r => setAspirasi(r.data || []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800">Kotak Aspirasi Warga</h1>
            <p className="text-slate-500 mt-2">Pesan dan laporan yang masuk dari halaman publik.</p>
        </div>

        <div className="space-y-4">
            {aspirasi.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-200 text-slate-400">
                    Belum ada aspirasi yang masuk.
                </div>
            ) : (
                aspirasi.map((item) => (
                    <div key={item._id} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    <User size={20}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.nama_pelapor || 'Anonim'}</h4>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">Kepada: RT {item.rt_tujuan}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock size={14}/>
                                {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed italic border-l-4 border-blue-500">
                            "{item.isi_laporan}"
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
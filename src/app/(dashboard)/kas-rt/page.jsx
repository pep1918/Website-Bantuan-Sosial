"use client";
import { useState, useEffect } from 'react';
import { formatRupiah } from '../../../lib/utils';
// Tambahkan icon Trash2 untuk tombol hapus
import { Trash2, Loader2 } from 'lucide-react'; 

export default function KasRTPage() {
    const [kas, setKas] = useState([]);
    const [form, setForm] = useState({ tipe: 'MASUK', nominal: '', keterangan: '' });
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null); // State untuk loading saat menghapus

    // Fetch Data
    const fetchKas = () => fetch('/api/kas')
        .then(r => r.json())
        .then(r => setKas(r.data || []));
    
    useEffect(() => { fetchKas() }, []);

    // Handle Submit (Tambah)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        await fetch('/api/kas', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form) 
        });
        
        setForm({ tipe: 'MASUK', nominal: '', keterangan: '' }); 
        fetchKas(); 
        setLoading(false);
    };

    // === FUNGSI BARU: HAPUS DATA ===
    const handleDelete = async (id) => {
        // Konfirmasi dulu biar gak salah klik
        if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

        setDeletingId(id); // Nyalakan loading di tombol hapus spesifik

        try {
            const res = await fetch(`/api/kas?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchKas(); // Refresh tabel otomatis
            } else {
                alert("Gagal menghapus data");
            }
        } catch (error) {
            alert("Terjadi kesalahan sistem");
        }
        setDeletingId(null); // Matikan loading
    };

    // Hitung Saldo
    const saldo = kas.reduce((acc, curr) => curr.tipe === 'MASUK' ? acc + curr.nominal : acc - curr.nominal, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* KOLOM KIRI: TABEL & SALDO */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Buku Kas RT</h1>
                        <p className="text-slate-500 text-sm">Pencatatan keuangan transparan</p>
                    </div>
                    <div className={`px-6 py-3 rounded-xl shadow-lg text-right text-white ${saldo >= 0 ? 'bg-emerald-600' : 'bg-red-600'}`}>
                        <p className="text-xs opacity-80 uppercase tracking-wider">Saldo Saat Ini</p>
                        <p className="text-2xl font-bold">{formatRupiah(saldo)}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b font-bold text-slate-600 flex justify-between items-center">
                        <span>Riwayat Transaksi</span>
                        <span className="text-xs font-normal text-slate-400">Total: {kas.length} Transaksi</span>
                    </div>
                    
                    <div className="max-h-[600px] overflow-y-auto">
                        {kas.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">Belum ada data transaksi.</div>
                        ) : (
                            kas.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 border-b last:border-0 hover:bg-slate-50 transition group">
                                    {/* Info Transaksi */}
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-700">{item.keterangan}</p>
                                        <p className="text-xs text-slate-400">{new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>

                                    {/* Nominal & Tombol Hapus */}
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold px-3 py-1 rounded-lg text-sm ${item.tipe === 'MASUK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.tipe === 'MASUK' ? '+' : '-'} {formatRupiah(item.nominal)}
                                        </span>
                                        
                                        {/* Tombol Delete (Hanya muncul saat hover atau di mobile) */}
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            disabled={deletingId === item._id}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            title="Hapus Data"
                                        >
                                            {deletingId === item._id ? (
                                                <Loader2 size={18} className="animate-spin text-red-500" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* KOLOM KANAN: FORM INPUT */}
            <div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Catat Transaksi Baru</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Transaksi</label>
                            <select className="w-full p-3 rounded-lg border bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" 
                                value={form.tipe} onChange={e=>setForm({...form, tipe: e.target.value})}>
                                <option value="MASUK">🟢 Pemasukan (Iuran/Donasi)</option>
                                <option value="KELUAR">🔴 Pengeluaran (Bansos/Ops)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
                            <input type="number" placeholder="0" className="w-full p-3 rounded-lg border bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" 
                                value={form.nominal} onChange={e=>setForm({...form, nominal: e.target.value})} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
                            <textarea placeholder="Contoh: Iuran Warga Bulan Mei" className="w-full p-3 rounded-lg border bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" rows="3"
                                value={form.keterangan} onChange={e=>setForm({...form, keterangan: e.target.value})} required />
                        </div>

                        <button disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-md">
                            {loading ? 'Menyimpan...' : 'Catat Transaksi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
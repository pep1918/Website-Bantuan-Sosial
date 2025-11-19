"use client";
import { useState, useEffect } from 'react';
// PERBAIKAN DI SINI: Gunakan ../../../ agar file utils pasti ketemu
import { formatRupiah, cekKelayakanBansos } from '../../../lib/utils';
import { Save, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InputPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '', nik: '', alamat_rt: '01', penghasilan: '', tanggungan: ''
  });
  
  const [statusSystem, setStatusSystem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Real-time Logic Calculator
  useEffect(() => {
    if (formData.penghasilan) {
      const result = cekKelayakanBansos(Number(formData.penghasilan));
      setStatusSystem(result);
    } else {
      setStatusSystem(null);
    }
  }, [formData.penghasilan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/warga', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert('Data berhasil disimpan!');
      router.push('/dashboard');
    } else {
      alert('Gagal menyimpan data.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Input Data Calon Penerima (Level RT)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM INPUT */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label-text">Nama Lengkap</label>
                    <input type="text" required className="input-field" 
                        onChange={(e) => setFormData({...formData, nama: e.target.value})} />
                </div>
                <div>
                    <label className="label-text">NIK (KTP)</label>
                    <input type="text" required className="input-field" 
                        onChange={(e) => setFormData({...formData, nik: e.target.value})} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label-text">Penghasilan Bulanan (Rp)</label>
                    <input type="number" required className="input-field" placeholder="Contoh: 2500000"
                        onChange={(e) => setFormData({...formData, penghasilan: e.target.value})} />
                </div>
                <div>
                    <label className="label-text">Jumlah Tanggungan</label>
                    <input type="number" required className="input-field" 
                        onChange={(e) => setFormData({...formData, tanggungan: e.target.value})} />
                </div>
            </div>

            <div>
                <label className="label-text">Alamat RT</label>
                <select className="input-field" onChange={(e) => setFormData({...formData, alamat_rt: e.target.value})}>
                    <option value="01">RT 01</option>
                    <option value="02">RT 02</option>
                    <option value="03">RT 03</option>
                </select>
            </div>

            <div className="pt-4">
                <button type="submit" disabled={loading || statusSystem?.status === 'TIDAK_LAYAK'}
                    className={`w-full py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 shadow-md transition-all
                    ${statusSystem?.status === 'TIDAK_LAYAK' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                    `}>
                    {loading ? 'Menyimpan...' : <><Save size={20}/> Simpan Data</>}
                </button>
            </div>
          </form>
        </div>

        {/* SIDEBAR ANALISA SYSTEM */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-6">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                    <AlertTriangle className="text-yellow-500" size={20}/> Analisis Sistem
                </h3>
                
                <div className="mb-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Input Gaji</p>
                    <p className="text-2xl font-bold text-slate-800">
                        {formData.penghasilan ? formatRupiah(formData.penghasilan) : 'Rp 0'}
                    </p>
                </div>

                {statusSystem ? (
                    <div className={`p-4 rounded-xl border animate-pulse-once ${statusSystem.color}`}>
                        <div className="flex items-start gap-3">
                            {statusSystem.status === 'LAYAK' ? <CheckCircle size={24}/> : <XCircle size={24}/>}
                            <div>
                                <p className="font-bold text-sm">{statusSystem.label}</p>
                                <p className="text-xs mt-1 leading-relaxed opacity-90">{statusSystem.message}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500 text-center italic">
                        Masukkan nominal gaji untuk melihat analisis kelayakan.
                    </div>
                )}

                <div className="mt-4 text-xs text-slate-400 border-t pt-4">
                    * Sistem otomatis memblokir tombol simpan jika status <span className="text-red-500 font-bold">TIDAK LAYAK</span>.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
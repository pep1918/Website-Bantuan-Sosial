"use client";
import { useEffect, useState } from 'react';

// PERBAIKAN: Gunakan jalur manual agar pasti ketemu
import { formatRupiah } from '../../../lib/utils';

export default function VerifikasiPage() {
  const [dataWarga, setDataWarga] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari API
  const fetchData = () => {
    fetch('/api/warga')
      .then(res => res.json())
      .then(res => {
        setDataWarga(res.data || []);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi Verifikasi / Approval
  const handleApprove = async (id) => {
    // Di sini nanti bisa ditambahkan API untuk update status
    alert("Fitur Approval akan mengupdate status warga ID: " + id);
    // Implementasi update status ke database bisa ditambahkan nanti
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Verifikasi Data (Role RW/Admin)</h1>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3">Nama / NIK</th>
              <th className="px-6 py-3">Penghasilan</th>
              <th className="px-6 py-3">Status Sistem</th>
              <th className="px-6 py-3">Status Approval</th>
              <th className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" className="text-center p-4">Memuat data...</td></tr>
            ) : dataWarga.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">Belum ada data masuk</td></tr>
            ) : (
                dataWarga.map((warga) => (
                <tr key={warga._id} className="bg-white border-b hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                        {warga.nama}<br/>
                        <span className="text-xs text-slate-400">{warga.nik}</span>
                    </td>
                    <td className="px-6 py-4">{formatRupiah(warga.penghasilan)}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${warga.status_kelayakan === 'LAYAK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {warga.status_kelayakan.replace('_', ' ')}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-xs uppercase font-bold text-blue-600">
                        {warga.status_approval ? warga.status_approval.replace('_', ' ') : 'PENDING'}
                    </td>
                    <td className="px-6 py-4">
                        {warga.status_approval === 'PENDING_RW' || !warga.status_approval ? (
                            <div className="flex gap-2">
                                <button onClick={() => handleApprove(warga._id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs">Setujui</button>
                                <button className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-xs">Tolak</button>
                            </div>
                        ) : (
                            <span className="text-slate-400 text-xs italic">Selesai</span>
                        )}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
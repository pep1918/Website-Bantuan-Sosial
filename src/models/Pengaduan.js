import mongoose from 'mongoose';

const PengaduanSchema = new mongoose.Schema({
  nama_pelapor: { type: String, default: 'Anonim' },
  rt_tujuan: { type: String, required: true },
  isi_laporan: { type: String, required: true },
  status: { type: String, default: 'DITERIMA' },
  tanggal: { type: Date, default: Date.now }
});

export default mongoose.models.Pengaduan || mongoose.model('Pengaduan', PengaduanSchema);
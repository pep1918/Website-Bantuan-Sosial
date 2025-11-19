import mongoose from 'mongoose';

const WargaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  nik: { type: String, required: true, unique: true },
  alamat_rt: { type: String, required: true },
  alamat_rw: { type: String, default: '05' },
  penghasilan: { type: Number, required: true },
  tanggungan: { type: Number, required: true },
  status_kelayakan: { 
    type: String, 
    enum: ['LAYAK', 'TIDAK_LAYAK'],
    required: true 
  },
  status_approval: {
    type: String,
    enum: ['PENDING_RW', 'VERIFIED_RW', 'APPROVED_ADMIN', 'REJECTED'],
    default: 'PENDING_RW'
  },
  tanggal_input: { type: Date, default: Date.now }
});

export default mongoose.models.Warga || mongoose.model('Warga', WargaSchema);
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // --- DATABASE PURA-PURA (MOCK DATA) ---
  const users = [
    { username: 'pak_rw', password: 'rw123', name: 'Bapak RW 05', role: 'rw', wilayah: 'all' },
    { username: 'rt01',   password: 'rt01',  name: 'Ketua RT 01',  role: 'rt', wilayah: '01' },
    { username: 'rt02',   password: 'rt02',  name: 'Ketua RT 02',  role: 'rt', wilayah: '02' },
    { username: 'rt03',   password: 'rt03',  name: 'Ketua RT 03',  role: 'rt', wilayah: '03' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulasi loading network
    setTimeout(() => {
      // 1. Cari user yang cocok
      const foundUser = users.find(u => u.username === form.username && u.password === form.password);

      if (foundUser) {
        // 2. Jika ketemu, SIMPAN SESI ke LocalStorage
        // (Agar halaman lain tahu siapa yang login)
        localStorage.setItem('user_session', JSON.stringify(foundUser));
        
        // 3. Pindah ke Dashboard
        router.push('/dashboard');
      } else {
        // 4. Jika salah
        setError('Username atau Password salah!');
        setLoading(false);
      }
    }, 1500); // Delay 1.5 detik biar kerasa loadingnya
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-200">
                <ShieldCheck size={32}/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Login Sistem Desa</h2>
            <p className="text-slate-400 text-sm mt-1"></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            {/* Alert Error */}
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Contoh: rt01" 
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={form.username}
                        onChange={(e) => setForm({...form, username: e.target.value})}
                        required 
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                    <input 
                        type="password" 
                        placeholder="••••••" 
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        required 
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex justify-center items-center gap-2"
            >
                {loading ? <><Loader2 className="animate-spin"/> Memeriksa...</> : 'Masuk Sistem'}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-slate-400">
                Lupa password? Hubungi Admin Desa (Server Room).
            </p>
        </div>
      </div>
    </div>
  );
}
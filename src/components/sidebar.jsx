"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
// Import semua icon yang dibutuhkan
import { 
  LayoutDashboard, 
  UserPlus, 
  FileCheck, 
  Wallet, 
  LogOut, 
  Home, 
  UserCircle, 
  ChevronRight, 
  Database, 
  MessageSquare, 
  Gift, 
  History 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // State User & Badge Notifikasi
  const [user, setUser] = useState({ name: 'Admin Desa', role: 'Administrator' });
  const [badges, setBadges] = useState({ aspirasi: 0, approval: 0 });

  useEffect(() => {
    // 1. Ambil Data User dari LocalStorage
    const session = localStorage.getItem('user_session');
    if (session) setUser(JSON.parse(session));

    // 2. Ambil Data Statistik untuk Badge (Real-time)
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
          setBadges({
              aspirasi: data.aduan || 0,      // Jumlah pesan baru
              approval: data.pending || 0     // Jumlah data belum di-acc
          });
      })
      .catch(err => console.log("Gagal load badge sidebar", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    router.push('/login');
  };

  return (
    <aside className="w-72 bg-[#0f172a] text-white flex flex-col fixed h-full z-50 shadow-2xl border-r border-slate-800 font-sans transition-all duration-300">
      
      {/* --- 1. HEADER BRANDING --- */}
      <div className="p-8 pb-6 relative overflow-hidden">
        {/* Dekorasi Background Blur */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Database size={24} className="text-white" />
            </div>
            <div>
                <h1 className="text-xl font-extrabold tracking-wider text-white">
                Desa Maju Jaya
                </h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">Sistem Terpadu</p>
            </div>
        </div>
      </div>

      {/* --- 2. USER PROFILE (GLASSMORPHISM) --- */}
      <div className="mx-4 mb-4 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center gap-3 backdrop-blur-md">
        <div className="relative">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 rounded-full">
                <div className="bg-slate-900 p-1 rounded-full">
                    <UserCircle size={32} className="text-slate-200" />
                </div>
            </div>
            {/* Status Dot Hijau (Online) */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
        </div>
        <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <div className="flex items-center gap-1">
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    {user.role === 'rw' ? 'Verifikator' : 'Operator RT'}
                </span>
            </div>
        </div>
      </div>
      
      {/* --- 3. NAVIGATION MENU --- */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar py-2">
        
        
        <MenuLink href="/dashboard" active={pathname === '/dashboard'} icon={<LayoutDashboard size={20} />} label="Overview" />
        
        {/* Menu dengan Badge Aspirasi */}
        <MenuLink 
            href="/aspirasi" 
            active={pathname === '/aspirasi'} 
            icon={<MessageSquare size={18} />} 
            label="Aspirasi Warga" 
            badge={badges.aspirasi} 
            badgeColor="bg-pink-500"
        />
        
        
        <MenuLink href="/data-bansos" active={pathname === '/data-bansos'} icon={<Database size={20} />} label="Data Bansos (Master)" />
        <MenuLink href="/input-bansos" active={pathname === '/input-bansos'} icon={<UserPlus size={20} />} label="Input Warga" />
        <MenuLink href="/kas-rt" active={pathname === '/kas-rt'} icon={<Wallet size={20} />} label="Kas RT" />
        
        {/* Menu dengan Badge Approval */}
        <MenuLink 
            href="/verifikasi" 
            active={pathname === '/verifikasi'} 
            icon={<FileCheck size={18} />} 
            label="Approval Data" 
            badge={badges.approval} 
            badgeColor="bg-orange-500"
        />

      
        <MenuLink href="/penyaluran" active={pathname === '/penyaluran'} icon={<Gift size={20} />} label="Distribusi Bantuan" />
        <MenuLink href="/riwayat-penyaluran" active={pathname === '/riwayat-penyaluran'} icon={<History size={20} />} label="Riwayat Penyaluran" />
        
        <MenuLink href="/" active={pathname === '/'} icon={<Home size={20} />} label="Halaman Depan" />
      </nav>

      {/* --- 4. FOOTER LOGOUT --- */}
      <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
        <button onClick={handleLogout} className="group flex items-center justify-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-red-600/90 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-900/20">
          <LogOut size={30} className="mr-2 transition-transform group-hover:-translate-x-1" /> 
          <span className="font-bold text-sm">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

// --- SUB COMPONENTS ---

const SectionTitle = ({ label }) => (
    <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 pb-1">
        {label}
    </div>
);

const MenuLink = ({ href, icon, label, active, badge, badgeColor }) => (
  <Link href={href} className={`relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group mb-1 ${
      active 
      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
    }`}>
    
    <div className="flex items-center">
        <span className={`mr-3 ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`}>{icon}</span>
        <span className="font-medium text-sm tracking-wide">{label}</span>
    </div>

    {/* LOGIKA BADGE (Angka Merah) */}
    {badge > 0 && (
        <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white rounded-full shadow-sm ${badgeColor || 'bg-red-500'} animate-pulse`}>
            {badge}
        </span>
    )}
    
    {/* Indikator Panah Aktif */}
    {active && !badge && <ChevronRight size={14} className="text-white/50" />}
  </Link>
);
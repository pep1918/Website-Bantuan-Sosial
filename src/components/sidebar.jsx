"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
// Import Icon Lengkap
import { LayoutDashboard, UserPlus, FileCheck, Wallet, LogOut, Home, UserCircle, ChevronRight, Database, MessageSquare } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Admin Desa', role: 'Administrator' });

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) setUser(JSON.parse(session));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    router.push('/login');
  };

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full z-50 shadow-2xl transition-all duration-300 border-r border-slate-800">
      {/* BRANDING */}
      <div className="p-8 pb-6">
        <h1 className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          SI-BANSOS
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 tracking-[0.2em] uppercase">Sistem Desa Terpadu</p>
      </div>

      {/* USER PROFILE CARD */}
      <div className="mx-6 mb-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center gap-3 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
            <UserCircle size={24} className="text-white" />
        </div>
        <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{user.role === 'rw' ? 'Verifikator' : 'Petugas Input'}</p>
        </div>
      </div>
      
      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <SectionTitle label="Utama" />
        <MenuLink href="/dashboard" active={pathname === '/dashboard'} icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <MenuLink href="/aspirasi" active={pathname === '/aspirasi'} icon={<MessageSquare size={20} />} label="Aspirasi Warga" />
        
        <SectionTitle label="Data Master" />
        <MenuLink href="/data-bansos" active={pathname === '/data-bansos'} icon={<Database size={20} />} label="Data Bansos" />
        <MenuLink href="/input-bansos" active={pathname === '/input-bansos'} icon={<UserPlus size={20} />} label="Input Warga" />
        
        <SectionTitle label="Keuangan & Validasi" />
        <MenuLink href="/kas-rt" active={pathname === '/kas-rt'} icon={<Wallet size={20} />} label="Kas RT" />
        <MenuLink href="/verifikasi" active={pathname === '/verifikasi'} icon={<FileCheck size={20} />} label="Approval Data" />
        
        <SectionTitle label="Lainnya" />
        <MenuLink href="/" active={pathname === '/'} icon={<Home size={20} />} label="Halaman Depan" />
      </nav>

      {/* LOGOUT */}
      <div className="p-6 border-t border-slate-800/50">
        <button onClick={handleLogout} className="group flex items-center w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all duration-200">
          <LogOut size={20} className="mr-3 transition-transform group-hover:-translate-x-1" /> 
          <span className="font-medium text-sm">Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}

const SectionTitle = ({ label }) => (
    <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
    </div>
);

const MenuLink = ({ href, icon, label, active }) => (
  <Link href={href} className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}>
    <span className={`mr-3 ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`}>{icon}</span>
    <span className="font-medium text-sm">{label}</span>
    {active && <ChevronRight size={16} className="absolute right-3 opacity-70" />}
  </Link>
);
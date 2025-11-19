"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserPlus, FileCheck, Wallet, LogOut, Home } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-500 tracking-widest">SI-BANSOS</h1>
        <p className="text-xs text-slate-400 mt-1">Sistem Desa Terpadu</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-2 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase px-4 py-2">Menu Utama</div>
        <MenuLink href="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
        
        <div className="text-xs font-semibold text-slate-500 uppercase px-4 py-2 mt-4">Menu RT</div>
        <MenuLink href="/input-bansos" active={isActive('/input-bansos')} icon={<UserPlus size={20} />} label="Input Warga" />
        <MenuLink href="/kas-rt" active={isActive('/kas-rt')} icon={<Wallet size={20} />} label="Kas RT" />
        
        <div className="text-xs font-semibold text-slate-500 uppercase px-4 py-2 mt-4">Verifikasi</div>
        <MenuLink href="/verifikasi" active={isActive('/verifikasi')} icon={<FileCheck size={20} />} label="Approval RW" />
        
        <div className="text-xs font-semibold text-slate-500 uppercase px-4 py-2 mt-4">Publik</div>
        <MenuLink href="/" active={isActive('/')} icon={<Home size={20} />} label="Halaman Depan" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        {/* PERBAIKAN: Ganti /auth/login menjadi /login */}
        <Link href="/login" className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-all">
          <LogOut size={20} className="mr-3" /> Keluar
        </Link>
      </div>
    </aside>
  );
}

const MenuLink = ({ href, icon, label, active }) => (
  <Link href={href} className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800'}`}>
    <span className={`mr-3 ${active ? '' : 'group-hover:scale-110'} transition-transform`}>{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);
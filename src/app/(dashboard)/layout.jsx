// Kita gunakan jalur relatif yang benar dari folder (dashboard)
import Sidebar from '../../components/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar dipanggil di sini */}
      <Sidebar />
      
      {/* Konten digeser ke kanan agar tidak tertutup sidebar */}
      <main className="flex-1 ml-64 p-8 bg-slate-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}
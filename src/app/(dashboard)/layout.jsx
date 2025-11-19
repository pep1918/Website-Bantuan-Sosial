import Sidebar from '../../components/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]"> {/* Background abu-abu sangat muda modern */}
      <Sidebar />
      
      {/* Konten utama digeser 72 (w-72 sidebar) */}
      <main className="flex-1 ml-72 p-8 lg:p-10 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto fade-in-up">
            {children}
        </div>
      </main>
    </div>
  );
}
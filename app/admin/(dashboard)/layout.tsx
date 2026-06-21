import { AdminNav } from '@/components/admin/AdminNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </>
  );
}

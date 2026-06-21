// Minimal wrapper — only provides the dark background for the login page.
// Authenticated routes use app/admin/(dashboard)/layout.tsx which adds AdminNav.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {children}
    </div>
  );
}

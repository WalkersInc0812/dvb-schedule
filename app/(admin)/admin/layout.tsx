import AdminHeader from "./_components/header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="mx-auto max-w-screen-xl px-[72px] py-[56px]">
        {children}
      </div>
    </div>
  );
}

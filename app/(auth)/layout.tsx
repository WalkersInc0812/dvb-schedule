import Header from "./_components/header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="-mt-[56px]">{children}</div>
    </div>
  );
}

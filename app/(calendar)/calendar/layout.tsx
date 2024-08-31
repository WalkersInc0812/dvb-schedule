import CalendarHeader from "./_components/header";

interface CalendarLayoutProps {
  children: React.ReactNode;
}

export default function CalendarLayout({ children }: CalendarLayoutProps) {
  return (
    <div className="min-h-screen">
      <CalendarHeader />
      <div className="max-w-md mx-auto">{children}</div>
    </div>
  );
}

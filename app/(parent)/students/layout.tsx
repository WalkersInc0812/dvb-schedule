import { getCurrentUser } from "@/lib/session";
import CalendarHeader from "./_components/header";
import { notFound } from "next/navigation";

interface CalendarLayoutProps {
  children: React.ReactNode;
}

export default async function CalendarLayout({
  children,
}: CalendarLayoutProps) {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      <CalendarHeader user={user} />
      <div className="max-w-md mx-auto">{children}</div>
    </div>
  );
}

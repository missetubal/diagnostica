import BottomNav from '@/components/bottom-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)] pb-16">
      {children}
      <BottomNav />
    </div>
  );
}

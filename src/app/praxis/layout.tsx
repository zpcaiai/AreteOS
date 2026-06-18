import DomainTabs from "@/components/DomainTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DomainTabs
        tabs={[
          { href: "/praxis", zh: "规模化", en: "Scaling" },
          { href: "/praxis/dashboard", zh: "仪表盘", en: "Dashboard" },
        ]}
      />
      {children}
    </>
  );
}

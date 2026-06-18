import DomainTabs from "@/components/DomainTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DomainTabs
        tabs={[
          { href: "/archon", zh: "领导力", en: "Leadership" },
          { href: "/archon/dashboard", zh: "仪表盘", en: "Dashboard" },
        ]}
      />
      {children}
    </>
  );
}

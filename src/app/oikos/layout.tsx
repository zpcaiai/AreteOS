import DomainTabs from "@/components/DomainTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DomainTabs
        tabs={[
          { href: "/oikos", zh: "管理", en: "Management" },
          { href: "/oikos/dashboard", zh: "仪表盘", en: "Dashboard" },
        ]}
      />
      {children}
    </>
  );
}

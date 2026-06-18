import DomainTabs from "@/components/DomainTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DomainTabs
        tabs={[
          { href: "/phronesis", zh: "认知", en: "Cognitive" },
          { href: "/phronesis/dashboard", zh: "仪表盘", en: "Dashboard" },
          { href: "/phronesis/models", zh: "思维模型", en: "Models" },
        ]}
      />
      {children}
    </>
  );
}

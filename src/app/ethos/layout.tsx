import DomainTabs from "@/components/DomainTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DomainTabs
        tabs={[
          { href: "/ethos", zh: "身份库", en: "Library" },
          { href: "/ethos/assessment", zh: "评估", en: "Assessment" },
          { href: "/ethos/evolution", zh: "进化", en: "Evolution" },
          { href: "/ethos/families", zh: "家族", en: "Families" },
          { href: "/ethos/stack", zh: "身份栈", en: "Stack" },
          { href: "/ethos/archetypes", zh: "原型", en: "Archetypes" },
        ]}
      />
      {children}
    </>
  );
}

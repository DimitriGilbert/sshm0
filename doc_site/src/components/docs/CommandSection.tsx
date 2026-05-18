import type { ReactNode } from "react";

type CommandSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export default function CommandSection({
  id,
  title,
  children,
}: CommandSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--line)] pt-10 first:border-t-0 first:pt-0">
      <h2 className="display-title mb-5 text-2xl font-bold text-[var(--sea-ink)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

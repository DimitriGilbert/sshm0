import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs")({
  component: Docs,
});

function Docs() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Documentation</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Docs coming soon.
        </h1>
      </section>
    </main>
  );
}

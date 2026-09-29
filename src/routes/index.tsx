import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TEL Rental Store" },
      {
        name: "description",
        content: "TEL Rental Store — rent equipment and gear online.",
      },
      { property: "og:title", content: "TEL Rental Store" },
      {
        property: "og:description",
        content: "TEL Rental Store — rent equipment and gear online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "TEL Rental Store" },
      {
        name: "twitter:description",
        content: "TEL Rental Store — rent equipment and gear online.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <span className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        Coming soon
      </span>
      <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
        TEL Rental Store
      </h1>
      <p className="mt-4 max-w-md text-center text-sm text-muted-foreground">
        A rental storefront is on its way. Details to follow.
      </p>
      <Link
        to="/login"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Sign in
      </Link>
    </div>
  );
}

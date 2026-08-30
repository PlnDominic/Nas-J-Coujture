export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-base font-semibold text-foreground">Nasji Culture</p>
          <p>&copy; {new Date().getFullYear()} Nasji Culture. All rights reserved.</p>
        </div>
        <p className="mt-4 max-w-2xl">
          Contemporary fashion rooted in heritage craft. Every piece is made in small batches.
          When it&apos;s gone, it&apos;s gone.
        </p>
      </div>
    </footer>
  );
}

export default function TopBar() {
  return (
    <div className="hidden bg-[#111] px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white sm:block sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p>Free delivery on orders above ₵500</p>
        <div className="flex items-center gap-4">
          <a href="#" className="transition hover:opacity-70">
            Track order
          </a>
          <span className="text-white/30">|</span>
          <a href="#" className="transition hover:opacity-70">
            Help
          </a>
        </div>
      </div>
    </div>
  );
}

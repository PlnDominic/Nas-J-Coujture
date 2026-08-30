import { TruckIcon, ReturnBoxIcon, BadgeCheckIcon, LockIcon } from "@/components/icons";

const BADGES = [
  { icon: TruckIcon, title: "Fast delivery", subtitle: "Nationwide shipping" },
  { icon: ReturnBoxIcon, title: "Easy returns", subtitle: "Simple, hassle-free process" },
  { icon: BadgeCheckIcon, title: "Quality assured", subtitle: "Handcrafted with care" },
  { icon: LockIcon, title: "Secure checkout", subtitle: "Your details are protected" },
];

export default function TrustBadges() {
  return (
    <section className="border-y border-border bg-muted">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-10 sm:grid-cols-4 sm:px-6">
        {BADGES.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="h-7 w-7 shrink-0 text-brand" />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

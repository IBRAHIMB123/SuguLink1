import { ArrowLeft, BadgeCheck, MapPin, Star, Sprout } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fcfa, qtyFmt, STATUS, type OrderStatus, type Product } from "./data";
import { useApp } from "./store";

export function Logo({ light = false, size = "md" }: { light?: boolean; size?: "md" | "lg" }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("grid place-items-center rounded-xl bg-primary text-primary-foreground", size === "lg" ? "h-14 w-14 rounded-2xl" : "h-9 w-9")}>
        <Sprout className={size === "lg" ? "h-8 w-8" : "h-5 w-5"} strokeWidth={2.2} />
      </div>
      <span className={cn("font-display font-semibold tracking-tight", size === "lg" ? "text-4xl" : "text-xl", light ? "text-forest-foreground" : "text-forest")}>
        Sugu<span className="text-gold">Link</span>
      </span>
    </div>
  );
}

export function Btn({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "gold" | "forest" | "danger" }) {
  const v = {
    primary: "bg-primary text-primary-foreground shadow-[var(--shadow-card)] active:scale-[.98]",
    forest: "bg-forest text-forest-foreground active:scale-[.98]",
    gold: "bg-gold text-gold-foreground active:scale-[.98]",
    outline: "border border-border bg-card text-foreground",
    ghost: "text-primary",
    danger: "border border-destructive/30 bg-destructive/5 text-destructive",
  }[variant];
  return <button {...p} className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition disabled:opacity-50", v, className)} />;
}

export function Header({ title, right, sub }: { title: string; right?: ReactNode; sub?: string }) {
  const { back } = useApp();
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 bg-background/90 px-4 py-3 backdrop-blur">
      <button onClick={back} aria-label="Retour" className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]"><ArrowLeft className="h-5 w-5" /></button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold">{title}</h1>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Card({ className, children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  return <div onClick={onClick} className={cn("rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]", onClick && "cursor-pointer active:scale-[.99] transition", className)}>{children}</div>;
}

export function Section({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: ReactNode }) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {action && <button onClick={onAction} className="text-xs font-semibold text-primary">{action}</button>}
      </div>
      {children}
    </section>
  );
}

const tones: Record<string, string> = {
  warning: "bg-warning/15 text-gold-foreground", primary: "bg-primary/10 text-primary", info: "bg-info/10 text-info",
  gold: "bg-gold/20 text-gold-foreground", success: "bg-primary text-primary-foreground", destructive: "bg-destructive/10 text-destructive", muted: "bg-muted text-muted-foreground",
};
export function Badge({ tone = "primary", children, className }: { tone?: string; children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", tones[tone], className)}>{children}</span>;
}
export const StatusBadge = ({ s }: { s: OrderStatus }) => <Badge tone={STATUS[s].tone}>{STATUS[s].label}</Badge>;

export function Verified() { return <BadgeCheck className="h-4 w-4 shrink-0 fill-primary text-primary-foreground" />; }

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground", className)}>{initials}</div>;
}
export const initials = (n: string) => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

export function ProductCard({ p, wide }: { p: Product; wide?: boolean }) {
  const { push } = useApp();
  return (
    <button onClick={() => push({ name: "product", params: { id: p.id } })} className={cn("overflow-hidden rounded-3xl bg-card text-left shadow-[var(--shadow-card)] transition active:scale-[.98]", wide ? "w-60 shrink-0" : "w-full")}>
      <div className="relative aspect-[4/3]">
        <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
        {p.promo && <Badge tone="gold" className="absolute left-2 top-2 bg-gold text-gold-foreground">-{p.promo}%</Badge>}
        <span className={cn("absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold", p.available ? "bg-card text-primary" : "bg-forest text-forest-foreground")}>{p.available ? "Disponible" : "Épuisé"}</span>
      </div>
      <div className="space-y-1 p-3">
        <p className="line-clamp-1 text-sm font-bold">{p.name}</p>
        <p className="text-base font-extrabold text-primary">{fcfa(p.price)}<span className="text-xs font-medium text-muted-foreground"> /{p.unit}</span></p>
        <p className="line-clamp-1 text-[11px] text-muted-foreground">{p.producer}</p>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{p.location}</span>
          <span>{qtyFmt(p.qty, p.unit)}</span>
        </div>
      </div>
    </button>
  );
}

export function Rating({ v }: { v: number }) { return <span className="inline-flex items-center gap-0.5 text-xs font-semibold"><Star className="h-3.5 w-3.5 fill-gold text-gold" />{v}</span>; }

export function Stat({ label, value, sub, icon, dark }: { label: string; value: string; sub?: string; icon: ReactNode; dark?: boolean }) {
  return (
    <div className={cn("rounded-3xl p-4 shadow-[var(--shadow-card)]", dark ? "bg-forest text-forest-foreground" : "bg-card")}>
      <div className={cn("mb-3 grid h-9 w-9 place-items-center rounded-xl", dark ? "bg-forest-foreground/10 text-gold" : "bg-secondary text-primary")}>{icon}</div>
      <p className={cn("text-[11px]", dark ? "text-forest-foreground/70" : "text-muted-foreground")}>{label}</p>
      <p className="text-lg font-extrabold leading-tight">{value}</p>
      {sub && <p className={cn("text-[11px] font-semibold", dark ? "text-gold" : "text-primary")}>{sub}</p>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>{children}</label>;
}
export const inputCls = "h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function Chips<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
      {items.map((c) => (
        <button key={c} onClick={() => onChange(c)} className={cn("shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition", value === c ? "bg-forest text-forest-foreground" : "bg-card text-foreground shadow-[var(--shadow-card)]")}>{c}</button>
      ))}
    </div>
  );
}

export function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-32 items-end gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className={cn("w-full rounded-t-lg", i === data.length - 1 ? "bg-primary" : "bg-secondary")} style={{ height: `${(d / max) * 100}%` }} />
          <span className="text-[10px] text-muted-foreground">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function Empty({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-secondary text-primary">{icon}</div>
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

/** Stylised map placeholder of Mali with markers and optional route. */
export function MapView({ className, route = true, markers }: { className?: string; route?: boolean; markers?: { x: number; y: number; label: string; tone: "primary" | "gold" | "forest" }[] }) {
  const m = markers ?? [
    { x: 30, y: 62, label: "Bamako", tone: "forest" as const },
    { x: 58, y: 84, label: "Sikasso", tone: "primary" as const },
    { x: 52, y: 48, label: "Ségou", tone: "primary" as const },
    { x: 44, y: 72, label: "Camion", tone: "gold" as const },
  ];
  const fill = { primary: "var(--primary)", gold: "var(--gold)", forest: "var(--forest)" };
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-secondary", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs><pattern id="g" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="var(--border)" strokeWidth=".3" /></pattern></defs>
        <rect width="100" height="100" fill="url(#g)" />
        <path d="M0 40 C20 35 35 50 55 42 S85 30 100 38" stroke="var(--info)" strokeOpacity=".35" strokeWidth="2.5" fill="none" />
        <path d="M30 62 L52 48 M30 62 L58 84 M52 48 L75 30" stroke="var(--card)" strokeWidth="2" fill="none" />
        {route && <path d="M30 62 Q40 80 58 84" stroke="var(--primary)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" className="animate-route" />}
      </svg>
      {m.map((k) => (
        <div key={k.label} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${k.x}%`, top: `${k.y}%` }}>
          <div className="flex flex-col items-center">
            <span className="mb-1 whitespace-nowrap rounded-full bg-card px-2 py-0.5 text-[10px] font-bold shadow-[var(--shadow-card)]">{k.label}</span>
            <span className="h-3.5 w-3.5 rounded-full border-2 border-card shadow" style={{ background: fill[k.tone] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

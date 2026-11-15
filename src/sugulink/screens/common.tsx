// @ts-nocheck -- prototype screens; strict index checks relaxed
import { useState } from "react";
import { Bell, Check, ChevronRight, CircleHelp, Globe, Image as ImageIcon, LogOut, MapPin, Package, Paperclip, Phone, Send, Shield, Truck, UserPen, Wallet, Navigation, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONVERSATIONS, PRODUCTS, ROLES, STATUS, TIMELINE, USERS, fcfa, qtyFmt, type OrderStatus } from "../data";
import { useApp } from "../store";
import { Avatar, Badge, Btn, Card, Empty, Field, Header, MapView, StatusBadge, Verified, inputCls, initials } from "../ui";
import { roleIcon } from "./auth";

const FILTERS: { id: "all" | OrderStatus; label: string }[] = [
  { id: "all", label: "Toutes" }, { id: "en_attente", label: "En attente" }, { id: "acceptee", label: "Acceptées" },
  { id: "transport", label: "En transport" }, { id: "livree", label: "Terminées" }, { id: "rejetee", label: "Rejetées" }, { id: "annulee", label: "Annulées" },
];
export function Orders({ title = "Mes commandes", incoming = false }: { title?: string; incoming?: boolean }) {
  const { orders, products, push, setOrders, showToast } = useApp();
  const [f, setF] = useState<(typeof FILTERS)[number]["id"]>("all");
  const list = orders.filter((o) => f === "all" || o.status === f || (f === "acceptee" && o.status === "preparation"));
  return (
    <div className="pb-6">
      <h1 className="px-4 pb-3 pt-5 font-display text-2xl font-semibold">{title}</h1>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
        {FILTERS.map((x) => <button key={x.id} onClick={() => setF(x.id)} className={cn("shrink-0 rounded-full px-4 py-2 text-xs font-semibold", f === x.id ? "bg-forest text-forest-foreground" : "bg-card shadow-[var(--shadow-card)]")}>{x.label}</button>)}
      </div>
      <div className="mt-4 space-y-3 px-4">
        {list.map((o) => { const p = products.find((x) => x.id === o.productId) ?? PRODUCTS[0]; return (
          <Card key={o.id} onClick={() => push({ name: "order", params: { id: o.id } })} className="p-3">
            <div className="flex gap-3">
              <img src={p.img} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2"><p className="truncate text-sm font-bold">{p.name}</p><StatusBadge s={o.status} /></div>
                <p className="text-xs text-muted-foreground">{o.id} · {o.date}</p>
                <p className="text-xs text-muted-foreground">{incoming ? `${o.buyer} · ${o.city}` : p.producer}</p>
                <div className="mt-1 flex justify-between text-sm"><span className="text-muted-foreground">{qtyFmt(o.qty)}</span><b className="text-primary">{fcfa(o.total)}</b></div>
              </div>
            </div>
            {incoming && o.status === "en_attente" && (
              <div className="mt-3 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                <Btn variant="danger" className="h-10" onClick={() => { setOrders((os) => os.map((x) => x.id === o.id ? { ...x, status: "rejetee" } : x)); showToast("Commande rejetée"); }}>Refuser</Btn>
                <Btn className="h-10" onClick={() => { setOrders((os) => os.map((x) => x.id === o.id ? { ...x, status: "acceptee" } : x)); showToast("Commande acceptée"); }}>Accepter</Btn>
              </div>
            )}
          </Card>
        ); })}
        {!list.length && <Empty icon={<Package />} title="Aucune commande" body="Aucune commande dans cette catégorie." />}
      </div>
    </div>
  );
}

export function OrderDetail({ id }: { id: string }) {
  const { orders, products, setOrders, push, showToast } = useApp();
  const o = orders.find((x) => x.id === id) ?? orders[0];
  const p = products.find((x) => x.id === o.productId)!;
  const idx = TIMELINE.indexOf(o.status);
  const steps = ["Commande passée", "Acceptée", "Préparation", "En transport", "Livrée"];
  const off = o.status === "rejetee" || o.status === "annulee";
  return (
    <div className="pb-6">
      <Header title={`Commande ${o.id}`} sub={o.date} right={<StatusBadge s={o.status} />} />
      {o.status === "transport" && <div className="px-4"><MapView className="h-44" /><button onClick={() => push({ name: "map" })} className="mt-2 w-full text-center text-xs font-semibold text-primary">Ouvrir le suivi en direct</button></div>}
      <Card className="mx-4 mt-3 flex gap-3 p-3">
        <img src={p.img} alt="" className="h-16 w-16 rounded-2xl object-cover" />
        <div className="flex-1"><p className="text-sm font-bold">{p.name}</p><p className="text-xs text-muted-foreground">{p.producer}</p><p className="mt-1 text-sm"><span className="text-muted-foreground">{qtyFmt(o.qty)} · </span><b className="text-primary">{fcfa(o.total)}</b></p></div>
      </Card>
      <Card className="mx-4 mt-3">
        <p className="mb-4 text-sm font-bold">Suivi de commande</p>
        {off ? <div className="flex items-center gap-3 rounded-2xl bg-destructive/5 p-3 text-sm text-destructive">Cette commande a été {STATUS[o.status].label.toLowerCase()}.</div> :
          steps.map((s, i) => (
            <div key={s} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={cn("grid h-7 w-7 place-items-center rounded-full border-2", i <= idx ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>{i <= idx ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-border" />}</span>
                {i < steps.length - 1 && <span className={cn("h-9 w-0.5", i < idx ? "bg-primary" : "bg-border")} />}
              </div>
              <div className="pt-1"><p className={cn("text-sm font-semibold", i > idx && "text-muted-foreground")}>{s}</p>{i === idx && <p className="text-xs text-primary">Étape actuelle</p>}</div>
            </div>
          ))}
      </Card>
      <Card className="mx-4 mt-3 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground"><Truck className="h-5 w-5" /></div>
        <div className="flex-1"><p className="text-sm font-bold">Sidiki Transport</p><p className="text-xs text-muted-foreground">Camion 10 t · AB-4521-MD</p></div>
        <button onClick={() => push({ name: "chat", params: { id: "c2" } })} className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary"><Phone className="h-4 w-4" /></button>
      </Card>
      {!off && idx < 4 && (
        <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
          <Btn variant="danger" onClick={() => { setOrders((os) => os.map((x) => x.id === o.id ? { ...x, status: "annulee" } : x)); showToast("Commande annulée"); }}>Annuler</Btn>
          <Btn variant="forest" onClick={() => { setOrders((os) => os.map((x) => x.id === o.id ? { ...x, status: TIMELINE[Math.min(idx + 1, 4)] } : x)); }}>Étape suivante (démo)</Btn>
        </div>
      )}
    </div>
  );
}

export function Messages() {
  const { push } = useApp();
  return (
    <div className="pb-6">
      <h1 className="px-4 pb-3 pt-5 font-display text-2xl font-semibold">Messages</h1>
      <div className="mx-4 mb-3 rounded-2xl bg-card px-4 py-3 text-sm text-muted-foreground shadow-[var(--shadow-card)]">Rechercher une conversation…</div>
      <div className="px-2">
        {CONVERSATIONS.map((c) => (
          <button key={c.id} onClick={() => push({ name: "chat", params: { id: c.id } })} className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left active:bg-muted">
            <div className="relative"><Avatar initials={initials(c.name)} className="h-12 w-12" />{c.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-primary" />}</div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between"><p className="truncate text-sm font-bold">{c.name}</p><span className={cn("text-[11px]", c.unread ? "font-bold text-primary" : "text-muted-foreground")}>{c.time}</span></div>
              <p className="truncate text-[11px] text-muted-foreground">{c.org}</p>
              <div className="flex justify-between gap-2"><p className={cn("truncate text-xs", c.unread ? "font-semibold" : "text-muted-foreground")}>{c.last}</p>{c.unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{c.unread}</span>}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

type Msg = { me: boolean; text?: string; product?: string; time: string };
export function Chat({ id }: { id: string }) {
  const c = CONVERSATIONS.find((x) => x.id === id) ?? CONVERSATIONS[0];
  const { push } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([
    { me: true, text: "Bonjour Madame Traoré, vos pommes de terre sont-elles toujours disponibles ?", time: "10:20" },
    { me: false, text: "Bonjour ! Oui, nous avons 12 tonnes en stock, calibre A.", time: "10:24" },
    { me: false, product: "a1", time: "10:24" },
    { me: true, text: "Parfait. J'aurais besoin de 5 tonnes livrées à Bamako.", time: "10:31" },
    { me: false, text: c.last, time: c.time },
  ]);
  const [t, setT] = useState("");
  const send = () => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { me: true, text: t, time: "maintenant" }]); setT("");
    setTimeout(() => setMsgs((m) => [...m, { me: false, text: "Bien reçu, je vous confirme rapidement. 🙏", time: "maintenant" }]), 1200);
  };
  return (
    <div className="flex h-full flex-col">
      <Header title={c.name} sub={c.online ? "En ligne" : c.org} right={<button className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary"><Phone className="h-4 w-4" /></button>} />
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-2">
        <p className="py-2 text-center text-[11px] text-muted-foreground">Aujourd'hui</p>
        {msgs.map((m, i) => {
          if (m.product) { const p = PRODUCTS.find((x) => x.id === m.product)!; return (
            <button key={i} onClick={() => push({ name: "product", params: { id: p.id } })} className="flex w-64 gap-3 rounded-3xl rounded-bl-md bg-card p-2 text-left shadow-[var(--shadow-card)]">
              <img src={p.img} alt="" className="h-16 w-16 rounded-2xl object-cover" /><div className="py-1"><p className="text-xs font-bold">{p.name}</p><p className="text-sm font-extrabold text-primary">{fcfa(p.price)}/kg</p><p className="text-[10px] text-muted-foreground">Voir le produit →</p></div>
            </button>
          ); }
          return (
            <div key={i} className={cn("flex", m.me && "justify-end")}>
              <div className={cn("max-w-[78%] px-4 py-2.5 text-sm animate-in fade-in slide-in-from-bottom-1", m.me ? "rounded-3xl rounded-br-md bg-primary text-primary-foreground" : "rounded-3xl rounded-bl-md bg-card shadow-[var(--shadow-card)]")}>
                {m.text}<p className={cn("mt-0.5 text-right text-[10px]", m.me ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-card p-3">
        <button className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground"><Paperclip className="h-5 w-5" /></button>
        <button onClick={() => setMsgs((m) => [...m, { me: true, product: "a4", time: "maintenant" }])} className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground" aria-label="Partager un produit"><ImageIcon className="h-5 w-5" /></button>
        <input value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Écrire un message…" className="h-11 flex-1 rounded-full bg-muted px-4 text-sm outline-none" />
        <button onClick={send} className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

const nIcon = { order: Package, delivery: Truck, payment: Wallet, system: Shield };
export function Notifications() {
  const { notifs, markRead, push } = useApp();
  return (
    <div className="pb-6">
      <Header title="Notifications" right={<button onClick={() => markRead()} className="text-xs font-semibold text-primary">Tout lire</button>} />
      <div className="space-y-2 px-4">
        {notifs.map((n) => { const I = nIcon[n.type as keyof typeof nIcon]; return (
          <Card key={n.id} onClick={() => { markRead(n.id); if (n.type !== "system") push({ name: "order", params: { id: n.type === "delivery" ? "SL-24871" : "SL-24812" } }); }} className={cn("flex gap-3 p-3", !n.read && "ring-1 ring-primary/30")}>
            <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", n.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")}><I className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-sm font-bold">{n.title}</p>{!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}</div><p className="text-xs text-muted-foreground">{n.body}</p><p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p></div>
          </Card>
        ); })}
      </div>
    </div>
  );
}

export function Profile() {
  const { role, push, reset } = useApp();
  const u = USERS[role]; const r = ROLES.find((x) => x.id === role)!; const I = roleIcon[role];
  const rows = [
    { icon: UserPen, label: "Modifier le profil", go: "profileEdit" },
    { icon: Globe, label: "Langue", value: "Français", go: "settings" },
    { icon: Bell, label: "Notifications", go: "settings" },
    { icon: Shield, label: "Sécurité", go: "settings" },
    { icon: MapPin, label: "Carte & localisation", go: "map" },
    { icon: CircleHelp, label: "Centre d'aide", go: "help" },
  ];
  return (
    <div className="pb-6">
      <div className="bg-forest px-4 pb-16 pt-6 text-forest-foreground">
        <h1 className="font-display text-2xl font-semibold">Profil</h1>
      </div>
      <Card className="relative mx-4 -mt-12 text-center">
        <Avatar initials={u.initials} className="mx-auto -mt-12 h-20 w-20 border-4 border-card bg-gold text-xl text-gold-foreground" />
        <p className="mt-2 flex items-center justify-center gap-1 text-lg font-bold">{u.name}<Verified /></p>
        <p className="text-xs text-muted-foreground">{u.org}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2"><Badge><I className="h-3 w-3" />{r.label}</Badge><Badge tone="gold">Compte vérifié</Badge></div>
        <div className="mt-4 grid grid-cols-3 border-t border-border pt-3 text-center">
          <div><p className="font-bold">4,8</p><p className="text-[10px] text-muted-foreground">Note</p></div>
          <div><p className="font-bold">128</p><p className="text-[10px] text-muted-foreground">Transactions</p></div>
          <div><p className="font-bold">2 ans</p><p className="text-[10px] text-muted-foreground">Membre</p></div>
        </div>
      </Card>
      <Card className="mx-4 mt-3 space-y-2 text-sm">
        <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{u.phone}</p>
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{u.location}</p>
      </Card>
      <Card className="mx-4 mt-3 p-2">
        {rows.map((x) => (
          <button key={x.label} onClick={() => push({ name: x.go })} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left active:bg-muted">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary"><x.icon className="h-4 w-4" /></div>
            <span className="flex-1 text-sm font-semibold">{x.label}</span>{x.value && <span className="text-xs text-muted-foreground">{x.value}</span>}<ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </Card>
      <Btn variant="danger" className="mx-4 mt-3 w-[calc(100%-2rem)]" onClick={() => reset({ name: "welcome" })}><LogOut className="h-4 w-4" />Se déconnecter</Btn>
      <p className="mt-4 text-center text-[10px] text-muted-foreground">SuguLink v1.0 · Fait au Mali 🇲🇱</p>
    </div>
  );
}

export function ProfileEdit() {
  const { role, back, showToast } = useApp(); const u = USERS[role];
  return (
    <div className="flex h-full flex-col">
      <Header title="Modifier le profil" />
      <div className="flex-1 space-y-4 overflow-y-auto px-4">
        <Avatar initials={u.initials} className="mx-auto h-24 w-24 bg-gold text-2xl text-gold-foreground" />
        <Field label="Nom complet"><input className={inputCls} defaultValue={u.name} /></Field>
        <Field label="Entreprise"><input className={inputCls} defaultValue={u.org} /></Field>
        <Field label="Téléphone"><input className={inputCls} defaultValue={u.phone} /></Field>
        <Field label="Localisation"><input className={inputCls} defaultValue={u.location} /></Field>
      </div>
      <div className="p-4"><Btn className="w-full" onClick={() => { showToast("Profil mis à jour"); back(); }}>Enregistrer</Btn></div>
    </div>
  );
}

function Toggle({ on: init = true }: { on?: boolean }) {
  const [on, setOn] = useState(init);
  return <button onClick={() => setOn(!on)} className={cn("relative h-7 w-12 rounded-full transition", on ? "bg-primary" : "bg-border")}><span className={cn("absolute top-1 h-5 w-5 rounded-full bg-card shadow transition-all", on ? "left-6" : "left-1")} /></button>;
}
export function Settings() {
  const [lang, setLang] = useState("Français");
  return (
    <div className="pb-6">
      <Header title="Paramètres" />
      <p className="px-5 pb-2 pt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Langue</p>
      <Card className="mx-4 p-2">{["Français", "Bambara", "English"].map((l) => <button key={l} onClick={() => setLang(l)} className="flex w-full items-center justify-between rounded-2xl p-3 text-sm font-semibold">{l}{lang === l && <Check className="h-4 w-4 text-primary" />}</button>)}</Card>
      <p className="px-5 pb-2 pt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Notifications</p>
      <Card className="mx-4 space-y-4">{[["Commandes", true], ["Livraisons", true], ["Nouvelles demandes", true], ["Offres promotionnelles", false], ["SMS (sans internet)", true]].map(([l, v]) => <div key={l as string} className="flex items-center justify-between text-sm font-semibold">{l}<Toggle on={v as boolean} /></div>)}</Card>
      <p className="px-5 pb-2 pt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Sécurité</p>
      <Card className="mx-4 space-y-4">{[["Code PIN de connexion", true], ["Empreinte digitale", false], ["Vérification en 2 étapes", true]].map(([l, v]) => <div key={l as string} className="flex items-center justify-between text-sm font-semibold">{l}<Toggle on={v as boolean} /></div>)}</Card>
    </div>
  );
}

export function Help() {
  const qs = ["Comment publier un produit ?", "Comment fonctionne le paiement ?", "Comment devenir vérifié ?", "Que faire si ma livraison est en retard ?"];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="pb-6">
      <Header title="Centre d'aide" />
      <Card className="mx-4 bg-forest text-forest-foreground"><p className="font-display text-lg font-semibold">Besoin d'aide ?</p><p className="text-xs text-forest-foreground/70">Notre équipe répond 7j/7 en français et bambara.</p><Btn variant="gold" className="mt-3 h-10"><Phone className="h-4 w-4" />Appeler le 80 00 12 34</Btn></Card>
      <div className="mt-4 space-y-2 px-4">{qs.map((q, i) => <Card key={q} onClick={() => setOpen(open === i ? null : i)} className="p-4"><p className="flex justify-between text-sm font-semibold">{q}<ChevronRight className={cn("h-4 w-4 transition", open === i && "rotate-90")} /></p>{open === i && <p className="mt-2 text-xs text-muted-foreground">Rendez-vous dans votre tableau de bord, puis suivez les étapes guidées. Nos conseillers peuvent aussi vous accompagner par téléphone.</p>}</Card>)}</div>
    </div>
  );
}

export function MapScreen() {
  const [layer, setLayer] = useState<"all" | "prod" | "trans">("all");
  const markers = [
    { x: 30, y: 62, label: "Vous · Bamako", tone: "forest" as const },
    ...(layer !== "trans" ? [{ x: 58, y: 84, label: "Sikasso Bio", tone: "primary" as const }, { x: 52, y: 48, label: "Diallo & Fils", tone: "primary" as const }, { x: 70, y: 66, label: "GIE Koutiala", tone: "primary" as const }, { x: 26, y: 56, label: "Jardins Kati", tone: "primary" as const }] : []),
    ...(layer !== "prod" ? [{ x: 44, y: 74, label: "🚚 Sidiki", tone: "gold" as const }, { x: 62, y: 40, label: "🚚 Mali Fret", tone: "gold" as const }] : []),
  ];
  return (
    <div className="flex h-full flex-col">
      <Header title="Carte & livraisons" sub="Région de Bamako – Sikasso" />
      <div className="relative mx-4 flex-1"><MapView className="absolute inset-0" markers={markers} />
        <div className="absolute left-3 top-3 flex gap-1 rounded-full bg-card p-1 shadow-[var(--shadow-card)]">
          {([["all", "Tout"], ["prod", "Producteurs"], ["trans", "Transporteurs"]] as const).map(([k, l]) => <button key={k} onClick={() => setLayer(k)} className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", layer === k ? "bg-primary text-primary-foreground" : "")}>{l}</button>)}
        </div>
        <button className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-card text-primary shadow-[var(--shadow-card)]"><Navigation className="h-5 w-5" /></button>
      </div>
      <Card className="m-4">
        <div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Livraison SL-24871</p><p className="font-bold">Sikasso → Bamako</p></div><Badge tone="gold">En route</Badge></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-[62%] rounded-full bg-primary" /></div>
        <div className="mt-3 grid grid-cols-3 text-center text-xs">
          <div><Clock className="mx-auto h-4 w-4 text-primary" /><p className="mt-1 font-bold">20:30</p><p className="text-muted-foreground">Arrivée</p></div>
          <div><MapPin className="mx-auto h-4 w-4 text-primary" /><p className="mt-1 font-bold">142 km</p><p className="text-muted-foreground">Restant</p></div>
          <div><Star className="mx-auto h-4 w-4 text-primary" /><p className="mt-1 font-bold">4,9</p><p className="text-muted-foreground">Chauffeur</p></div>
        </div>
      </Card>
    </div>
  );
}

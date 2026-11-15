// @ts-nocheck -- prototype screens; strict index checks relaxed
import { useMemo, useState } from "react";
import { Bell, ChevronRight, MapPin, MessageCircle, Minus, Plus, Search, ShoppingCart, SlidersHorizontal, Sparkles, Trash2, Truck, CheckCircle2, ShieldCheck, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, IMAGES, PRODUCERS, TRANSPORTERS, USERS, fcfa, qtyFmt, type Category } from "../data";
import { useApp } from "../store";
import { Badge, Btn, Card, Chips, Empty, Header, ProductCard, Rating, Section, Verified, Avatar, initials } from "../ui";

export function TopBar() {
  const { role, push, notifs, cart } = useApp();
  const u = USERS[role];
  const unread = notifs.filter((n) => !n.read).length;
  return (
    <div className="flex items-center gap-3 px-4 pt-4">
      <button onClick={() => push({ name: "profileEdit" })}><Avatar initials={u.initials} className="bg-forest text-forest-foreground" /></button>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">Bonjour,</p>
        <p className="truncate font-bold">{u.name.split(" ")[0]} 👋</p>
      </div>
      {(role === "acheteur" || role === "commercant") && (
        <button onClick={() => push({ name: "cart" })} aria-label="Panier" className="relative grid h-11 w-11 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]">
          <ShoppingCart className="h-5 w-5" />{cart.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground">{cart.length}</span>}
        </button>
      )}
      <button onClick={() => push({ name: "notifications" })} aria-label="Notifications" className="relative grid h-11 w-11 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]">
        <Bell className="h-5 w-5" />{unread > 0 && <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-destructive" />}
      </button>
    </div>
  );
}

export function SearchBar({ onClick, value, onChange }: { onClick?: () => void; value?: string; onChange?: (v: string) => void }) {
  return (
    <div onClick={onClick} className="mx-4 flex h-13 items-center gap-3 rounded-2xl bg-card px-4 py-3.5 shadow-[var(--shadow-card)]">
      <Search className="h-5 w-5 text-muted-foreground" />
      {onChange ? <input autoFocus value={value} onChange={(e) => onChange(e.target.value)} placeholder="Riz, oignons, mangues…" className="flex-1 bg-transparent text-sm outline-none" />
        : <span className="flex-1 text-sm text-muted-foreground">Rechercher un produit, un producteur…</span>}
      <SlidersHorizontal className="h-5 w-5 text-primary" />
    </div>
  );
}

export function BuyerHome() {
  const { products, push, setTab } = useApp();
  const [cat, setCat] = useState<Category>("Tous");
  const list = products.filter((p) => cat === "Tous" || p.category === cat);
  return (
    <div className="pb-6">
      <TopBar />
      <p className="mt-1 flex items-center gap-1 px-4 pl-[4.5rem] text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" />{USERS.acheteur.location}</p>
      <div className="mt-4"><SearchBar onClick={() => setTab("search")} /></div>

      <div className="mx-4 mt-5 overflow-hidden rounded-3xl bg-forest text-forest-foreground shadow-[var(--shadow-float)]">
        <div className="flex">
          <div className="flex-1 p-5">
            <Badge tone="gold" className="bg-gold text-gold-foreground"><Sparkles className="h-3 w-3" />Mise en relation</Badge>
            <p className="mt-3 font-display text-xl font-semibold leading-snug">Besoin de gros volumes ?</p>
            <p className="mt-1 text-xs text-forest-foreground/70">Comparez producteurs + transport en un clic.</p>
            <button onClick={() => push({ name: "matching" })} className="mt-4 inline-flex items-center gap-1 rounded-full bg-forest-foreground px-4 py-2 text-xs font-bold text-forest">Essayer <ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
          <img src={IMAGES.potatoes} alt="" className="w-32 object-cover" />
        </div>
      </div>

      <Section title="Catégories"><Chips items={CATEGORIES} value={cat} onChange={setCat} /></Section>

      <Section title="Produits à la une" action="Tout voir" onAction={() => setTab("search")}>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">{list.slice(0, 5).map((p) => <ProductCard key={p.id} p={p} wide />)}</div>
        {list.length === 0 && <Empty icon={<Package />} title="Aucun produit" body="Aucun produit dans cette catégorie pour le moment." />}
      </Section>

      <Section title="Offres spéciales">
        <div className="space-y-3 px-4">
          {products.filter((p) => p.promo).map((p) => (
            <Card key={p.id} onClick={() => push({ name: "product", params: { id: p.id } })} className="flex items-center gap-3 p-3">
              <img src={p.img} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{p.name}</p><p className="text-xs text-muted-foreground">{p.producer}</p>
                <p className="text-sm font-extrabold text-primary">{fcfa(p.price * (1 - p.promo! / 100))} <span className="text-xs font-medium text-muted-foreground line-through">{fcfa(p.price)}</span></p></div>
              <Badge tone="gold" className="bg-gold text-gold-foreground">-{p.promo}%</Badge>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Producteurs recommandés">
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
          {PRODUCERS.map((p) => (
            <Card key={p.id} onClick={() => push({ name: "producer", params: { id: p.id } })} className="w-44 shrink-0">
              <Avatar initials={initials(p.owner)} />
              <p className="mt-3 line-clamp-1 flex items-center gap-1 text-sm font-bold">{p.name}{p.verified && <Verified />}</p>
              <p className="text-xs text-muted-foreground">{p.location} · {p.products} produits</p>
              <div className="mt-2"><Rating v={p.rating} /></div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Fournisseurs à proximité" action="Carte" onAction={() => push({ name: "map" })}>
        <div className="space-y-2 px-4">
          {[...PRODUCERS].sort((a, b) => a.distance - b.distance).slice(0, 3).map((p) => (
            <Card key={p.id} onClick={() => push({ name: "producer", params: { id: p.id } })} className="flex items-center gap-3 p-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-primary"><MapPin className="h-5 w-5" /></div>
              <div className="flex-1"><p className="text-sm font-bold">{p.name}</p><p className="text-xs text-muted-foreground">{p.location}</p></div>
              <span className="text-xs font-bold text-primary">{p.distance} km</span>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Populaires cette semaine">
        <div className="grid grid-cols-2 gap-3 px-4">{[...products].sort((a, b) => b.rating - a.rating).slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </Section>
    </div>
  );
}

export function Explore({ title = "Marché" }: { title?: string }) {
  const { products } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category>("Tous");
  const [sort, setSort] = useState<"pertinence" | "prix" | "distance">("pertinence");
  const list = useMemo(() => {
    let l = products.filter((p) => (cat === "Tous" || p.category === cat) && (p.name + p.producer + p.location).toLowerCase().includes(q.toLowerCase()));
    if (sort === "prix") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "distance") l = [...l].sort((a, b) => a.distance - b.distance);
    return l;
  }, [products, q, cat, sort]);
  return (
    <div className="pb-6">
      <h1 className="px-4 pb-3 pt-5 font-display text-2xl font-semibold">{title}</h1>
      <SearchBar value={q} onChange={setQ} />
      <div className="mt-4"><Chips items={CATEGORIES} value={cat} onChange={setCat} /></div>
      <div className="mt-4 flex items-center justify-between px-4">
        <p className="text-xs text-muted-foreground">{list.length} résultat{list.length > 1 ? "s" : ""}</p>
        <div className="flex gap-1 rounded-full bg-card p-1 shadow-[var(--shadow-card)]">
          {(["pertinence", "prix", "distance"] as const).map((s) => <button key={s} onClick={() => setSort(s)} className={cn("rounded-full px-3 py-1 text-[11px] font-semibold capitalize", sort === s ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{s}</button>)}
        </div>
      </div>
      {list.length ? <div className="mt-4 grid grid-cols-2 gap-3 px-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        : <Empty icon={<Search />} title="Aucun résultat" body={`Aucun produit ne correspond à « ${q} ». Essayez un autre terme.`} />}
    </div>
  );
}

export function ProductDetail({ id }: { id: string }) {
  const { products, addToCart, push, showToast, back } = useApp();
  const p = products.find((x) => x.id === id)!;
  const prod = PRODUCERS.find((x) => x.id === p.producerId)!;
  const [qty, setQty] = useState(p.minOrder);
  const price = p.promo ? p.price * (1 - p.promo / 100) : p.price;
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="relative h-80">
          <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 top-0"><Header title="" right={<button onClick={() => push({ name: "cart" })} className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]"><ShoppingCart className="h-5 w-5" /></button>} /></div>
        </div>
        <div className="relative -mt-8 rounded-t-[2rem] bg-background px-5 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div><Badge tone="primary">{p.category}</Badge><h1 className="mt-2 font-display text-2xl font-semibold">{p.name}</h1></div>
            <Rating v={p.rating} />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-primary">{fcfa(price)}<span className="text-sm font-medium text-muted-foreground"> /{p.unit}</span>{p.promo && <span className="ml-2 text-sm text-muted-foreground line-through">{fcfa(p.price)}</span>}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[["Stock", qtyFmt(p.qty, p.unit)], ["Minimum", qtyFmt(p.minOrder, p.unit)], ["Lieu", p.location]].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-card p-3 text-center shadow-[var(--shadow-card)]"><p className="text-[10px] text-muted-foreground">{k}</p><p className="text-sm font-bold">{v}</p></div>
            ))}
          </div>
          <h3 className="mt-5 text-sm font-bold">Description</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
          <Card className="mt-5 flex items-center gap-3" onClick={() => push({ name: "producer", params: { id: prod.id } })}>
            <Avatar initials={initials(prod.owner)} />
            <div className="min-w-0 flex-1"><p className="flex items-center gap-1 text-sm font-bold">{prod.name}{prod.verified && <Verified />}</p><p className="text-xs text-muted-foreground">{prod.owner} · {prod.location}</p></div>
            <button onClick={(e) => { e.stopPropagation(); push({ name: "chat", params: { id: "c1" } }); }} className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary"><MessageCircle className="h-5 w-5" /></button>
          </Card>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-accent p-3 text-xs text-accent-foreground"><ShieldCheck className="h-4 w-4" />Paiement sécurisé à la livraison · Producteur vérifié</div>
          {p.available && (
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-bold">Quantité ({p.unit})</span>
              <div className="flex items-center gap-3 rounded-full bg-card p-1 shadow-[var(--shadow-card)]">
                <button onClick={() => setQty(Math.max(p.minOrder, qty - p.minOrder))} className="grid h-9 w-9 place-items-center rounded-full bg-secondary"><Minus className="h-4 w-4" /></button>
                <span className="w-16 text-center font-bold">{qty.toLocaleString("fr-FR")}</span>
                <button onClick={() => setQty(Math.min(p.qty, qty + p.minOrder))} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border bg-card p-4">
        {p.available ? (
          <div className="flex items-center gap-3">
            <div className="flex-1"><p className="text-[11px] text-muted-foreground">Total</p><p className="font-extrabold">{fcfa(price * qty)}</p></div>
            <Btn variant="outline" onClick={() => { addToCart(p.id, qty); showToast("Ajouté au panier"); }}><ShoppingCart className="h-4 w-4" /></Btn>
            <Btn onClick={() => { addToCart(p.id, qty); push({ name: "cart" }); }}>Commander</Btn>
          </div>
        ) : <Btn variant="outline" className="w-full" onClick={() => { showToast("Vous serez alerté du retour en stock"); back(); }}>M'alerter du retour en stock</Btn>}
      </div>
    </div>
  );
}

export function ProducerProfile({ id }: { id: string }) {
  const { products, push } = useApp();
  const p = PRODUCERS.find((x) => x.id === id)!;
  return (
    <div className="pb-6">
      <Header title={p.name} />
      <div className="mx-4 rounded-3xl bg-forest p-5 text-forest-foreground">
        <div className="flex items-center gap-3"><Avatar initials={initials(p.owner)} className="h-14 w-14 bg-gold text-gold-foreground" />
          <div><p className="flex items-center gap-1 font-bold">{p.name}{p.verified && <Verified />}</p><p className="text-xs text-forest-foreground/70">{p.owner} · {p.location}</p></div></div>
        <div className="mt-4 grid grid-cols-3 text-center">
          {[["Note", p.rating], ["Produits", p.products], ["Distance", p.distance + " km"]].map(([k, v]) => <div key={k}><p className="text-lg font-bold">{v}</p><p className="text-[11px] text-forest-foreground/60">{k}</p></div>)}
        </div>
        <Btn variant="gold" className="mt-4 w-full" onClick={() => push({ name: "chat", params: { id: "c1" } })}><MessageCircle className="h-4 w-4" />Contacter</Btn>
      </div>
      <Section title="Produits"><div className="grid grid-cols-2 gap-3 px-4">{products.filter((x) => x.producerId === id).map((x) => <ProductCard key={x.id} p={x} />)}</div></Section>
    </div>
  );
}

export function Cart() {
  const { cart, products, setCartQty, push, clearCart, setOrders, role } = useApp();
  const items = cart.map((c) => ({ ...c, p: products.find((p) => p.id === c.productId)! }));
  const sub = items.reduce((s, i) => s + i.qty * (i.p.promo ? i.p.price * (1 - i.p.promo / 100) : i.p.price), 0);
  const transport = items.length ? 75000 : 0;
  const fee = Math.round(sub * 0.015);
  if (!items.length) return <div><Header title="Panier" /><Empty icon={<ShoppingCart />} title="Votre panier est vide" body="Parcourez le marché pour ajouter des produits." /></div>;
  return (
    <div className="flex h-full flex-col">
      <Header title="Panier" sub={`${items.length} article${items.length > 1 ? "s" : ""}`} />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
        {items.map(({ p, qty }) => (
          <Card key={p.id} className="flex gap-3 p-3">
            <img src={p.img} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2"><p className="truncate text-sm font-bold">{p.name}</p><button onClick={() => setCartQty(p.id, 0)} aria-label="Retirer"><Trash2 className="h-4 w-4 text-muted-foreground" /></button></div>
              <p className="text-xs text-muted-foreground">{p.producer}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-extrabold text-primary">{fcfa(p.price * qty)}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCartQty(p.id, qty - p.minOrder)} className="grid h-7 w-7 place-items-center rounded-full bg-secondary"><Minus className="h-3 w-3" /></button>
                  <span className="text-xs font-bold">{qtyFmt(qty, p.unit)}</span>
                  <button onClick={() => setCartQty(p.id, qty + p.minOrder)} className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"><Plus className="h-3 w-3" /></button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        <Card className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Truck className="h-5 w-5" /></div>
          <div className="flex-1"><p className="text-sm font-bold">Sidiki Transport · Camion 10 t</p><p className="text-xs text-muted-foreground">Livraison estimée : demain avant 18h</p></div></Card>
        <Card>
          <p className="mb-3 text-sm font-bold">Récapitulatif</p>
          {[["Sous-total", fcfa(sub)], ["Transport", fcfa(transport)], ["Frais de service (1,5 %)", fcfa(fee)]].map(([k, v]) => <div key={k} className="flex justify-between py-1 text-sm"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>)}
          <div className="mt-2 flex justify-between border-t border-dashed border-border pt-3"><span className="font-bold">Total</span><span className="text-lg font-extrabold text-primary">{fcfa(sub + transport + fee)}</span></div>
        </Card>
      </div>
      <div className="border-t border-border bg-card p-4">
        <Btn className="w-full" onClick={() => {
          const id = "SL-" + (24900 + Math.floor(Math.random() * 90));
          setOrders((o) => [...items.map((i, k) => ({ id: k ? id + "-" + k : id, productId: i.p.id, qty: i.qty, total: i.qty * i.p.price, status: "en_attente" as const, date: "15 nov. 2026", buyer: role === "commercant" ? "Ousmane Kanté" : "Mariam Konaté", city: "Bamako" })), ...o]);
          clearCart(); push({ name: "confirm", params: { id, total: sub + transport + fee } });
        }}>Confirmer la commande · {fcfa(sub + transport + fee)}</Btn>
      </div>
    </div>
  );
}

export function Confirm({ id, total }: { id: string; total: number }) {
  const { reset, setTab, push } = useApp();
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="grid h-24 w-24 place-items-center rounded-full bg-primary/10 animate-in zoom-in duration-500"><CheckCircle2 className="h-14 w-14 text-primary" /></div>
      <h1 className="mt-6 font-display text-3xl font-semibold">Commande envoyée !</h1>
      <p className="mt-2 text-sm text-muted-foreground">Le producteur a été notifié. Vous recevrez une confirmation dès son acceptation.</p>
      <Card className="mt-6 w-full text-left">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Référence</span><b>{id}</b></div>
        <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Montant</span><b className="text-primary">{fcfa(total)}</b></div>
        <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Paiement</span><b>À la livraison</b></div>
      </Card>
      <div className="mt-8 w-full space-y-3">
        <Btn className="w-full" onClick={() => { reset({ name: "main" }); setTab("orders"); push({ name: "order", params: { id } }); }}>Suivre la commande</Btn>
        <Btn variant="ghost" className="w-full" onClick={() => { reset({ name: "main" }); setTab("home"); }}>Retour à l'accueil</Btn>
      </div>
    </div>
  );
}

const MATCH = [
  { producerId: "p1", price: 350, qty: 12000, quality: "Calibre A" },
  { producerId: "p2", price: 380, qty: 6000, quality: "Calibre A/B" },
  { producerId: "p5", price: 420, qty: 5500, quality: "Calibre B" },
];
export function Matching() {
  const { push, addToCart, showToast } = useApp();
  const [need, setNeed] = useState(5);
  const [sel, setSel] = useState(0);
  const offers = MATCH.map((m) => {
    const pr = PRODUCERS.find((p) => p.id === m.producerId)!;
    const tr = TRANSPORTERS.find((t) => t.cap >= need) ?? TRANSPORTERS[1];
    const goods = m.price * need * 1000;
    const transport = Math.round(pr.distance * need * tr.ratePerKmT / 1000) * 1000;
    return { ...m, pr, tr, goods, transport, total: goods + transport, enough: m.qty >= need * 1000 };
  }).sort((a, b) => a.total - b.total);
  const best = offers[0];
  return (
    <div className="flex h-full flex-col">
      <Header title="Mise en relation intelligente" sub="Producteurs + transport comparés" />
      <div className="flex-1 overflow-y-auto pb-4">
      <div className="mx-4 rounded-3xl bg-forest p-5 text-forest-foreground">
        <p className="text-xs text-forest-foreground/60">Votre besoin</p>
        <p className="mt-1 font-display text-xl font-semibold">{need} tonnes de pommes de terre</p>
        <p className="flex items-center gap-1 text-xs text-forest-foreground/70"><MapPin className="h-3 w-3" />Livraison à Bamako</p>
        <input type="range" min={1} max={12} value={need} onChange={(e) => setNeed(+e.target.value)} className="mt-4 w-full accent-[var(--gold)]" />
        <div className="flex justify-between text-[10px] text-forest-foreground/50"><span>1 t</span><span>12 t</span></div>
      </div>
      <div className="mx-4 mt-4 flex items-center gap-2 rounded-2xl bg-accent p-3 text-xs text-accent-foreground"><Sparkles className="h-4 w-4" />{offers.length} offres analysées · meilleur coût total : <b>{best.pr.location}</b></div>
      <div className="mt-4 space-y-3 px-4">
        {offers.map((o, i) => (
          <button key={o.producerId} onClick={() => setSel(i)} className={cn("w-full rounded-3xl border-2 bg-card p-4 text-left shadow-[var(--shadow-card)] transition", sel === i ? "border-primary" : "border-transparent")}>
            <div className="flex items-center gap-3">
              <Avatar initials={initials(o.pr.owner)} />
              <div className="min-w-0 flex-1"><p className="flex items-center gap-1 truncate text-sm font-bold">{o.pr.name}{o.pr.verified && <Verified />}</p><p className="text-xs text-muted-foreground">{o.pr.location} · {o.pr.distance} km · {o.quality}</p></div>
              {i === 0 && <Badge tone="gold" className="bg-gold text-gold-foreground">Meilleur</Badge>}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-muted p-2"><p className="text-[10px] text-muted-foreground">Prix/kg</p><p className="text-sm font-bold">{o.price} F</p></div>
              <div className="rounded-xl bg-muted p-2"><p className="text-[10px] text-muted-foreground">Dispo</p><p className={cn("text-sm font-bold", !o.enough && "text-destructive")}>{qtyFmt(o.qty)}</p></div>
              <div className="rounded-xl bg-muted p-2"><p className="text-[10px] text-muted-foreground">Note</p><p className="text-sm font-bold">★ {o.pr.rating}</p></div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-secondary/60 p-2.5 text-xs"><Truck className="h-4 w-4 text-primary" /><span className="flex-1">{o.tr.name} · {o.tr.vehicle} {o.tr.cap} t · {o.tr.eta}</span><b>{fcfa(o.transport)}</b></div>
            <div className="mt-3 flex items-end justify-between">
              <div className="text-[11px] text-muted-foreground">Marchandise {fcfa(o.goods)}</div>
              <div className="text-right"><p className="text-[10px] text-muted-foreground">Coût total livré</p><p className="text-lg font-extrabold text-primary">{fcfa(o.total)}</p></div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(best.total / o.total) * 100}%` }} /></div>
          </button>
        ))}
      </div>
      </div>
      <div className="border-t border-border bg-card p-4">
        <Btn className="w-full" onClick={() => { addToCart("a1", need * 1000); showToast("Offre ajoutée au panier"); push({ name: "cart" }); }}>Choisir {offers[sel].pr.name.split(" ")[0]} · {fcfa(offers[sel].total)}</Btn>
      </div>
    </div>
  );
}

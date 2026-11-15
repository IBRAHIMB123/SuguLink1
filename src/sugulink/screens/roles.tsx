// @ts-nocheck -- prototype screens; strict index checks relaxed
import { useState } from "react";
import { Boxes, Camera, Package, Plus, Pencil, Trash2, TrendingUp, Wallet, Clock, Truck, MapPin, Route, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, IMAGES, MISSIONS, VEHICLES, fcfa, qtyFmt, type Category } from "../data";
import { useApp } from "../store";
import { BarChart, Badge, Btn, Card, Field, Header, MapView, Section, Stat, StatusBadge, inputCls } from "../ui";
import { TopBar } from "./buyer";

function Dash({ title, kpis }: { title: string; kpis: [string, string, string, any][] }) {
  return (<>
    <TopBar />
    <Card className="mx-4 mt-4 bg-forest text-forest-foreground">
      <p className="text-xs text-forest-foreground/60">{title}</p>
      <p className="font-display text-2xl font-semibold">{kpis[0][1]}</p>
      <p className="text-xs text-gold">{kpis[0][2]}</p>
      <div className="mt-3"><BarChart data={[42, 55, 38, 70, 64, 88]} labels={["Juin", "Juil", "Août", "Sep", "Oct", "Nov"]} /></div>
    </Card>
    <div className="mt-3 grid grid-cols-2 gap-3 px-4">{kpis.slice(1).map(([l, v, s, I]) => <Stat key={l} label={l} value={v} sub={s} icon={<I className="h-4 w-4" />} />)}</div>
  </>);
}

export function ProducerHome() {
  const { products, orders, push, setTab } = useApp();
  const mine = products.filter((p) => p.producerId === "p1");
  return (
    <div className="pb-6">
      <Dash title="Ventes totales (6 mois)" kpis={[["", "4 860 000 FCFA", "+18 % ce mois", null], ["Produits publiés", String(mine.length), "Actifs", Package], ["Stock disponible", qtyFmt(mine.reduce((s, p) => s + p.qty, 0)), "", Boxes], ["Commandes en attente", String(orders.filter((o) => o.status === "en_attente").length), "À traiter", Clock], ["Revenus du mois", "1 240 000", "FCFA", Wallet]]} />
      <div className="mt-4 px-4"><Btn className="w-full" onClick={() => push({ name: "addProduct" })}><Plus className="h-4 w-4" />Publier un produit</Btn></div>
      <Section title="Transactions récentes" action="Tout voir" onAction={() => setTab("orders")}>
        <div className="space-y-2 px-4">{orders.slice(0, 3).map((o) => <Card key={o.id} onClick={() => push({ name: "order", params: { id: o.id } })} className="flex items-center justify-between p-3"><div><p className="text-sm font-bold">{o.buyer}</p><p className="text-xs text-muted-foreground">{o.id}</p></div><div className="text-right"><p className="text-sm font-bold text-primary">{fcfa(o.total)}</p><StatusBadge s={o.status} /></div></Card>)}</div>
      </Section>
      <Section title="Performance produits"><div className="space-y-3 px-4">{mine.map((p, i) => <Card key={p.id} className="p-3"><div className="flex justify-between text-sm"><b>{p.name}</b><span className="text-primary">{[82, 64][i] ?? 40} %</span></div><div className="mt-2 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${[82, 64][i] ?? 40}%` }} /></div></Card>)}</div></Section>
    </div>
  );
}

export function MyProducts({ title = "Mes produits" }: { title?: string }) {
  const { products, setProducts, push, showToast } = useApp();
  const mine = products.filter((p) => p.producerId === "p1" || p.producerId === "me");
  return (
    <div className="pb-6">
      <div className="flex items-center justify-between px-4 pb-3 pt-5"><h1 className="font-display text-2xl font-semibold">{title}</h1><Btn className="h-10" onClick={() => push({ name: "addProduct" })}><Plus className="h-4 w-4" />Ajouter</Btn></div>
      <div className="space-y-3 px-4">{mine.map((p) => (
        <Card key={p.id} className="flex gap-3 p-3">
          <img src={p.img} alt="" className="h-20 w-20 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{p.name}</p>
            <p className="text-sm font-bold text-primary">{fcfa(p.price)}/{p.unit}</p>
            <p className="text-xs text-muted-foreground">Stock : {qtyFmt(p.qty, p.unit)}</p>
            <div className="mt-2 flex items-center gap-2">
              <button onClick={() => setProducts((ps) => ps.map((x) => x.id === p.id ? { ...x, available: !x.available } : x))}><Badge tone={p.available ? "primary" : "muted"}>{p.available ? "Disponible" : "Masqué"}</Badge></button>
              <button onClick={() => push({ name: "addProduct", params: { id: p.id } })} className="ml-auto text-muted-foreground"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => { setProducts((ps) => ps.filter((x) => x.id !== p.id)); showToast("Produit supprimé"); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </Card>))}</div>
    </div>
  );
}

export function AddProduct({ id }: { id?: string }) {
  const { products, setProducts, back, showToast } = useApp();
  const ex = products.find((p) => p.id === id);
  const [f, setF] = useState({ name: ex?.name ?? "", category: (ex?.category ?? "Légumes") as Category, price: ex?.price ?? 0, unit: ex?.unit ?? "kg", qty: ex?.qty ?? 0, location: ex?.location ?? "Sikasso", desc: ex?.desc ?? "" });
  const [img, setImg] = useState(ex?.img ?? "");
  const save = () => {
    if (!f.name || !f.price) return showToast("Nom et prix requis");
    setProducts((ps) => ex ? ps.map((p) => p.id === ex.id ? { ...p, ...f, img: img || p.img } : p) : [{ ...f, id: "n" + Date.now(), img: img || IMAGES.onions, minOrder: 50, producer: "Coopérative Sikasso Bio", producerId: "p1", available: true, rating: 5, distance: 375 } as any, ...ps]);
    showToast(ex ? "Produit modifié" : "Produit publié"); back();
  };
  return (
    <div className="flex h-full flex-col">
      <Header title={ex ? "Modifier le produit" : "Publier un produit"} />
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">{[IMAGES.potatoes, IMAGES.onions, IMAGES.mangoes].map((s) => <button key={s} onClick={() => setImg(s)} className={cn("aspect-square overflow-hidden rounded-2xl border-2", img === s ? "border-primary" : "border-transparent")}><img src={s} alt="" className="h-full w-full object-cover" /></button>)}</div>
        <label className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card text-sm font-semibold text-muted-foreground"><Camera className="h-5 w-5" />Ajouter des photos<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setImg(URL.createObjectURL(e.target.files[0]))} /></label>
        <Field label="Nom du produit"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ex. Oignons violets" /></Field>
        <Field label="Catégorie"><select className={inputCls} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })}>{CATEGORIES.slice(1).map((c) => <option key={c}>{c}</option>)}</select></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prix (FCFA)"><input type="number" className={inputCls} value={f.price || ""} onChange={(e) => setF({ ...f, price: +e.target.value })} /></Field>
          <Field label="Unité"><select className={inputCls} value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value as any })}><option value="kg">par kg</option><option value="sac">par sac</option><option value="unité">par unité</option></select></Field>
        </div>
        <Field label="Quantité disponible"><input type="number" className={inputCls} value={f.qty || ""} onChange={(e) => setF({ ...f, qty: +e.target.value })} /></Field>
        <Field label="Lieu de production"><input className={inputCls} value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></Field>
        <Field label="Description"><textarea rows={3} className={cn(inputCls, "h-auto py-3")} value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} /></Field>
      </div>
      <div className="border-t border-border bg-card p-4"><Btn className="w-full" onClick={save}>{ex ? "Enregistrer" : "Publier"}</Btn></div>
    </div>
  );
}

export function MerchantHome() {
  const { push, setTab } = useApp();
  return (
    <div className="pb-6">
      <Dash title="Chiffre d'affaires (6 mois)" kpis={[["", "12 450 000 FCFA", "+9 % ce mois", null], ["Stock total", "18,4 t", "6 références", Boxes], ["Commandes entrantes", "7", "Clients", Package], ["Commandes sortantes", "4", "Fournisseurs", Truck], ["Marge moyenne", "14 %", "", TrendingUp]]} />
      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        <Btn onClick={() => setTab("market")}>Acheter en gros</Btn>
        <Btn variant="outline" onClick={() => push({ name: "matching" })}>Comparer les prix</Btn>
      </div>
    </div>
  );
}

export function Inventory() {
  const { products, push } = useApp();
  const inv = products.slice(0, 6).map((p, i) => ({ p, stock: [3200, 1800, 450, 5200, 900, 0][i], buy: p.price, sell: Math.round(p.price * 1.15) }));
  return (
    <div className="pb-6">
      <div className="flex items-center justify-between px-4 pb-3 pt-5"><h1 className="font-display text-2xl font-semibold">Inventaire</h1><Btn className="h-10" onClick={() => push({ name: "addProduct" })}><Plus className="h-4 w-4" />Revendre</Btn></div>
      <div className="space-y-2 px-4">{inv.map(({ p, stock, buy, sell }) => (
        <Card key={p.id} className="p-3"><div className="flex items-center gap-3"><img src={p.img} alt="" className="h-12 w-12 rounded-xl object-cover" /><div className="flex-1"><p className="text-sm font-bold">{p.name}</p><p className="text-xs text-muted-foreground">Achat {buy} F · Vente {sell} F</p></div><Badge tone={stock === 0 ? "destructive" : stock < 1000 ? "warning" : "primary"}>{stock === 0 ? "Rupture" : qtyFmt(stock)}</Badge></div></Card>))}</div>
    </div>
  );
}

export function TransporterHome() {
  const { push, setTab } = useApp();
  const [online, setOnline] = useState(true);
  return (
    <div className="pb-6">
      <TopBar />
      <Card className="mx-4 mt-4 flex items-center justify-between"><div><p className="text-sm font-bold">{online ? "Disponible" : "Hors ligne"}</p><p className="text-xs text-muted-foreground">Camion 10 t · AB-4521-MD · Bamako</p></div><button onClick={() => setOnline(!online)} className={cn("relative h-7 w-12 rounded-full", online ? "bg-primary" : "bg-border")}><span className={cn("absolute top-1 h-5 w-5 rounded-full bg-card transition-all", online ? "left-6" : "left-1")} /></button></Card>
      <div className="mt-3 grid grid-cols-2 gap-3 px-4">
        <Stat dark label="Gains du mois" value="1 860 000" sub="FCFA" icon={<Wallet className="h-4 w-4" />} />
        <Stat label="Livraisons" value="23" sub="98 % à l'heure" icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>
      <Section title="Livraison active" action="Suivi" onAction={() => setTab("map")}><div className="px-4"><MapView className="h-40" /><Card className="mt-2 flex items-center justify-between p-3"><div><p className="text-sm font-bold">Sikasso → Bamako</p><p className="text-xs text-muted-foreground">5 t pommes de terre · 142 km restants</p></div><Badge tone="gold">En route</Badge></Card></div></Section>
      <Section title="Mes véhicules" action="Ajouter" onAction={() => push({ name: "vehicle" })}><div className="no-scrollbar flex gap-3 overflow-x-auto px-4">{VEHICLES.map((v) => <Card key={v.id} className="w-32 shrink-0 p-3"><Truck className="h-6 w-6 text-primary" /><p className="mt-2 text-sm font-bold">{v.label}</p><p className="text-xs text-muted-foreground">{v.cap} t · {v.rate} F/km·t</p></Card>)}</div></Section>
    </div>
  );
}

export function Missions() {
  const { showToast } = useApp();
  const [st, setSt] = useState<Record<string, string>>({});
  return (
    <div className="pb-6">
      <h1 className="px-4 pb-3 pt-5 font-display text-2xl font-semibold">Demandes de transport</h1>
      <div className="space-y-3 px-4">{MISSIONS.map((m) => (
        <Card key={m.id}>
          <div className="flex justify-between"><p className="text-xs text-muted-foreground">{m.id} · {m.pickup}</p>{st[m.id] && <Badge tone={st[m.id] === "ok" ? "primary" : "destructive"}>{st[m.id] === "ok" ? "Acceptée" : "Refusée"}</Badge>}</div>
          <p className="mt-2 flex items-center gap-2 font-bold"><MapPin className="h-4 w-4 text-primary" />{m.from}<Route className="h-4 w-4 text-muted-foreground" />{m.to}</p>
          <p className="text-xs text-muted-foreground">{m.cargo} · {m.weight} t · {m.distance} km</p>
          <p className="mt-2 text-lg font-extrabold text-primary">{fcfa(m.pay)}</p>
          {!st[m.id] && <div className="mt-3 grid grid-cols-2 gap-2"><Btn variant="danger" className="h-10" onClick={() => setSt({ ...st, [m.id]: "no" })}>Refuser</Btn><Btn className="h-10" onClick={() => { setSt({ ...st, [m.id]: "ok" }); showToast("Mission acceptée"); }}>Accepter</Btn></div>}
        </Card>))}</div>
    </div>
  );
}

export function VehicleForm() {
  const { back, showToast } = useApp();
  const [v, setV] = useState("camion");
  return (
    <div className="flex h-full flex-col">
      <Header title="Enregistrer un véhicule" />
      <div className="flex-1 space-y-4 overflow-y-auto px-4">
        <div className="grid grid-cols-3 gap-2">{VEHICLES.map((x) => <button key={x.id} onClick={() => setV(x.id)} className={cn("rounded-2xl border-2 bg-card p-3 text-xs font-semibold", v === x.id ? "border-primary" : "border-transparent")}><Truck className="mx-auto mb-1 h-5 w-5 text-primary" />{x.label}</button>)}</div>
        <Field label="Immatriculation"><input className={inputCls} placeholder="AB-0000-MD" /></Field>
        <Field label="Charge maximale (t)"><input className={inputCls} defaultValue={VEHICLES.find((x) => x.id === v)!.cap} /></Field>
        <Field label="Zones desservies"><input className={inputCls} defaultValue="Bamako, Sikasso, Ségou" /></Field>
        <Field label="Tarif (FCFA / km / t)"><input className={inputCls} defaultValue={VEHICLES.find((x) => x.id === v)!.rate} /></Field>
      </div>
      <div className="p-4"><Btn className="w-full" onClick={() => { showToast("Véhicule enregistré"); back(); }}>Enregistrer</Btn></div>
    </div>
  );
}

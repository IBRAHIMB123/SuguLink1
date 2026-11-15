// @ts-nocheck -- prototype screens; strict index checks relaxed
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Eye, Lock, Phone, ShoppingBasket, Sprout, Store, Truck, Camera, Handshake, Route, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES, ROLES, USERS, type Role } from "../data";
import { useApp } from "../store";
import { Btn, Field, Header, Logo, inputCls } from "../ui";

export const roleIcon = { producteur: Sprout, commercant: Store, transporteur: Truck, acheteur: ShoppingBasket };

export function Splash() {
  const { reset } = useApp();
  useEffect(() => { const t = setTimeout(() => reset({ name: "welcome" }), 1800); return () => clearTimeout(t); }, []);
  return (
    <div className="flex h-full flex-col items-center justify-center bg-forest">
      <div className="animate-in fade-in zoom-in-95 duration-700"><Logo light size="lg" /></div>
      <p className="mt-4 text-sm text-forest-foreground/60">Le marché agricole connecté</p>
      <div className="absolute bottom-16 h-1 w-24 overflow-hidden rounded-full bg-forest-foreground/10"><div className="h-full w-1/2 animate-pulse rounded-full bg-gold" /></div>
    </div>
  );
}

export function Welcome() {
  const { push } = useApp();
  return (
    <div className="relative flex h-full flex-col bg-forest">
      <div className="relative h-[58%]">
        <img src={IMAGES.mangoes} alt="Mangues de Sikasso" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/30 via-transparent to-forest" />
        <div className="absolute left-5 top-6"><Logo light /></div>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-8">
        <h1 className="font-display text-[2rem] font-semibold leading-tight text-forest-foreground">Du champ au marché, <span className="italic text-gold">sans intermédiaire.</span></h1>
        <p className="mt-3 text-sm text-forest-foreground/70">Producteurs, commerçants, transporteurs et acheteurs du Mali réunis sur une seule plateforme.</p>
        <div className="mt-auto space-y-3">
          <Btn className="w-full" onClick={() => push({ name: "onboarding" })}>Commencer <ArrowRight className="h-4 w-4" /></Btn>
          <Btn variant="ghost" className="w-full text-forest-foreground" onClick={() => push({ name: "login" })}>J'ai déjà un compte</Btn>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { icon: Handshake, title: "Vendez directement", body: "Les producteurs publient leurs récoltes et fixent leurs prix. Fini les intermédiaires qui prennent la marge.", img: IMAGES.potatoes },
  { icon: Route, title: "Transport organisé", body: "Trouvez un transporteur fiable en quelques secondes, du tricycle au poids lourd, avec suivi en temps réel.", img: IMAGES.yams },
  { icon: ShieldCheck, title: "Commerce de confiance", body: "Profils vérifiés, notes et historique : achetez en gros en toute sérénité, partout au Mali.", img: IMAGES.rice },
];
export function Onboarding() {
  const { push } = useApp();
  const [i, setI] = useState(0);
  const s = SLIDES[i]; const Icon = s.icon;
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex justify-end p-4"><button onClick={() => push({ name: "register" })} className="text-sm font-semibold text-muted-foreground">Passer</button></div>
      <div key={i} className="animate-screen flex flex-1 flex-col px-6">
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-float)]">
          <img src={s.img} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-4 left-4 grid h-14 w-14 place-items-center rounded-2xl bg-card text-primary shadow-lg"><Icon className="h-7 w-7" /></div>
        </div>
        <h2 className="mt-8 font-display text-3xl font-semibold">{s.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
      </div>
      <div className="flex items-center justify-between p-6">
        <div className="flex gap-1.5">{SLIDES.map((_, k) => <span key={k} className={cn("h-2 rounded-full transition-all", k === i ? "w-7 bg-primary" : "w-2 bg-border")} />)}</div>
        <Btn onClick={() => (i < 2 ? setI(i + 1) : push({ name: "register" }))}>{i < 2 ? "Suivant" : "Créer un compte"} <ArrowRight className="h-4 w-4" /></Btn>
      </div>
    </div>
  );
}

function PhoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex h-12 items-center gap-2 rounded-2xl border border-border bg-card px-4 focus-within:border-primary">
      <span className="text-sm font-semibold">🇲🇱 +223</span><span className="h-5 w-px bg-border" />
      <input value={value} onChange={(e) => onChange(e.target.value)} inputMode="tel" placeholder="70 12 45 78" className="flex-1 bg-transparent text-sm outline-none" />
    </div>
  );
}

export function Login() {
  const { push, setRole, reset, setTab } = useApp();
  const [phone, setPhone] = useState("70 12 45 78");
  const [role, setR] = useState<Role>("acheteur");
  return (
    <div className="flex h-full flex-col">
      <Header title="" />
      <div className="flex-1 px-6">
        <h1 className="font-display text-3xl font-semibold">Bon retour 👋</h1>
        <p className="mt-2 text-sm text-muted-foreground">Connectez-vous avec votre numéro de téléphone.</p>
        <div className="mt-8 space-y-4">
          <Field label="Numéro de téléphone"><PhoneInput value={phone} onChange={setPhone} /></Field>
          <Field label="Mot de passe"><div className="relative"><input type="password" defaultValue="sugulink" className={inputCls} /><Eye className="absolute right-4 top-3.5 h-5 w-5 text-muted-foreground" /></div></Field>
          <button onClick={() => push({ name: "forgot" })} className="text-xs font-semibold text-primary">Mot de passe oublié ?</button>
          <Field label="Démo : se connecter en tant que">
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => { const I = roleIcon[r.id]; return (
                <button key={r.id} onClick={() => setR(r.id)} className={cn("flex items-center gap-2 rounded-2xl border p-3 text-xs font-semibold", role === r.id ? "border-primary bg-primary/5 text-primary" : "border-border bg-card")}><I className="h-4 w-4" />{r.label}</button>
              ); })}
            </div>
          </Field>
        </div>
      </div>
      <div className="space-y-3 p-6">
        <Btn className="w-full" onClick={() => { setRole(role); setTab("home"); reset({ name: "main" }); }}>Se connecter</Btn>
        <p className="text-center text-sm text-muted-foreground">Nouveau ? <button onClick={() => push({ name: "register" })} className="font-semibold text-primary">Créer un compte</button></p>
      </div>
    </div>
  );
}

export function Register() {
  const { push } = useApp();
  const [phone, setPhone] = useState("");
  return (
    <div className="flex h-full flex-col">
      <Header title="Créer un compte" sub="Étape 1 sur 4" />
      <div className="flex-1 space-y-4 px-6">
        <Progress step={1} />
        <h2 className="pt-2 font-display text-2xl font-semibold">Rejoignez SuguLink</h2>
        <Field label="Nom complet"><input className={inputCls} placeholder="Ex. Mariam Konaté" /></Field>
        <Field label="Numéro de téléphone"><PhoneInput value={phone} onChange={setPhone} /></Field>
        <Field label="Mot de passe"><input type="password" className={inputCls} placeholder="8 caractères minimum" /></Field>
        <label className="flex items-start gap-2 text-xs text-muted-foreground"><input type="checkbox" defaultChecked className="mt-0.5 accent-[var(--primary)]" />J'accepte les conditions d'utilisation et la politique de confidentialité de SuguLink.</label>
      </div>
      <div className="p-6"><Btn className="w-full" onClick={() => push({ name: "role" })}>Continuer</Btn></div>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return <div className="flex gap-1.5">{[1, 2, 3, 4].map((s) => <span key={s} className={cn("h-1.5 flex-1 rounded-full", s <= step ? "bg-primary" : "bg-border")} />)}</div>;
}

export function RoleSelect() {
  const { push, setRole } = useApp();
  const [r, setR] = useState<Role | null>(null);
  return (
    <div className="flex h-full flex-col">
      <Header title="Type de compte" sub="Étape 2 sur 4" />
      <div className="flex-1 space-y-3 px-6">
        <Progress step={2} />
        <h2 className="pt-2 font-display text-2xl font-semibold">Quel est votre métier ?</h2>
        <p className="text-sm text-muted-foreground">Votre espace sera personnalisé selon votre activité.</p>
        {ROLES.map((x) => { const I = roleIcon[x.id]; const on = r === x.id; return (
          <button key={x.id} onClick={() => setR(x.id)} className={cn("flex w-full items-center gap-4 rounded-3xl border-2 bg-card p-4 text-left transition", on ? "border-primary shadow-[var(--shadow-card)]" : "border-transparent shadow-[var(--shadow-card)]")}>
            <div className={cn("grid h-12 w-12 place-items-center rounded-2xl", on ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}><I className="h-6 w-6" /></div>
            <div className="flex-1"><p className="font-bold">{x.label}</p><p className="text-xs text-muted-foreground">{x.desc}</p></div>
            <span className={cn("grid h-6 w-6 place-items-center rounded-full border-2", on ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{on && <Check className="h-3.5 w-3.5" />}</span>
          </button>
        ); })}
      </div>
      <div className="p-6"><Btn disabled={!r} className="w-full" onClick={() => { setRole(r!); push({ name: "profileSetup" }); }}>Continuer</Btn></div>
    </div>
  );
}

export function ProfileSetup() {
  const { push, role } = useApp();
  const u = USERS[role];
  return (
    <div className="flex h-full flex-col">
      <Header title="Votre profil" sub="Étape 3 sur 4" />
      <div className="flex-1 space-y-4 overflow-y-auto px-6">
        <Progress step={3} />
        <div className="flex flex-col items-center py-2">
          <div className="relative grid h-24 w-24 place-items-center rounded-full bg-secondary text-2xl font-bold text-primary">{u.initials}
            <span className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><Camera className="h-4 w-4" /></span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Ajouter une photo</p>
        </div>
        <Field label={role === "acheteur" ? "Nom ou entreprise" : "Nom de l'exploitation / entreprise"}><input className={inputCls} defaultValue={u.org} /></Field>
        <Field label="Région"><select className={inputCls} defaultValue={u.location.includes("Bamako") ? "Bamako" : u.location}>{["Bamako", "Sikasso", "Ségou", "Koutiala", "Kayes", "Mopti", "Kati", "Niono", "Gao"].map((c) => <option key={c}>{c}</option>)}</select></Field>
        {role === "transporteur" && <Field label="Type de véhicule principal"><select className={inputCls}><option>Camion (10 t)</option><option>Pickup</option><option>Tricycle</option></select></Field>}
        {role === "producteur" && <Field label="Cultures principales"><input className={inputCls} defaultValue="Pommes de terre, mangues" /></Field>}
        <Field label="Langue préférée"><select className={inputCls}><option>Français</option><option>Bambara</option></select></Field>
      </div>
      <div className="p-6"><Btn className="w-full" onClick={() => push({ name: "otp" })}>Continuer</Btn></div>
    </div>
  );
}

export function Otp() {
  const { reset, setTab, role } = useApp();
  const [code, setCode] = useState(["", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const full = code.every(Boolean);
  return (
    <div className="flex h-full flex-col">
      <Header title="Vérification" sub="Étape 4 sur 4" />
      <div className="flex-1 px-6">
        <Progress step={4} />
        <div className="mt-8 grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-primary"><Phone className="h-7 w-7" /></div>
        <h2 className="mt-5 font-display text-2xl font-semibold">Code envoyé par SMS</h2>
        <p className="mt-2 text-sm text-muted-foreground">Saisissez le code à 4 chiffres envoyé au <b className="text-foreground">{USERS[role].phone}</b></p>
        <div className="mt-8 flex justify-between gap-3">
          {code.map((c, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} value={c} maxLength={1} inputMode="numeric"
              onChange={(e) => { const v = e.target.value.replace(/\D/, ""); const n = [...code]; n[i] = v; setCode(n); if (v && i < 3) refs.current[i + 1]?.focus(); }}
              className="h-16 w-full rounded-2xl border-2 border-border bg-card text-center text-2xl font-bold outline-none focus:border-primary" />
          ))}
        </div>
        <button onClick={() => setCode(["2", "0", "2", "6"])} className="mt-6 text-sm text-muted-foreground">Pas reçu ? <span className="font-semibold text-primary">Renvoyer (remplir démo)</span></button>
      </div>
      <div className="p-6"><Btn disabled={!full} className="w-full" onClick={() => { setTab("home"); reset({ name: "main" }); }}>Vérifier et entrer</Btn></div>
    </div>
  );
}

export function Forgot() {
  const { back, showToast } = useApp();
  const [phone, setPhone] = useState("");
  return (
    <div className="flex h-full flex-col">
      <Header title="Mot de passe oublié" />
      <div className="flex-1 px-6">
        <div className="mt-4 grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-foreground"><Lock className="h-7 w-7" /></div>
        <h2 className="mt-5 font-display text-2xl font-semibold">Réinitialiser</h2>
        <p className="mt-2 text-sm text-muted-foreground">Nous vous enverrons un code par SMS pour créer un nouveau mot de passe.</p>
        <div className="mt-6"><Field label="Numéro de téléphone"><PhoneInput value={phone} onChange={setPhone} /></Field></div>
      </div>
      <div className="p-6"><Btn className="w-full" onClick={() => { showToast("Code de réinitialisation envoyé"); back(); }}>Envoyer le code</Btn></div>
    </div>
  );
}

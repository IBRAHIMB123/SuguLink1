// @ts-nocheck -- prototype screens; strict index checks relaxed
import { Home, Search, Package, MessageCircle, User, Boxes, Store, Truck, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppProvider, useApp } from "./store";
import * as A from "./screens/auth";
import * as B from "./screens/buyer";
import * as C from "./screens/common";
import * as R from "./screens/roles";

const TABS = {
  acheteur: [["home", "Accueil", Home], ["search", "Marché", Search], ["orders", "Commandes", Package], ["messages", "Messages", MessageCircle], ["profile", "Profil", User]],
  producteur: [["home", "Accueil", Home], ["products", "Produits", Boxes], ["orders", "Commandes", Package], ["messages", "Messages", MessageCircle], ["profile", "Profil", User]],
  commercant: [["home", "Accueil", Home], ["market", "Marché", Store], ["inventory", "Stock", Boxes], ["orders", "Commandes", Package], ["profile", "Profil", User]],
  transporteur: [["home", "Accueil", Home], ["missions", "Missions", Truck], ["map", "Suivi", Map], ["messages", "Messages", MessageCircle], ["profile", "Profil", User]],
} as const;

function Main() {
  const { role, tab, setTab } = useApp();
  const body = (() => {
    if (tab === "profile") return <C.Profile />;
    if (tab === "messages") return <C.Messages />;
    if (tab === "orders") return <C.Orders title={role === "producteur" ? "Demandes d'achat" : "Commandes"} incoming={role !== "acheteur"} />;
    if (tab === "search" || tab === "market") return <B.Explore title={role === "commercant" ? "Fournisseurs & produits" : "Marché"} />;
    if (tab === "products") return <R.MyProducts />;
    if (tab === "inventory") return <R.Inventory />;
    if (tab === "missions") return <R.Missions />;
    if (tab === "map") return <C.MapScreen />;
    return { acheteur: <B.BuyerHome />, producteur: <R.ProducerHome />, commercant: <R.MerchantHome />, transporteur: <R.TransporterHome /> }[role];
  })();
  return (
    <div className="flex h-full flex-col">
      <div key={tab} className="animate-screen flex-1 overflow-y-auto">{body}</div>
      <nav className="flex border-t border-border bg-card px-2 pb-2 pt-1.5">
        {TABS[role].map(([id, label, I]) => (
          <button key={id} onClick={() => setTab(id)} className={cn("flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-semibold", tab === id ? "text-primary" : "text-muted-foreground")}>
            <span className={cn("grid h-8 w-12 place-items-center rounded-full transition", tab === id && "bg-secondary")}><I className="h-5 w-5" /></span>{label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Router() {
  const { stack, toast } = useApp();
  const s = stack[stack.length - 1]; const p = s.params ?? {};
  const map: Record<string, any> = {
    splash: <A.Splash />, welcome: <A.Welcome />, onboarding: <A.Onboarding />, login: <A.Login />, register: <A.Register />, role: <A.RoleSelect />, profileSetup: <A.ProfileSetup />, otp: <A.Otp />, forgot: <A.Forgot />,
    main: <Main />, product: <B.ProductDetail id={p.id} />, producer: <B.ProducerProfile id={p.id} />, cart: <B.Cart />, confirm: <B.Confirm id={p.id} total={p.total} />, matching: <B.Matching />,
    order: <C.OrderDetail id={p.id} />, chat: <C.Chat id={p.id} />, notifications: <C.Notifications />, profileEdit: <C.ProfileEdit />, settings: <C.Settings />, help: <C.Help />, map: <C.MapScreen />,
    addProduct: <R.AddProduct id={p.id} />, vehicle: <R.VehicleForm />,
  };
  return (
    <div className="relative h-full">
      <div key={stack.length + s.name} className="animate-screen h-full overflow-y-auto">{map[s.name]}</div>
      {toast && <div className="absolute inset-x-4 bottom-24 z-50 rounded-2xl bg-forest px-4 py-3 text-center text-sm font-semibold text-forest-foreground shadow-[var(--shadow-float)] animate-in fade-in slide-in-from-bottom-2">{toast}</div>}
    </div>
  );
}

export function SuguLinkApp() {
  return (
    <AppProvider>
      <div className="flex min-h-screen items-center justify-center bg-forest md:p-8">
        <div className="h-[100dvh] w-full overflow-hidden bg-background md:h-[860px] md:max-w-[400px] md:rounded-[2.75rem] md:border-[10px] md:border-forest-foreground/10 md:shadow-[var(--shadow-float)]">
          <Router />
        </div>
      </div>
    </AppProvider>
  );
}

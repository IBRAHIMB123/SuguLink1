import { createContext, useContext, useState, type ReactNode } from "react";
import { ORDERS, PRODUCTS, NOTIFICATIONS, type Order, type Product, type Role } from "./data";

export type Screen = { name: string; params?: Record<string, any> };
type CartItem = { productId: string; qty: number };

type Ctx = {
  role: Role; setRole: (r: Role) => void;
  stack: Screen[]; push: (s: Screen) => void; back: () => void; reset: (s: Screen) => void;
  tab: string; setTab: (t: string) => void;
  products: Product[]; setProducts: (fn: (p: Product[]) => Product[]) => void;
  cart: CartItem[]; addToCart: (id: string, qty: number) => void; setCartQty: (id: string, qty: number) => void; clearCart: () => void;
  orders: Order[]; setOrders: (fn: (o: Order[]) => Order[]) => void;
  notifs: typeof NOTIFICATIONS; markRead: (id?: string) => void;
  toast: string | null; showToast: (m: string) => void;
};
const C = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("acheteur");
  const [stack, setStack] = useState<Screen[]>([{ name: "splash" }]);
  const [tab, setTab] = useState("home");
  const [products, setP] = useState(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setO] = useState(ORDERS);
  const [notifs, setN] = useState(NOTIFICATIONS);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200); };
  return (
    <C.Provider value={{
      role, setRole, stack, tab, setTab, products, cart, orders, notifs, toast, showToast,
      push: (s) => setStack((st) => [...st, s]),
      back: () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)),
      reset: (s) => setStack([s]),
      setProducts: (fn) => setP(fn), setOrders: (fn) => setO(fn),
      addToCart: (id, qty) => setCart((c) => c.some((i) => i.productId === id) ? c.map((i) => i.productId === id ? { ...i, qty: i.qty + qty } : i) : [...c, { productId: id, qty }]),
      setCartQty: (id, qty) => setCart((c) => qty <= 0 ? c.filter((i) => i.productId !== id) : c.map((i) => i.productId === id ? { ...i, qty } : i)),
      clearCart: () => setCart([]),
      markRead: (id) => setN((n) => n.map((x) => (!id || x.id === id ? { ...x, read: true } : x))),
    }}>{children}</C.Provider>
  );
}
export const useApp = () => { const c = useContext(C); if (!c) throw new Error("no ctx"); return c; };

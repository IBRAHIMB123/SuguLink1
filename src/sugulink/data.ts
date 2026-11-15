import potatoes from "@/assets/potatoes.jpg";
import rice from "@/assets/rice.jpg";
import mangoes from "@/assets/mangoes.jpg";
import onions from "@/assets/onions.jpg";
import peanuts from "@/assets/peanuts.jpg";
import yams from "@/assets/yams.jpg";

export type Role = "producteur" | "commercant" | "transporteur" | "acheteur";
export const ROLES: { id: Role; label: string; desc: string }[] = [
  { id: "producteur", label: "Producteur", desc: "Je cultive et vends mes récoltes" },
  { id: "commercant", label: "Commerçant", desc: "J'achète en gros et revends" },
  { id: "transporteur", label: "Transporteur", desc: "Je transporte les marchandises" },
  { id: "acheteur", label: "Acheteur", desc: "J'achète des produits agricoles" },
];

export const CATEGORIES = ["Tous", "Céréales", "Légumes", "Fruits", "Tubercules", "Légumineuses", "Élevage", "Autres"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: string; name: string; category: Category; price: number; unit: "kg" | "sac" | "unité";
  qty: number; minOrder: number; producer: string; producerId: string; location: string;
  img: string; available: boolean; rating: number; desc: string; promo?: number; distance: number;
};

export const IMAGES = { potatoes, rice, mangoes, onions, peanuts, yams };

export const PRODUCERS = [
  { id: "p1", name: "Coopérative Sikasso Bio", owner: "Aminata Traoré", location: "Sikasso", rating: 4.9, products: 18, verified: true, distance: 375 },
  { id: "p2", name: "Ferme Diallo & Fils", owner: "Moussa Diallo", location: "Ségou", rating: 4.7, products: 11, verified: true, distance: 235 },
  { id: "p3", name: "GIE Femmes de Koutiala", owner: "Fatoumata Coulibaly", location: "Koutiala", rating: 4.8, products: 9, verified: true, distance: 395 },
  { id: "p4", name: "Office du Niger – Lot 12", owner: "Bakary Keïta", location: "Niono", rating: 4.6, products: 6, verified: false, distance: 340 },
  { id: "p5", name: "Jardins de Kati", owner: "Oumar Sangaré", location: "Kati", rating: 4.5, products: 14, verified: true, distance: 15 },
];

export const PRODUCTS: Product[] = [
  { id: "a1", name: "Pommes de terre Sikasso", category: "Tubercules", price: 350, unit: "kg", qty: 12000, minOrder: 100, producer: "Coopérative Sikasso Bio", producerId: "p1", location: "Sikasso", img: potatoes, available: true, rating: 4.9, distance: 375, promo: 10, desc: "Pommes de terre fraîchement récoltées, calibre moyen à gros, idéales pour la restauration et la revente. Stockées en entrepôt ventilé." },
  { id: "a2", name: "Riz Gambiaka local", category: "Céréales", price: 450, unit: "kg", qty: 25000, minOrder: 50, producer: "Office du Niger – Lot 12", producerId: "p4", location: "Niono", img: rice, available: true, rating: 4.6, distance: 340, desc: "Riz Gambiaka décortiqué de l'Office du Niger, grain long, parfumé. Conditionné en sacs de 50 kg." },
  { id: "a3", name: "Mangues Kent export", category: "Fruits", price: 300, unit: "kg", qty: 4000, minOrder: 200, producer: "Coopérative Sikasso Bio", producerId: "p1", location: "Sikasso", img: mangoes, available: true, rating: 4.8, distance: 375, promo: 15, desc: "Mangues Kent qualité export, maturité contrôlée, triées à la main. Parfaites pour le marché frais et la transformation." },
  { id: "a4", name: "Oignons violets de Ségou", category: "Légumes", price: 400, unit: "kg", qty: 8000, minOrder: 100, producer: "Ferme Diallo & Fils", producerId: "p2", location: "Ségou", img: onions, available: true, rating: 4.7, distance: 235, desc: "Oignons violets séchés, bonne conservation (3 mois). Récolte de la saison sèche." },
  { id: "a5", name: "Arachides décortiquées", category: "Légumineuses", price: 650, unit: "kg", qty: 3500, minOrder: 50, producer: "GIE Femmes de Koutiala", producerId: "p3", location: "Koutiala", img: peanuts, available: true, rating: 4.8, distance: 395, desc: "Arachides de qualité supérieure, triées par le GIE des femmes de Koutiala. Idéales pour huile et pâte." },
  { id: "a6", name: "Igname & patate douce", category: "Tubercules", price: 375, unit: "kg", qty: 0, minOrder: 100, producer: "Jardins de Kati", producerId: "p5", location: "Kati", img: yams, available: false, rating: 4.5, distance: 15, desc: "Ignames et patates douces fraîches de Kati. Nouvelle récolte attendue dans 2 semaines." },
  { id: "a7", name: "Tomates fraîches", category: "Légumes", price: 500, unit: "kg", qty: 1800, minOrder: 30, producer: "Jardins de Kati", producerId: "p5", location: "Kati", img: onions, available: true, rating: 4.4, distance: 15, desc: "Tomates rondes cueillies le matin, livrées à Bamako en moins de 2 heures." },
  { id: "a8", name: "Mil Souna", category: "Céréales", price: 300, unit: "kg", qty: 15000, minOrder: 100, producer: "Ferme Diallo & Fils", producerId: "p2", location: "Ségou", img: rice, available: true, rating: 4.6, distance: 235, desc: "Mil Souna nettoyé et séché, idéal pour le tô et la bouillie." },
];

export const fcfa = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
export const qtyFmt = (n: number, u = "kg") => (u === "kg" && n >= 1000 ? `${(n / 1000).toLocaleString("fr-FR")} t` : `${n.toLocaleString("fr-FR")} ${u}`);

export type OrderStatus = "en_attente" | "acceptee" | "preparation" | "transport" | "livree" | "rejetee" | "annulee";
export const STATUS: Record<OrderStatus, { label: string; tone: "warning" | "primary" | "info" | "gold" | "success" | "destructive" | "muted" }> = {
  en_attente: { label: "En attente", tone: "warning" },
  acceptee: { label: "Acceptée", tone: "primary" },
  preparation: { label: "Préparation", tone: "info" },
  transport: { label: "En transport", tone: "gold" },
  livree: { label: "Livrée", tone: "success" },
  rejetee: { label: "Rejetée", tone: "destructive" },
  annulee: { label: "Annulée", tone: "muted" },
};
export const TIMELINE: OrderStatus[] = ["en_attente", "acceptee", "preparation", "transport", "livree"];

export type Order = { id: string; productId: string; qty: number; total: number; status: OrderStatus; date: string; buyer: string; city: string };
export const ORDERS: Order[] = [
  { id: "SL-24871", productId: "a1", qty: 2000, total: 630000, status: "transport", date: "14 nov. 2026", buyer: "Mariam Konaté", city: "Bamako" },
  { id: "SL-24856", productId: "a4", qty: 500, total: 200000, status: "preparation", date: "13 nov. 2026", buyer: "Restaurant Le Djoliba", city: "Bamako" },
  { id: "SL-24830", productId: "a2", qty: 1000, total: 450000, status: "livree", date: "9 nov. 2026", buyer: "Mariam Konaté", city: "Bamako" },
  { id: "SL-24812", productId: "a3", qty: 400, total: 102000, status: "en_attente", date: "15 nov. 2026", buyer: "Boutique Kanté", city: "Kayes" },
  { id: "SL-24799", productId: "a5", qty: 100, total: 65000, status: "annulee", date: "2 nov. 2026", buyer: "Ibrahim Touré", city: "Mopti" },
  { id: "SL-24760", productId: "a8", qty: 300, total: 90000, status: "rejetee", date: "28 oct. 2026", buyer: "Seydou Bagayoko", city: "Gao" },
];

export const VEHICLES = [
  { id: "tricycle", label: "Tricycle", cap: 0.5, rate: 150 },
  { id: "pickup", label: "Pickup", cap: 1.5, rate: 110 },
  { id: "van", label: "Fourgonnette", cap: 3, rate: 90 },
  { id: "camion", label: "Camion", cap: 10, rate: 65 },
  { id: "gros", label: "Poids lourd", cap: 30, rate: 45 },
];

export const TRANSPORTERS = [
  { id: "t1", name: "Sidiki Transport", driver: "Sidiki Dembélé", vehicle: "Camion", cap: 10, rating: 4.9, eta: "6 h", ratePerKmT: 65, location: "Bamako" },
  { id: "t2", name: "Mali Fret Express", driver: "Abdoulaye Cissé", vehicle: "Poids lourd", cap: 30, rating: 4.7, eta: "8 h", ratePerKmT: 45, location: "Ségou" },
  { id: "t3", name: "Kéné Logistique", driver: "Lassana Sidibé", vehicle: "Camion", cap: 8, rating: 4.6, eta: "7 h", ratePerKmT: 70, location: "Sikasso" },
];

export const MISSIONS = [
  { id: "M-882", from: "Sikasso", to: "Bamako", cargo: "Pommes de terre", weight: 5, distance: 375, pay: 487000, pickup: "Aujourd'hui, 14:00", status: "nouvelle" as const },
  { id: "M-879", from: "Ségou", to: "Bamako", cargo: "Oignons violets", weight: 2, distance: 235, pay: 152000, pickup: "Demain, 07:00", status: "nouvelle" as const },
  { id: "M-871", from: "Niono", to: "Kayes", cargo: "Riz Gambiaka", weight: 8, distance: 610, pay: 960000, pickup: "17 nov., 06:00", status: "nouvelle" as const },
];

export const CONVERSATIONS = [
  { id: "c1", name: "Aminata Traoré", org: "Coopérative Sikasso Bio", last: "Les 5 tonnes sont prêtes au chargement.", time: "10:42", unread: 2, online: true },
  { id: "c2", name: "Sidiki Dembélé", org: "Sidiki Transport", last: "Je serai à Sikasso vers 14h.", time: "09:15", unread: 0, online: true },
  { id: "c3", name: "Moussa Diallo", org: "Ferme Diallo & Fils", last: "D'accord pour 390 FCFA le kilo.", time: "Hier", unread: 0, online: false },
  { id: "c4", name: "Fatoumata Coulibaly", org: "GIE Femmes de Koutiala", last: "Photo envoyée", time: "Lun.", unread: 1, online: false },
];

export const NOTIFICATIONS = [
  { id: "n1", type: "order", title: "Nouvelle demande d'achat", body: "Boutique Kanté souhaite 400 kg de Mangues Kent.", time: "Il y a 5 min", read: false },
  { id: "n2", type: "delivery", title: "Livraison en route", body: "Commande SL-24871 a quitté Sikasso. Arrivée estimée 20:30.", time: "Il y a 1 h", read: false },
  { id: "n3", type: "payment", title: "Paiement reçu", body: "450 000 FCFA reçus pour la commande SL-24830.", time: "Hier", read: true },
  { id: "n4", type: "order", title: "Commande acceptée", body: "Ferme Diallo & Fils a accepté votre commande d'oignons.", time: "Hier", read: true },
  { id: "n5", type: "system", title: "Compte vérifié", body: "Votre identité a été confirmée. Badge vérifié activé.", time: "12 nov.", read: true },
];

export const USERS: Record<Role, { name: string; phone: string; location: string; org: string; initials: string }> = {
  producteur: { name: "Aminata Traoré", phone: "+223 76 45 12 89", location: "Sikasso", org: "Coopérative Sikasso Bio", initials: "AT" },
  commercant: { name: "Ousmane Kanté", phone: "+223 66 21 34 56", location: "Marché de Médine, Bamako", org: "Kanté Distribution", initials: "OK" },
  transporteur: { name: "Sidiki Dembélé", phone: "+223 79 88 02 11", location: "Bamako", org: "Sidiki Transport", initials: "SD" },
  acheteur: { name: "Mariam Konaté", phone: "+223 70 12 45 78", location: "Hamdallaye ACI, Bamako", org: "Particulier", initials: "MK" },
};

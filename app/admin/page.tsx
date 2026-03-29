import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin-logout-button";

const adminCards = [
  {
    title: "Prodotti",
    description: "Crea, modifica e archivia abbigliamento e poster con foto, prezzo e varianti.",
    href: "/admin/products"
  },
  {
    title: "Ordini",
    description: "Controlla gli ordini creati dal checkout locale e il loro stato.",
    href: "/admin/orders"
  },
  {
    title: "Negozio",
    description: "Rientra nel negozio pubblico e verifica la presentazione dei prodotti.",
    href: "/shop"
  }
];

export default function AdminPage() {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Console amministrazione</p>
          <h1>Backoffice Touch Grass</h1>
        </div>
        <div className="hero-actions">
          <Link href="/admin/products/new" className="button button-dark">
            Nuovo prodotto
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      <div className="admin-dashboard">
        {adminCards.map((card) => (
          <Link key={card.title} href={card.href} className="admin-card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

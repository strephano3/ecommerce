import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-title">touch grass</p>
        <p>Abbigliamento essenziale pensato per muoversi, uscire di casa e stare fuori il giusto.</p>
      </div>
      <div>
        <p className="footer-title">Assistenza</p>
        <p className="footer-links">
          <Link href="/support">Supporto</Link>
          <Link href="/shipping">Spedizioni</Link>
          <Link href="/returns">Resi</Link>
          <Link href="/privacy">Privacy</Link>
        </p>
      </div>
      <div>
        <p className="footer-title">Documenti</p>
        <p className="footer-links">
          <Link href="/cookies">Cookie</Link>
          <Link href="/terms">Termini</Link>
          <Link href="/shop">Negozio</Link>
          <Link href="/cart">Carrello</Link>
        </p>
      </div>
    </footer>
  );
}

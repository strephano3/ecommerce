# Touch Grass - Blueprint E-commerce

## Obiettivo

Realizzare un e-commerce di abbigliamento completo per il brand `touch grass` con:

- storefront pubblico
- console admin privata
- gestione prodotti con foto, descrizione, prezzo e taglie
- checkout con Stripe, PayPal, Apple Pay, Klarna
- ordine, spedizione, resi e gestione clienti

## Cosa manca rispetto alla lista iniziale

La lista iniziale copre solo una parte del necessario. In un e-commerce completo servono anche:

### Catalogo

- categorie e collezioni
- SKU univoco per ogni variante
- colori e varianti
- stock per taglia
- immagini multiple per prodotto
- stato prodotto: bozza, attivo, esaurito, archiviato
- prezzo pieno e prezzo scontato
- brand copy, materiali, fit, istruzioni lavaggio

### Checkout

- carrello persistente
- indirizzi spedizione e fatturazione
- costi di spedizione
- tasse / IVA
- codici sconto
- checkout guest e checkout con account
- recupero carrelli abbandonati

### Ordini

- creazione ordine
- pagamento riuscito / fallito / rimborsato
- stato ordine: pending, paid, fulfilled, shipped, delivered, returned
- email automatiche
- gestione resi e rimborsi

### Account cliente

- registrazione / login
- cronologia ordini
- wishlist
- profilo e indirizzi salvati

### Admin

- login sicuro admin
- dashboard vendite
- CRUD prodotti
- CRUD collezioni e categorie
- gestione stock
- gestione ordini
- clienti
- sconti / coupon
- contenuti homepage e banner

### Marketing e SEO

- homepage editoriale
- newsletter
- SEO per prodotto / categoria
- pixel / analytics
- feed Meta / Google Shopping

### Operativo e legale

- privacy policy
- cookie banner
- termini e condizioni
- policy spedizioni
- policy resi
- fatturazione
- anti-frode

## Console admin: come la facciamo

La scelta migliore e piu pratica e creare una web app admin separata, protetta da login, collegata allo stesso backend del negozio.

### Flusso admin consigliato

1. Login admin
2. Pagina `Prodotti`
3. Pulsante `Nuovo prodotto`
4. Form con:
   - nome
   - slug
   - descrizione breve
   - descrizione completa
   - prezzo
   - prezzo scontato
   - categoria
   - tag
   - immagini
   - varianti taglia
   - stock per taglia
   - stato prodotto
5. Salvataggio
6. Prodotto pubblicabile sullo store

### Upload foto

Le foto non vanno salvate nel database come file binari. Vanno caricate su storage cloud e nel database salviamo solo URL e metadati.

### Esempio struttura prodotto

```json
{
  "name": "Oversized Tee Forest",
  "slug": "oversized-tee-forest",
  "description": "T-shirt oversize in cotone pesante.",
  "price": 4900,
  "compareAtPrice": 5900,
  "currency": "EUR",
  "status": "active",
  "images": [
    {
      "url": "https://cdn.example.com/touch-grass/tee-forest-1.jpg",
      "alt": "Oversized Tee Forest front"
    }
  ],
  "variants": [
    {
      "sku": "TG-TEE-FOR-S",
      "size": "S",
      "stock": 12
    },
    {
      "sku": "TG-TEE-FOR-M",
      "size": "M",
      "stock": 8
    }
  ],
  "tags": ["oversized", "tshirt", "cotton"]
}
```

## Stack consigliato

Per velocita, qualita e manutenzione:

- Frontend store: `Next.js`
- Frontend admin: `Next.js` nello stesso progetto con area `/admin`
- UI: `Tailwind CSS` + componenti custom
- Database: `PostgreSQL`
- ORM: `Prisma`
- Auth admin/clienti: `Clerk` oppure `NextAuth/Auth.js`
- Storage immagini: `Cloudinary` oppure `S3`
- Pagamenti:
  - `Stripe` per carte, Apple Pay, Klarna
  - `PayPal` via integrazione separata
- Email: `Resend`
- Deploy: `Vercel`

## Nota importante sui pagamenti

Se vuoi `Stripe + Apple Pay + Klarna`, spesso Apple Pay e Klarna arrivano gia tramite Stripe, a seconda del paese e della configurazione account.
`PayPal` invece si integra quasi sempre a parte.

Quindi la strategia consigliata e:

- Stripe come motore principale checkout
- PayPal come opzione aggiuntiva

## Architettura minima

### Frontoffice

- homepage
- catalogo
- pagina categoria
- pagina prodotto
- carrello
- checkout
- account

### Backoffice

- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/orders`
- `/admin/customers`
- `/admin/discounts`
- `/admin/content`
- `/admin/settings`

### Backend

- API prodotti
- API upload immagini
- API carrello
- API checkout
- webhook Stripe
- webhook PayPal
- API ordini
- API inventory

## Database: entita principali

- users
- admin_users
- products
- product_images
- product_variants
- categories
- collections
- carts
- cart_items
- orders
- order_items
- addresses
- payments
- refunds
- coupons

## Priorita di sviluppo

### Fase 1

- identita visuale `touch grass`
- homepage
- catalogo
- pagina prodotto
- console admin prodotti
- upload immagini
- stock per taglia

### Fase 2

- carrello
- checkout Stripe
- Apple Pay / Klarna se disponibili su Stripe
- PayPal
- ordini
- email

### Fase 3

- dashboard admin completa
- sconti
- clienti
- resi
- SEO
- analytics

## Decisione consigliata

Per partire bene senza sovra-complicare:

1. un unico progetto `Next.js`
2. store pubblico + area admin nello stesso codebase
3. `PostgreSQL + Prisma`
4. `Stripe` come checkout principale
5. `PayPal` come integrazione successiva
6. storage immagini su `Cloudinary`

## Prossimo passo operativo

Scaffold iniziale da creare:

- app store `Next.js`
- design system brand `touch grass`
- area admin autenticata
- schema database prodotti
- form creazione prodotto con upload immagini e taglie
- bozza homepage e pagina prodotto

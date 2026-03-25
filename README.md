# Touch Grass

E-commerce di abbigliamento costruito con `Next.js`, con storefront pubblico e area admin per gestire il catalogo.

## Include

- homepage brand
- catalogo prodotti
- pagina prodotto
- carrello persistente nel browser
- checkout che crea ordini nel database locale
- area admin con creazione, modifica ed eliminazione prodotti
- area admin con vista ordini
- API locali per catalogo e ordini
- database PostgreSQL con Prisma

## Avvio

1. `cp .env.example .env.local`
2. `npm install`
3. `npm run prisma:generate`
4. `npm run db:init:remote`
5. `npm run db:seed`
6. `npm run dev`
7. apri `http://localhost:3000`
8. console admin su `http://localhost:3000/admin`

Se il tuo ambiente supporta `prisma db push`, puoi continuare a usarlo. In questo progetto c'e anche `npm run db:init:remote`, che applica lo schema SQL direttamente su PostgreSQL ed e utile quando il Prisma schema engine non e affidabile.

## Pagamenti

Lo scaffold e pronto per integrare:

- Stripe
- Apple Pay tramite Stripe
- Klarna tramite Stripe
- PayPal con integrazione dedicata

## Email automatiche

Il progetto invia email automatiche tramite Resend per:

- ordine ricevuto
- pagamento confermato
- ordine spedito
- rimborso emesso
- notifica interna negozio quando un ordine viene pagato

Per l'invio reale serve:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`
- `ORDER_NOTIFICATION_EMAIL` opzionale
- dominio mittente verificato in Resend con i record DNS richiesti

## Webhook Stripe

Per completare Stripe devi configurare un endpoint webhook verso:

- `https://tuo-dominio.com/api/stripe/webhook`

Eventi consigliati:

- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.payment_failed`

Salva il secret dell'endpoint in `STRIPE_WEBHOOK_SECRET`.

## Accesso admin

Per default la password admin e `touchgrass-admin`.
Imposta `ADMIN_PASSWORD` in `.env.local` prima di usare il progetto fuori ambiente locale.

## Nota

Prodotti e ordini vengono salvati in PostgreSQL tramite `DATABASE_URL`.
Per il bootstrap remoto, il progetto prova prima `DIRECT_URL` e ricade su `DATABASE_URL` se la connessione diretta non e raggiungibile.
Le immagini caricate dalla console vengono inviate a Cloudinary.
Il file [prisma/schema.prisma](/Users/stefano/Desktop/e-commerce/prisma/schema.prisma) definisce la struttura attuale di catalogo, indirizzi e ordini.

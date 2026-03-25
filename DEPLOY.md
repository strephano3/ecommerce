# Deploy produzione

## Cosa si puo fare ora

- progetto buildabile in produzione
- headers di sicurezza base
- metadataBase configurabile via `NEXT_PUBLIC_SITE_URL`
- endpoint healthcheck: `/api/health`
- sitemap, robots, pagine legali e cookie banner gia presenti

## Cosa richiede il dominio

- URL pubblico finale
- collegamento DNS
- webhook Stripe definitivo
- verifica Apple Pay
- dominio mittente Resend

## Deploy consigliato

### Vercel

1. importa il repository/progetto
2. imposta le variabili ambiente del file `.env.local`
3. imposta `NEXT_PUBLIC_SITE_URL` con il dominio finale
4. esegui build

### Database

Il progetto usa PostgreSQL remoto via `DATABASE_URL`.
Su Vercel devi impostare la stessa variabile ambiente del progetto.
Se usi Supabase, imposta anche `DIRECT_URL` quando disponibile. In questo ambiente il bootstrap remoto funziona tramite `npm run db:init:remote`, con fallback automatico dal direct host al pooler.

### Storage immagini

Gli upload admin vengono inviati a Cloudinary.
Su Vercel devi impostare:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Analytics

Gli analytics non sono ancora collegati a un provider reale.
Il momento giusto per attivarli e dopo il dominio, perche servono:

- dominio finale da registrare nel provider
- cookie policy coerente con gli script reali
- eventuale consenso esplicito per analytics non tecnici

Provider consigliati:

- Vercel Analytics
- Plausible
- Google Analytics 4

## Checklist post dominio

1. puntare il dominio al deploy
2. impostare `NEXT_PUBLIC_SITE_URL=https://tuo-dominio`
3. configurare webhook Stripe
4. verificare dominio Resend
5. testare email reali
6. verificare Apple Pay
7. attivare analytics reali

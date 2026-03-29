"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { inferProductKind } from "@/lib/product-kind";
import type { Product } from "@/lib/types";
import { slugify } from "@/lib/utils";

type ProductFormProps = {
  initialProduct?: Product;
  mode: "create" | "edit";
};

type ProductFormState = {
  productType: "apparel" | "poster";
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  compareAtPrice: string;
  category: string;
  collection: string;
  tags: string;
  status: Product["status"];
  featured: boolean;
  imageUrl: string;
  imageAlt: string;
  sizes: string;
};

function toFormState(product?: Product): ProductFormState {
  return {
    productType: product ? inferProductKind(product) : "apparel",
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price / 100) : "",
    compareAtPrice: product?.compareAtPrice ? String(product.compareAtPrice / 100) : "",
    category: product?.category ?? "",
    collection: product?.collection ?? "",
    tags: product?.tags.join(", ") ?? "",
    status: product?.status ?? "draft",
    featured: product?.featured ?? false,
    imageUrl: product?.images[0]?.url ?? "",
    imageAlt: product?.images[0]?.alt ?? "",
    sizes:
      product?.variants.map((variant) => `${variant.size}:${variant.sku}:${variant.stock}`).join("\n") ?? ""
  };
}

function parseSizes(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [size, sku, stock] = line.split(":");
      return {
        id: `${size ?? "size"}-${index}`,
        size: size?.trim() ?? "",
        sku: sku?.trim() ?? "",
        stock: Number(stock ?? 0)
      };
    });
}

export function AdminProductForm({ initialProduct, mode }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(toFormState(initialProduct));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isPoster = form.productType === "poster";

  async function handleImageUpload(file: File) {
    setIsUploading(true);
    setError(null);

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body
    });

    if (!response.ok) {
      setError("Upload immagine fallito.");
      setIsUploading(false);
      return;
    }

    const data = (await response.json()) as { url: string };
    setForm((current) => ({
      ...current,
      imageUrl: data.url,
      imageAlt: current.imageAlt || current.name
    }));
    setIsUploading(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const payload = {
      name: form.name,
      slug: slugify(form.slug || form.name),
      shortDescription: form.shortDescription,
      description: form.description,
      price: Math.round(Number(form.price || 0) * 100),
      compareAtPrice: form.compareAtPrice ? Math.round(Number(form.compareAtPrice) * 100) : null,
      category: form.category,
      collection: form.collection,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: form.status,
      featured: form.featured,
      images: form.imageUrl
        ? [
            {
              id: "cover",
              url: form.imageUrl,
              alt: form.imageAlt || form.name
            }
          ]
        : [],
      variants: parseSizes(form.sizes)
    };

    const endpoint = mode === "create" ? "/api/products" : `/api/products/${initialProduct?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setIsSaving(false);
      setError(data?.message || "Salvataggio fallito. Controlla i campi e riprova.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <label>
          Tipo prodotto
          <select
            value={form.productType}
            onChange={(event) => {
              const nextType = event.target.value as ProductFormState["productType"];
              setForm((current) => {
                const isCurrentPoster = current.productType === "poster";
                return {
                  ...current,
                  productType: nextType,
                  category:
                    nextType === "poster"
                      ? isCurrentPoster
                        ? current.category
                        : current.category || "Poster"
                      : !isCurrentPoster
                        ? current.category
                        : current.category === "Poster"
                          ? "Abbigliamento"
                          : current.category,
                  collection:
                    nextType === "poster"
                      ? isCurrentPoster
                        ? current.collection
                        : current.collection || "Poster"
                      : !isCurrentPoster
                        ? current.collection
                        : current.collection === "Poster"
                          ? "Core"
                          : current.collection
                };
              });
            }}
          >
            <option value="apparel">Abbigliamento</option>
            <option value="poster">Poster</option>
          </select>
        </label>
        <label>
          Nome prodotto
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </label>
        <label>
          Slug
          <input
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
          />
        </label>
        <label>
          Prezzo EUR
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
          />
        </label>
        <label>
          Prezzo barrato EUR
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.compareAtPrice}
            onChange={(event) => setForm((current) => ({ ...current, compareAtPrice: event.target.value }))}
          />
        </label>
        <label>
          Categoria
          <input
            required
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          />
        </label>
        <label>
          Collezione
          <input
            required
            value={form.collection}
            onChange={(event) => setForm((current) => ({ ...current, collection: event.target.value }))}
          />
        </label>
        <label>
          Stato
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value as Product["status"] }))
            }
          >
            <option value="draft">Bozza</option>
            <option value="active">Attivo</option>
            <option value="archived">Archiviato</option>
            <option value="sold_out">Esaurito</option>
          </select>
        </label>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
          />
          In evidenza in homepage
        </label>
      </div>

      <label>
        Descrizione breve
        <textarea
          required
          rows={3}
          value={form.shortDescription}
          onChange={(event) =>
            setForm((current) => ({ ...current, shortDescription: event.target.value }))
          }
        />
      </label>

      <label>
        Descrizione completa
        <textarea
          required
          rows={7}
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
        />
      </label>

      <div className="admin-form-grid">
        <label>
          URL immagine Cloudinary
          <input
            value={form.imageUrl}
            onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
          />
        </label>
        <label>
          Alt immagine
          <input
            value={form.imageAlt}
            onChange={(event) => setForm((current) => ({ ...current, imageAlt: event.target.value }))}
          />
        </label>
      </div>

      <label>
        Carica immagine
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleImageUpload(file);
            }
          }}
        />
        {isUploading ? <span className="helper-text">Caricamento immagine su Cloudinary...</span> : null}
      </label>

      <label>
        Tag separati da virgola
        <input
          value={form.tags}
          onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
        />
      </label>

      <label>
        {isPoster ? "Formati e stock" : "Taglie e stock"}
        <textarea
          rows={6}
          value={form.sizes}
          onChange={(event) => setForm((current) => ({ ...current, sizes: event.target.value }))}
          placeholder={
            isPoster
              ? "50x70:TG-POSTER-50X70:12\n70x100:TG-POSTER-70X100:7"
              : "S:TG-TEE-S:12\nM:TG-TEE-M:7\nL:TG-TEE-L:3"
          }
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="admin-actions">
        <button type="submit" className="button button-dark" disabled={isSaving}>
          {isSaving ? "Salvataggio..." : mode === "create" ? "Crea prodotto" : "Salva modifiche"}
        </button>
      </div>
    </form>
  );
}

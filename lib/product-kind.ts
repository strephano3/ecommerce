import type { Product } from "@/lib/types";

export type ProductKind = "apparel" | "poster";

function normalize(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

export function inferProductKind(input: Pick<Product, "category" | "collection" | "tags">): ProductKind {
  const category = normalize(input.category);
  const collection = normalize(input.collection);
  const tags = input.tags.map((tag) => normalize(tag));

  if (
    category === "poster" ||
    category === "posters" ||
    collection === "poster" ||
    collection === "posters" ||
    tags.includes("poster") ||
    tags.includes("posters")
  ) {
    return "poster";
  }

  return "apparel";
}

export function getProductKindLabel(kind: ProductKind) {
  return kind === "poster" ? "Poster" : "Abbigliamento";
}

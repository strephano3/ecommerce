import type { Prisma } from "@prisma/client";
import { ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { Product, ProductPayload } from "@/lib/types";
import { slugify } from "@/lib/utils";

type ProductRecord = Prisma.ProductGetPayload<{
  include: {
    tags: true;
    images: true;
    variants: true;
  };
}>;

function mapStatus(status: ProductStatus): Product["status"] {
  return status.toLowerCase() as Product["status"];
}

function mapProduct(product: ProductRecord): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    category: product.category,
    collection: product.collection,
    tags: product.tags.map((tag) => tag.label),
    status: mapStatus(product.status),
    featured: product.featured,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt
    })),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      size: variant.size,
      sku: variant.sku,
      stock: variant.stock
    }))
  };
}

function normalizePayload(payload: ProductPayload) {
  return {
    ...payload,
    slug: slugify(payload.slug || payload.name),
    shortDescription: payload.shortDescription.trim(),
    description: payload.description.trim(),
    category: payload.category.trim(),
    collection: payload.collection.trim(),
    tags: payload.tags.filter(Boolean),
    images: payload.images.filter((image) => image.url.trim()),
    variants: payload.variants
      .map((variant) => ({
        ...variant,
        size: variant.size.trim(),
        sku: variant.sku.trim(),
        stock: Number(variant.stock) || 0
      }))
      .filter((variant) => variant.size && variant.sku)
  };
}

async function fetchProducts(where?: Prisma.ProductWhereInput) {
  const products = await prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      tags: true,
      images: true,
      variants: true
    }
  });

  return products.map(mapProduct);
}

export async function readProducts(): Promise<Product[]> {
  return fetchProducts();
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      tags: true,
      images: true,
      variants: true
    }
  });

  return product ? mapProduct(product) : null;
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      tags: true,
      images: true,
      variants: true
    }
  });

  return product ? mapProduct(product) : null;
}

export async function createProduct(payload: ProductPayload) {
  const normalized = normalizePayload(payload);
  const product = await prisma.product.create({
    data: {
      name: normalized.name,
      slug: normalized.slug,
      shortDescription: normalized.shortDescription,
      description: normalized.description,
      price: normalized.price,
      compareAtPrice: normalized.compareAtPrice,
      category: normalized.category,
      collection: normalized.collection,
      status: normalized.status.toUpperCase() as ProductStatus,
      featured: normalized.featured,
      tags: {
        create: normalized.tags.map((label) => ({ label }))
      },
      images: {
        create: normalized.images.map((image) => ({
          url: image.url,
          alt: image.alt
        }))
      },
      variants: {
        create: normalized.variants.map((variant) => ({
          size: variant.size,
          sku: variant.sku,
          stock: variant.stock
        }))
      }
    },
    include: {
      tags: true,
      images: true,
      variants: true
    }
  });

  return mapProduct(product);
}

export async function updateProduct(id: string, payload: ProductPayload) {
  const normalized = normalizePayload(payload);
  const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } });

  if (!exists) {
    return null;
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: normalized.name,
      slug: normalized.slug,
      shortDescription: normalized.shortDescription,
      description: normalized.description,
      price: normalized.price,
      compareAtPrice: normalized.compareAtPrice,
      category: normalized.category,
      collection: normalized.collection,
      status: normalized.status.toUpperCase() as ProductStatus,
      featured: normalized.featured,
      tags: {
        deleteMany: {},
        create: normalized.tags.map((label) => ({ label }))
      },
      images: {
        deleteMany: {},
        create: normalized.images.map((image) => ({
          url: image.url,
          alt: image.alt
        }))
      },
      variants: {
        deleteMany: {},
        create: normalized.variants.map((variant) => ({
          size: variant.size,
          sku: variant.sku,
          stock: variant.stock
        }))
      }
    },
    include: {
      tags: true,
      images: true,
      variants: true
    }
  });

  return mapProduct(product);
}

export async function deleteProduct(id: string) {
  const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } });

  if (!exists) {
    return false;
  }

  await prisma.product.delete({ where: { id } });
  return true;
}

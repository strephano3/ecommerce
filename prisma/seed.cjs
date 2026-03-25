const { PrismaClient, ProductStatus } = require("@prisma/client");

const prisma = new PrismaClient();

const products = [
  {
    name: "Maglietta Boxy Terra",
    slug: "maglietta-boxy-terra",
    shortDescription: "T-shirt boxy in cotone pesante con vestibilita ampia.",
    description:
      "Maglietta essenziale pensata per il guardaroba base del brand. Cotone compatto, fit largo e struttura pulita.",
    price: 4900,
    compareAtPrice: null,
    category: "T-shirt",
    collection: "Essenziali",
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ["cotone", "boxy", "essenziali"],
    images: [],
    variants: [
      { size: "S", sku: "TG-BOX-TERRA-S", stock: 10 },
      { size: "M", sku: "TG-BOX-TERRA-M", stock: 12 },
      { size: "L", sku: "TG-BOX-TERRA-L", stock: 8 }
    ]
  },
  {
    name: "Felpa Field Hoodie",
    slug: "felpa-field-hoodie",
    shortDescription: "Felpa con cappuccio in tessuto pesante e taglio rilassato.",
    description:
      "Felpa pensata per layering e comfort quotidiano. Volume abbondante, mano asciutta e linea pulita.",
    price: 8900,
    compareAtPrice: null,
    category: "Felpe",
    collection: "Essenziali",
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ["hoodie", "felpa", "layering"],
    images: [],
    variants: [
      { size: "S", sku: "TG-HOOD-FIELD-S", stock: 6 },
      { size: "M", sku: "TG-HOOD-FIELD-M", stock: 9 },
      { size: "L", sku: "TG-HOOD-FIELD-L", stock: 7 }
    ]
  },
  {
    name: "Pantalone Cargo Dry",
    slug: "pantalone-cargo-dry",
    shortDescription: "Cargo ampio con tasche utility e gamba dritta.",
    description:
      "Pantalone da lavoro reinterpretato in chiave pulita. Tasche utili, volumi larghi e tessuto asciutto.",
    price: 9900,
    compareAtPrice: 11900,
    category: "Pantaloni",
    collection: "Utility",
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ["cargo", "utility", "wide"],
    images: [],
    variants: [
      { size: "30", sku: "TG-CARGO-DRY-30", stock: 5 },
      { size: "32", sku: "TG-CARGO-DRY-32", stock: 7 },
      { size: "34", sku: "TG-CARGO-DRY-34", stock: 4 }
    ]
  },
  {
    name: "Giacca Wind Layer",
    slug: "giacca-wind-layer",
    shortDescription: "Giacca leggera antivento per mezze stagioni.",
    description:
      "Layer tecnico leggero, facile da abbinare e pensato per completare il catalogo esterno del brand.",
    price: 12900,
    compareAtPrice: null,
    category: "Giacche",
    collection: "Utility",
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ["giacca", "vento", "tecnico"],
    images: [],
    variants: [
      { size: "M", sku: "TG-WIND-LAYER-M", stock: 5 },
      { size: "L", sku: "TG-WIND-LAYER-L", stock: 5 }
    ]
  }
];

async function upsertProduct(product) {
  return prisma.product.upsert({
    where: { slug: product.slug },
    create: {
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      collection: product.collection,
      status: product.status,
      featured: product.featured,
      tags: {
        create: product.tags.map((label) => ({ label }))
      },
      images: {
        create: product.images.map((image) => image)
      },
      variants: {
        create: product.variants.map((variant) => variant)
      }
    },
    update: {
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      collection: product.collection,
      status: product.status,
      featured: product.featured,
      tags: {
        deleteMany: {},
        create: product.tags.map((label) => ({ label }))
      },
      images: {
        deleteMany: {},
        create: product.images.map((image) => image)
      },
      variants: {
        deleteMany: {},
        create: product.variants.map((variant) => variant)
      }
    }
  });
}

async function main() {
  for (const product of products) {
    await upsertProduct(product);
  }

  const count = await prisma.product.count();
  console.log(`Seed completato. Prodotti presenti: ${count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

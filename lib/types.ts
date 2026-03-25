export type ProductStatus = "draft" | "active" | "archived" | "sold_out";

export type ProductVariant = {
  id: string;
  size: string;
  sku: string;
  stock: number;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  collection: string;
  tags: string[];
  status: ProductStatus;
  featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
};

export type ProductPayload = Omit<Product, "id">;

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string;
  size: string;
  quantity: number;
  price: number;
};

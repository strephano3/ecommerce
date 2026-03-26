import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { getProductSaveErrorMessage } from "@/lib/product-errors";
import { createProduct, readProducts } from "@/lib/products";
import type { ProductPayload } from "@/lib/types";

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as ProductPayload;
  try {
    const product = await createProduct(payload);
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product failed", error);
    return NextResponse.json(
      { message: getProductSaveErrorMessage(error) },
      { status: 400 }
    );
  }
}

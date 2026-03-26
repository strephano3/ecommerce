import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { getProductSaveErrorMessage } from "@/lib/product-errors";
import { deleteProduct, updateProduct } from "@/lib/products";
import type { ProductPayload } from "@/lib/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = (await request.json()) as ProductPayload;
  try {
    const product = await updateProduct(id, payload);

    if (!product) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product failed", error);
    return NextResponse.json(
      { message: getProductSaveErrorMessage(error) },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await deleteProduct(id);

  if (result.outcome === "not_found") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return NextResponse.json(result);
}

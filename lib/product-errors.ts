import { Prisma } from "@prisma/client";

export function getProductSaveErrorMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta?.target.join(",") : String(error.meta?.target ?? "");

      if (target.includes("slug")) {
        return "Slug gia in uso. Scegline uno diverso.";
      }

      if (target.includes("sku")) {
        return "Uno SKU e gia in uso. Ogni taglia deve avere uno SKU unico.";
      }

      return "Esiste gia un valore univoco duplicato. Controlla slug e SKU.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Salvataggio fallito. Controlla i campi e riprova.";
}

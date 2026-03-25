import { createHash } from "crypto";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

function getCloudinaryEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Configurazione Cloudinary incompleta.");
  }

  return { cloudName, apiKey, apiSecret };
}

function createSignature(params: Record<string, string>, apiSecret: string) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

export async function uploadImageToCloudinary(file: File) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = "touch-grass/products";
  const signature = createSignature({ folder, timestamp }, apiSecret);

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("folder", folder);
  body.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Upload Cloudinary fallito: ${message}`);
  }

  return (await response.json()) as CloudinaryUploadResult;
}

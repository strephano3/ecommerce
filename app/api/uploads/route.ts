import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File mancante" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Formato non valido" }, { status: 400 });
  }

  try {
    const uploaded = await uploadImageToCloudinary(file);
    return NextResponse.json({ url: uploaded.secure_url, publicId: uploaded.public_id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Upload Cloudinary fallito" }, { status: 500 });
  }
}

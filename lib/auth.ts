import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "tg_admin_session";
const DEFAULT_ADMIN_PASSWORD = "touchgrass-admin";

function sessionValue(password: string) {
  return `tg-session:${password}`;
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export function getAdminSessionValue() {
  return sessionValue(getAdminPassword());
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === getAdminSessionValue();
}

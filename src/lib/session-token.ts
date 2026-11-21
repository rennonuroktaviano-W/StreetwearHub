import { createHash } from "node:crypto";

export const SESSION_COOKIE = "sh_session";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "bd_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

const FALLBACK_USERNAME = "admin";
const FALLBACK_PASSWORD = "blackdahlia420";
const FALLBACK_SESSION_SECRET =
  "blackdahlia-admin-session-secret-change-this-before-production";

type SessionPayload = {
  username: string;
  exp: number;
  nonce: string;
};

export type AdminSession = {
  username: string;
  expiresAt: string;
};

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || FALLBACK_SESSION_SECRET;
}

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", sessionSecret()).update(encodedPayload).digest("hex");
}

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function adminUsername(): string {
  return process.env.ADMIN_USERNAME || FALLBACK_USERNAME;
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD;
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return safeCompare(username, adminUsername()) && safeCompare(password, adminPassword());
}

export function createAdminSessionToken(username: string): string {
  const payload: SessionPayload = {
    username,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
    nonce: randomUUID(),
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function parseAdminSessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;

    if (!payload.username || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      username: payload.username,
      expiresAt: new Date(payload.exp * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}

export function adminCookieMaxAgeSeconds(): number {
  return ADMIN_SESSION_TTL_SECONDS;
}

/**
 * Server-side code (Server Components, route handlers) runs inside the frontend's own
 * container/process and must reach the backend by its Docker-network hostname
 * (`INTERNAL_API_URL`); the browser runs outside that network and needs the
 * publicly reachable URL instead (`NEXT_PUBLIC_API_URL`, baked into the client bundle
 * at build time). Locally (no Docker) both point at the same `localhost` URL, so this
 * split is a no-op outside Docker.
 */
const BASE_URL =
  typeof window === "undefined" ? (process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL) : process.env.NEXT_PUBLIC_API_URL;

interface NestErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
}

function isNestErrorBody(value: unknown): value is NestErrorBody {
  if (typeof value !== "object" || value === null || !("message" in value)) return false;
  const message = (value as { message: unknown }).message;
  return typeof message === "string" || Array.isArray(message);
}

/** Thrown for any non-2xx API response. `messages` is always an array, even when Nest sent a single string. */
export class ApiError extends Error {
  status: number;
  messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? "Something went wrong. Please try again.");
    this.name = "ApiError";
    this.status = status;
    this.messages = messages;
  }
}

/** Internal fetch wrapper: builds the URL, sets JSON headers, parses responses, normalizes errors. */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    let messages = ["Something went wrong. Please try again."];
    try {
      const body: unknown = await response.json();
      if (isNestErrorBody(body)) {
        messages = Array.isArray(body.message) ? body.message : [body.message];
      }
    } catch {
      // Body wasn't JSON (network failure, 500 HTML page, etc.) — keep the generic fallback.
    }
    throw new ApiError(response.status, messages);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

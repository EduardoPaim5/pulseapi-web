const TOKEN_KEY = "pulseapi_token";

let inMemoryToken: string | null = null;

export function getToken(): string | null {
  return inMemoryToken;
}

export function setToken(token: string): void {
  inMemoryToken = token;
}

export function clearToken(): void {
  inMemoryToken = null;
}

export const TOKEN_DEBUG_KEY = TOKEN_KEY;

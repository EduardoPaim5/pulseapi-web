const TOKEN_KEY = "pulseapi_token";

let inMemoryToken: string | null = null;

function readSessionToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (inMemoryToken) {
    return inMemoryToken;
  }
  const sessionToken = readSessionToken();
  inMemoryToken = sessionToken;
  return sessionToken;
}

export function setToken(token: string): void {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearToken(): void {
  inMemoryToken = null;
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }
}

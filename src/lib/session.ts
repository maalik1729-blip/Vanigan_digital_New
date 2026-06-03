const SESSION_KEY = "tnvs_session_epic";

export function getSession(): string | null {
  try { return localStorage.getItem(SESSION_KEY); }
  catch { return null; }
}

export function setSession(epic: string): void {
  try { localStorage.setItem(SESSION_KEY, epic); }
  catch { /* SSR guard */ }
}

export function clearSession(): void {
  try { localStorage.removeItem(SESSION_KEY); }
  catch { /* SSR guard */ }
}

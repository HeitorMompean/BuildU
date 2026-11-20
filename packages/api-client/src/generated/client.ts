export interface ApiClientOptions { readonly baseUrl: string; readonly getToken?: () => Promise<string | null>; }
export function createClient(options: ApiClientOptions) {
  const base = options.baseUrl.replace(/\/$/, '');
  async function get<T>(path: string): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = await options.getToken?.();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${base}${path}`, { headers });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return (await res.json()) as T;
  }
  return {
    healthLive: () => get<{ status: string }>('/health/live'),
    healthReady: () => get<unknown>('/health/ready'),
  };
}

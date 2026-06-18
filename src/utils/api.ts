const BASE_URL = '/api';

function buildQueryString(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.append(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      let msg = `${res.status} ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson && typeof errJson === 'object' && 'message' in errJson) {
          msg = String((errJson as { message: string }).message);
        }
      } catch {
        // ignore
      }
      throw new Error(msg);
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      return (await res.json()) as T;
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('请求失败');
  }
}

export function apiGet<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
  return request<T>(`${path}${buildQueryString(params)}`, { method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown = {}): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiPut<T>(path: string, body: unknown = {}): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}

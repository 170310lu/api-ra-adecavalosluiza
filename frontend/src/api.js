const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function api(path, options = {}) {
  const headers = { Accept: 'application/json', ...options.headers };
  if (options.body) headers['Content-Type'] = 'application/json';
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    const error = new Error('Não foi possível comunicar com a API. Verifique se o backend está em execução.');
    error.code = 'API_OFFLINE';
    throw error;
  }

  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'A solicitação não pôde ser concluída.');
    error.status = response.status;
    error.code = payload?.error?.code;
    throw error;
  }
  return payload;
}
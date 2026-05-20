const DEFAULT_API_URL = 'https://api.weather.lucasaguiar.online';

export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

export const API_URL = (
  import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL
).replace(/\/$/, '');

function fixLegacyText(value: string) {
  return [
    ['\u00c3\u00a1', '\u00e1'],
    ['\u00c3\u00a0', '\u00e0'],
    ['\u00c3\u00a2', '\u00e2'],
    ['\u00c3\u00a3', '\u00e3'],
    ['\u00c3\u00a9', '\u00e9'],
    ['\u00c3\u00aa', '\u00ea'],
    ['\u00c3\u00ad', '\u00ed'],
    ['\u00c3\u00b3', '\u00f3'],
    ['\u00c3\u00b4', '\u00f4'],
    ['\u00c3\u00b5', '\u00f5'],
    ['\u00c3\u00ba', '\u00fa'],
    ['\u00c3\u00a7', '\u00e7'],
    ['\u00c2\u00ba', '\u00ba'],
  ].reduce((text, [from, to]) => text.split(from).join(to), value).trim();
}

async function parseResponseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractErrorMessage(payload: unknown, fallbackMessage: string) {
  if (typeof payload === 'string' && payload.trim()) {
    return fixLegacyText(payload);
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidates = [record.detail, record.message, record.error];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return fixLegacyText(candidate);
      }
    }

    const firstStringValue = Object.values(record).find(
      (value) => typeof value === 'string' && value.trim(),
    );

    if (typeof firstStringValue === 'string') {
      return fixLegacyText(firstStringValue);
    }
  }

  return fallbackMessage;
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new HttpError(
      extractErrorMessage(payload, `Falha ao comunicar com a API (${response.status}).`),
      response.status,
      payload,
    );
  }

  return payload as T;
}

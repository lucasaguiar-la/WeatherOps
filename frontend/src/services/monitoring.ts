import type { ApiRootResponse } from '../types/api';
import type { ApiStatus } from '../types/domain';
import { http } from './http';

const LEGACY_MONITORING_PATH = '/';

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

export async function getApiStatus(): Promise<ApiStatus> {
  const checkedAt = new Date().toLocaleString('pt-BR');

  try {
    const response = await http<ApiRootResponse>(LEGACY_MONITORING_PATH);
    const messageValue = Object.values(response).find((value) => typeof value === 'string');

    return {
      checkedAt,
      isOnline: true,
      message:
        typeof messageValue === 'string'
          ? fixLegacyText(messageValue)
          : 'API disponivel e respondendo normalmente.',
      source: 'legacy-root',
    };
  } catch (error) {
    return {
      checkedAt,
      isOnline: false,
      message:
        error instanceof Error
          ? error.message
          : 'API indisponivel no momento. Verifique se o backend esta em execucao.',
      source: 'legacy-root',
    };
  }
}

import { adaptHistoryListResponse } from '../adapters/historyAdapter';
import type {
  ApiClearHistoryResponse,
  ApiDeleteHistoryResponse,
  ApiHistoryItemResponse,
} from '../types/api';
import type { ActionResult, HistoryRecord } from '../types/domain';
import { HttpError, http } from './http';

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

function normalizeActionMessage(response: ApiDeleteHistoryResponse | ApiClearHistoryResponse): ActionResult {
  const message = response.Sucesso;

  if (!message) {
    throw new HttpError('A API respondeu sem mensagem de confirmacao.', 500, response);
  }

  return { message: fixLegacyText(message) };
}

export async function getHistory(): Promise<HistoryRecord[]> {
  const response = await http<ApiHistoryItemResponse[]>('/history');
  return adaptHistoryListResponse(response);
}

export async function deleteHistoryRecord(id: number): Promise<ActionResult> {
  const response = await http<ApiDeleteHistoryResponse>(`/delete/${id}`, {
    method: 'DELETE',
  });

  return normalizeActionMessage(response);
}

export async function clearHistory(): Promise<ActionResult> {
  const response = await http<ApiClearHistoryResponse>('/all', {
    method: 'DELETE',
  });

  return normalizeActionMessage(response);
}

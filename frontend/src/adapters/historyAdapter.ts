import type { ApiHistoryItemResponse } from '../types/api';
import type { HistoryRecord } from '../types/domain';
import { HttpError } from '../services/http';

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

function readStringValue(record: ApiHistoryItemResponse, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'string' && value.trim()) {
      return fixLegacyText(value);
    }
  }

  return '';
}

function extractTemperatureValue(label: string) {
  const match = label.match(/-?\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : null;
}

function adaptHistoryRecord(record: ApiHistoryItemResponse): HistoryRecord {
  const rawId = readStringValue(record, ['ID']);
  const id = Number(rawId);

  if (!Number.isFinite(id)) {
    throw new HttpError('Um registro do historico veio sem ID valido.', 500, record);
  }

  const city = readStringValue(record, ['Cidade']);
  const country = readStringValue(record, ['Pais', 'Pa\u00eds', 'Pa\u00c3\u00ads']);
  const temperatureLabel = readStringValue(record, ['Temperatura']);
  const description = readStringValue(record, ['Descricao', 'Descri\u00e7\u00e3o', 'Descri\u00c3\u00a7\u00c3\u00a3o']);
  const queriedAt = readStringValue(record, ['data_query']);

  return {
    city,
    country,
    description,
    id,
    queriedAt,
    temperatureLabel,
    temperatureValue: extractTemperatureValue(temperatureLabel),
  };
}

export function adaptHistoryListResponse(response: ApiHistoryItemResponse[]): HistoryRecord[] {
  if (!Array.isArray(response)) {
    throw new HttpError('O historico retornado pela API nao esta em formato de lista.', 500, response);
  }

  return response.map(adaptHistoryRecord);
}

export type ApiRootResponse = Record<string, string>;

export type ApiWeatherResponse = Record<string, unknown> & {
  Cidade?: string;
  Temperatura?: string;
  Descricao?: string;
  'Descri\u00e7\u00e3o'?: string;
  'Descri\u00c3\u00a7\u00c3\u00a3o'?: string;
};

export type ApiHistoryItemResponse = Record<string, unknown> & {
  ID?: string;
  Cidade?: string;
  Pais?: string;
  'Pa\u00eds'?: string;
  'Pa\u00c3\u00ads'?: string;
  Temperatura?: string;
  Descricao?: string;
  'Descri\u00e7\u00e3o'?: string;
  'Descri\u00c3\u00a7\u00c3\u00a3o'?: string;
  data_query?: string;
};

export type ApiDeleteHistoryResponse = {
  Sucesso?: string;
  Cidade?: string;
  'Data da consulta'?: string;
};

export type ApiClearHistoryResponse = {
  Sucesso?: string;
};

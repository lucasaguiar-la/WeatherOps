import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HistoryTable } from '../components/history/HistoryTable';
import { Card } from '../components/ui/Card';
import { clearHistory, deleteHistoryRecord, getHistory } from '../services/history';

type FeedbackState = {
  tone: 'success' | 'error';
  message: string;
} | null;

export function HistoryPage() {
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHistoryRecord,
    onSuccess: async (result) => {
      setFeedback({ tone: 'success', message: result.message });
      await queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (error) => {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível remover o registro.',
      });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearHistory,
    onSuccess: async (result) => {
      setFeedback({ tone: 'success', message: result.message });
      await queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (error) => {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível limpar o histórico.',
      });
    },
  });

  const count = historyQuery.data?.length ?? 0;

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-header__eyebrow">Histórico</span>
        <h1>Consultas anteriores</h1>
        <p>Registros de todas as buscas realizadas, com cidade, temperatura e data.</p>
      </header>

      {feedback && (
        <div className={`alert alert--${feedback.tone === 'success' ? 'success' : 'error'}`}>
          {feedback.message}
        </div>
      )}

      <Card
        title={count > 0 ? `${count} registro${count !== 1 ? 's' : ''}` : 'Registros'}
        description={count === 0 ? 'Nenhuma consulta realizada ainda.' : undefined}
      >
        {historyQuery.isLoading ? (
          <div className="alert alert--info">Carregando registros...</div>
        ) : historyQuery.isError ? (
          <div className="alert alert--error">
            {historyQuery.error instanceof Error
              ? historyQuery.error.message
              : 'Não foi possível carregar o histórico.'}
          </div>
        ) : (
          <HistoryTable
            records={historyQuery.data ?? []}
            isClearingAll={clearMutation.isPending}
            deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
            onClearAll={() => clearMutation.mutate()}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        )}
      </Card>
    </div>
  );
}

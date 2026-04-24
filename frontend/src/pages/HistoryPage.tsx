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
        message: error instanceof Error ? error.message : 'Nao foi possivel remover o registro.',
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
        message: error instanceof Error ? error.message : 'Nao foi possivel limpar o historico.',
      });
    },
  });

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-header__eyebrow">Historico</span>
        <h1>Gerencie as consultas persistidas no backend.</h1>
        <p>
          A tabela consome <span className="mono">GET /history</span> e aplica mutacoes nos
          endpoints de exclusao existentes.
        </p>
      </header>

      {feedback && (
        <div className={`alert ${feedback.tone === 'success' ? 'alert--success' : 'alert--error'}`}>
          {feedback.message}
        </div>
      )}

      <Card
        title="Registros"
        description="Visualize o historico de consultas, remova itens especificos ou limpe tudo com feedback imediato."
      >
        {historyQuery.isLoading ? (
          <div className="alert alert--info">Carregando historico...</div>
        ) : historyQuery.isError ? (
          <div className="alert alert--error">
            {historyQuery.error instanceof Error
              ? historyQuery.error.message
              : 'Nao foi possivel carregar o historico.'}
          </div>
        ) : (
          <HistoryTable
            records={historyQuery.data}
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

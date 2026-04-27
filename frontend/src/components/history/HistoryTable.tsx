import { Button } from '../ui/Button';
import type { HistoryRecord } from '../../types/domain';

type HistoryTableProps = {
  deletingId: number | null;
  isClearingAll: boolean;
  onClearAll: () => void;
  onDelete: (id: number) => void;
  records: HistoryRecord[];
};

export function HistoryTable({
  deletingId,
  isClearingAll,
  onClearAll,
  onDelete,
  records,
}: HistoryTableProps) {
  if (!records.length) {
    return (
      <div className="stack">
        <div className="empty-state">
          Nenhum registro encontrado. Faça uma consulta de clima para popular o historico.
        </div>
        <div className="cluster">
          <Button disabled variant="danger">
            Limpar tudo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="cluster">
        <Button isLoading={isClearingAll} onClick={onClearAll} variant="danger">
          Limpar tudo
        </Button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cidade</th>
              <th>País</th>
              <th>Temperatura</th>
              <th>Descrição</th>
              <th>Consulta</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.city}</td>
                <td>{record.country}</td>
                <td>{record.temperatureLabel}</td>
                <td>{record.description}</td>
                <td>{record.queriedAt}</td>
                <td>
                  <Button
                    isLoading={deletingId === record.id}
                    onClick={() => onDelete(record.id)}
                    variant="secondary"
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

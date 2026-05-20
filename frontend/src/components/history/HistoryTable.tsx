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
          Nenhuma consulta realizada ainda.<br />
          Faça uma busca na aba <strong>Consulta</strong> para ver os registros aqui.
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
              <th>#</th>
              <th>Cidade</th>
              <th>País</th>
              <th>Temperatura</th>
              <th>Descrição</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="muted">{record.id}</td>
                <td><strong>{record.city}</strong></td>
                <td>{record.country}</td>
                <td><strong>{record.temperatureLabel}</strong></td>
                <td style={{ textTransform: 'capitalize' }}>{record.description}</td>
                <td className="muted">{record.queriedAt}</td>
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

import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type WeatherSearchFormProps = {
  canReset: boolean;
  city: string;
  isLoading: boolean;
  onCityChange: (value: string) => void;
  onReset: () => void;
  onSubmit: () => void;
};

export function WeatherSearchForm({
  canReset,
  city,
  isLoading,
  onCityChange,
  onReset,
  onSubmit,
}: WeatherSearchFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="form-row">
        <Input
          autoComplete="off"
          hint="Exemplo: Sao Paulo, Rio de Janeiro ou Lisboa"
          id="city"
          label="Cidade"
          name="city"
          onChange={(event) => onCityChange(event.target.value)}
          placeholder="Digite o nome da cidade"
          value={city}
        />
        <Button isLoading={isLoading} type="submit">
          Consultar
        </Button>
        <Button disabled={!canReset} onClick={onReset} type="button" variant="secondary">
          Nova consulta
        </Button>
      </div>
    </form>
  );
}

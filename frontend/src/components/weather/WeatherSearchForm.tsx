import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type WeatherSearchFormProps = {
  city: string;
  isLoading: boolean;
  onCityChange: (value: string) => void;
  onSubmit: () => void;
  onReset?: () => void;
};

export function WeatherSearchForm({
  city,
  isLoading,
  onCityChange,
  onSubmit,
  onReset,
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
          hint="Ex: São Paulo, Rio de Janeiro, Fortaleza..."
          id="city"
          label="Cidade"
          name="city"
          onChange={(event) => onCityChange(event.target.value)}
          placeholder="Nome da cidade"
          value={city}
        />
        <Button isLoading={isLoading} type="submit" disabled={!city.trim()}>
          Consultar
        </Button>
        {onReset && (
          <Button type="button" variant="ghost" onClick={onReset}>
            Limpar
          </Button>
        )}
      </div>
    </form>
  );
}

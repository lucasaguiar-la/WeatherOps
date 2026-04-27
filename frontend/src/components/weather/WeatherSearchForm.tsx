import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type WeatherSearchFormProps = {
  city: string;
  isLoading: boolean;
  onCityChange: (value: string) => void;
  onSubmit: () => void;
};

export function WeatherSearchForm({
  city,
  isLoading,
  onCityChange,
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
          hint="Exemplo: São Paulo, Rio de Janeiro, Ceará..."
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
      </div>
    </form>
  );
}

from pathlib import Path

import json
import requests

from backend.app.core.config import settings
from backend.app.db.database import Database
from backend.app.utils.formatter import Formatter


class WeatherClient:
    def __init__(self, database: Database):
        self.api_key = settings.api_key
        self.coordinates_url = 'http://api.openweathermap.org/geo/1.0/direct'
        self.weather_url = 'https://api.openweathermap.org/data/2.5/weather'
        self.db = database
        self.data_dir = settings.data_dir
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def _write_json(self, filename: str, payload: object) -> None:
        file_path = Path(self.data_dir) / filename
        with file_path.open('w', encoding='utf-8') as file:
            json.dump(payload, file, indent=2, ensure_ascii=False)

    def get_coordinates(self, city: str) -> dict | None:
        params = {
            'q': city,
            'appid': self.api_key,
        }

        try:
            response = requests.get(self.coordinates_url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()

            if not data:
                return None

            self._write_json('coordinates_data.json', data)

            location_id = self.db.insert_location(
                state=data[0]['name'],
                country=data[0]['country'],
                latitude=data[0]['lat'],
                longitude=data[0]['lon'],
            )

            return self.get_weather(location_id, data)
        except requests.exceptions.RequestException:
            return None

    def get_weather(self, location_id: int, coordinates: list[dict]) -> dict | None:
        params = {
            'lat': coordinates[0]['lat'],
            'lon': coordinates[0]['lon'],
            'appid': self.api_key,
            'units': 'metric',
            'lang': 'pt_br',
        }

        try:
            response = requests.get(self.weather_url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()

            self._write_json('weather_data.json', data)

            temperature = Formatter.format_temperature(data['main']['temp'])
            if temperature is None:
                return None

            self.db.insert_climate(
                location_id=location_id,
                temperature=temperature,
                description=data['weather'][0]['description'],
            )

            return data
        except requests.exceptions.RequestException:
            return None

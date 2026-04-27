from collections.abc import Generator

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.core.config import settings
from backend.app.db.database import Database
from backend.app.services.weather_client import WeatherClient

router = APIRouter()


def get_db() -> Generator[Database, None, None]:
    database = Database(
        db_name=settings.db_name,
        user=settings.db_user,
        password=settings.db_password,
        host=settings.db_host,
        port=settings.db_port,
    )
    try:
        yield database
    finally:
        database.close()


@router.get('/weather')
def get_weather(city: str = Query(..., min_length=1), db: Database = Depends(get_db)) -> dict[str, str]:
    client = WeatherClient(database=db)
    weather_data = client.get_coordinates(city=city)

    if not weather_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Dados meteorologicos nao encontrados.',
        )

    temperature = weather_data['main']['temp']
    description = weather_data['weather'][0]['description'].capitalize()

    return {
        'Cidade': city,
        'Temperatura': f'{temperature:.0f} \u00baC',
        'Descri\u00e7\u00e3o': description,
    }


@router.get('/history')
def get_history(db: Database = Depends(get_db)) -> list[dict[str, str]]:
    result = []
    historical = db.get_history()

    for record in historical:
        city = str(record[0])
        country = str(record[1])
        temperature = float(record[2])
        description = str(record[3])
        data_query = str(record[4])
        record_id = int(record[5])

        result.append(
            {
                'ID': str(record_id),
                'Cidade': city.capitalize(),
                'Pa\u00eds': country.upper(),
                'Temperatura': f'{temperature:.0f} C\u00ba',
                'Descri\u00e7\u00e3o': description.capitalize(),
                'data_query': data_query.split(' ')[0],
            }
        )

    return result


@router.delete('/delete/{record_id}')
def delete_record(record_id: int, db: Database = Depends(get_db)) -> dict[str, str]:
    result = db.delete_record(record_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Registro nao encontrado.',
        )

    city_record = result[0]
    data_record = str(result[1])

    return {
        'Sucesso': f'Registro {record_id} excluido com exito!',
        'Cidade': city_record,
        'Data da consulta': data_record.split(' ')[0],
    }


@router.delete('/all')
def delete_all_records(db: Database = Depends(get_db)) -> dict[str, str]:
    db.clear_data()
    return {
        'Sucesso': 'Todos os dados foram apagados com exito!',
    }


@router.get('/health')
def healthcheck() -> dict[str, str]:
    return {
        'status': 'ok',
        'service': settings.app_name,
    }

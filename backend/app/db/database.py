import psycopg2


class Database:
    def __init__(self, db_name: str, user: str, password: str, host: str, port: int):
        self.conn = psycopg2.connect(
            database=db_name,
            user=user,
            password=password,
            host=host,
            port=port,
        )
        self.cur = self.conn.cursor()

    def create_tables(self) -> None:
        try:
            self.cur.execute(
                '''
                CREATE TABLE IF NOT EXISTS locations (
                    id_location SERIAL PRIMARY KEY,
                    state VARCHAR(100) NOT NULL,
                    country VARCHAR(100) NOT NULL,
                    latitude DECIMAL(10,8) NOT NULL,
                    longitude DECIMAL(11,8) NOT NULL
                );
                '''
            )

            self.cur.execute(
                '''
                CREATE TABLE IF NOT EXISTS climate_data (
                    id_climate SERIAL PRIMARY KEY,
                    location_id INT NOT NULL REFERENCES locations(id_location) ON DELETE CASCADE,
                    temperature DECIMAL(5,2) NOT NULL,
                    description VARCHAR(200) NOT NULL,
                    data_query TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                '''
            )

            self.conn.commit()
        except Exception:
            self.conn.rollback()
            raise

    def insert_location(self, state: str, country: str, latitude: float, longitude: float) -> int:
        query = '''
            INSERT INTO locations (state, country, latitude, longitude)
            VALUES (%s, %s, %s, %s)
            RETURNING id_location
        '''

        self.cur.execute(query, (state, country, latitude, longitude))
        location_id = self.cur.fetchone()[0]
        self.conn.commit()

        return int(location_id)

    def insert_climate(self, location_id: int, temperature: float, description: str) -> None:
        query = '''
            INSERT INTO climate_data (location_id, temperature, description)
            VALUES (%s, %s, %s)
        '''

        self.cur.execute(query, (location_id, temperature, description))
        self.conn.commit()

    def get_history(self) -> list[tuple]:
        query = '''
            SELECT
                locations.state,
                locations.country,
                climate_data.temperature,
                climate_data.description,
                climate_data.data_query,
                climate_data.id_climate
            FROM climate_data
            JOIN locations ON locations.id_location = climate_data.location_id
            ORDER BY climate_data.data_query DESC, climate_data.id_climate DESC
        '''
        self.cur.execute(query)
        return self.cur.fetchall()

    def delete_record(self, record_id: int) -> tuple | None:
        select_query = '''
            SELECT
                locations.state,
                climate_data.data_query
            FROM climate_data
            JOIN locations ON locations.id_location = climate_data.location_id
            WHERE climate_data.id_climate = %s
        '''
        self.cur.execute(select_query, (record_id,))
        record_data = self.cur.fetchone()

        if not record_data:
            return None

        delete_query = 'DELETE FROM climate_data WHERE id_climate = %s'
        self.cur.execute(delete_query, (record_id,))
        self.conn.commit()
        return record_data

    def clear_data(self) -> None:
        try:
            self.cur.execute('TRUNCATE TABLE climate_data, locations RESTART IDENTITY CASCADE')
            self.conn.commit()
        except Exception:
            self.conn.rollback()
            raise

    def close(self) -> None:
        self.cur.close()
        self.conn.close()

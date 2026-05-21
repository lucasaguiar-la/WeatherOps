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

            self.cur.execute(
                '''
                CREATE TABLE IF NOT EXISTS health_logs (
                    id               SERIAL PRIMARY KEY,
                    checked_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    status           VARCHAR(10) NOT NULL,
                    response_time_ms INT NOT NULL,
                    http_status_code INT NOT NULL
                );
                '''
            )

            self.cur.execute(
                '''
                CREATE INDEX IF NOT EXISTS idx_health_logs_checked_at ON health_logs (checked_at);
                '''
            )

            self.conn.commit()
        except Exception:
            self.conn.rollback()
            raise

    def insert_health_log(self, status: str, response_time_ms: int, http_status_code: int) -> None:
        query = '''
            INSERT INTO health_logs (status, response_time_ms, http_status_code)
            VALUES (%s, %s, %s)
        '''
        self.cur.execute(query, (status, response_time_ms, http_status_code))
        self.conn.commit()

    def get_availability_last_24h(self) -> list[tuple]:
        query = '''
            SELECT
                date_trunc('hour', checked_at) AS hour_bucket,
                ROUND(100.0 * COUNT(*) FILTER (WHERE status != 'off') / COUNT(*), 1) AS uptime_pct,
                ROUND(AVG(response_time_ms), 0) AS avg_response_ms,
                CASE
                    WHEN bool_or(status = 'off')  THEN 'off'
                    WHEN bool_or(status = 'warn') THEN 'warn'
                    ELSE 'ok'
                END AS worst_status
            FROM health_logs
            WHERE checked_at >= NOW() - INTERVAL '24 hours'
            GROUP BY hour_bucket
            ORDER BY hour_bucket ASC;
        '''
        self.cur.execute(query)
        return self.cur.fetchall()

    def get_health_summary(self) -> tuple | None:
        query = '''
            SELECT
                ROUND(100.0 * COUNT(*) FILTER (WHERE status != 'off') / NULLIF(COUNT(*), 0), 1) AS uptime_pct,
                ROUND(AVG(response_time_ms), 0) AS avg_response_ms,
                COUNT(*) AS total_checks,
                MAX(checked_at) FILTER (WHERE status = 'off') AS last_incident_at
            FROM health_logs
            WHERE checked_at >= NOW() - INTERVAL '24 hours';
        '''
        self.cur.execute(query)
        return self.cur.fetchone()

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

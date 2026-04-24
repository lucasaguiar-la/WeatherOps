CREATE DATABASE weather_db;
-- Após criar o banco, conecte-se antes de criar as tabelas:
-- \c weather_db

CREATE TABLE IF NOT EXISTS locations (
    id_location SERIAL PRIMARY KEY,
    state VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);

CREATE TABLE IF NOT EXISTS climate_data (
    id_climate SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id_location),
    temperature DECIMAL(5,2),
    description VARCHAR(200),
    data_query TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

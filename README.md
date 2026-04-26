# Weather API Client
Este é um projeto Python que fornece uma API REST para consulta de previsão do tempo, armazenando os dados em um banco de dados PostgreSQL. A aplicação pode ser executada via Docker Compose, facilitando a configuração dos serviços.

---

## Sobre o Projeto
O projeto consiste em uma API que permite consultar dados meteorológicos de cidades, salvando as informações em um banco de dados para posterior análise. A aplicação utiliza a API OpenWeatherMap para obter coordenadas geográficas e dados climáticos.

## Tecnologias Utilizadas
- Python 3.13
- FastAPI
- PostgreSQL
- Docker
- Bibliotecas Python:
  - requests
  - psycopg2-binary
  - python-dotenv
  - outras (ver requirements.txt)

## Estrutura do Projeto
```
api_Weather/
    ├── api/
    │   ├── __init__.py
    │   └── endpoints.py        # Rotas da API
    ├── data/
    │   ├── coordinates_data.json   # Cache de dados de coordenadas
    │   └── weather_data.json       # Cache de dados meteorológicos
    ├── scripts/
    │   ├── __init__.py
    │   ├── database.py            # Gerenciamento do banco de dados
    │   └── get_weather_data.py    # Cliente da API externa
    ├── utils/
    │   ├── __init__.py
    │   └── formatter.py           # Utilitários de formatação
    ├── Dockerfile
    ├── main.py                    # Ponto de entrada da aplicação
    ├── requirements.in
    └── requirements.txt
```

## Configuração

### Variáveis de Ambiente
É necessário criar um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
API_KEY=seu_token_openweathermap
DB_NAME=weather_db
USER=weather_user
PASSWORD=senha_banco
HOST=localhost
PORT=5433
FRONTEND_URL=http://localhost:5173
```

### Banco de Dados
O projeto utiliza PostgreSQL e requer duas tabelas principais (que ja são criados automaticamente):
- `locations`: Armazena dados de localização
- `climate_data`: Armazena dados meteorológicos

## Endpoints da API

- `GET /`: Página inicial
- `GET /weather?city={cidade}`: Consulta temperatura atual
- `GET /history`: Lista histórico de consultas
- `DELETE /delete/{record_id}`: Remove um registro específico
- `DELETE /all`: Limpa todos os registros

## Docker
Para executar o projeto usando Docker:
```bash
docker build -t weather-api .
docker run -p 8000:8000 weather-api
```

## Como Executar Localmente
1. Clone o repositório
```bash
git clone https://github.com/lucasaguiar-la/api_Weather
cd api_Weather
```
2. Instale as dependências:
```bash
pip install -r requirements.txt
```
3. Execute a aplicação:
```bash
uvicorn main:app --reload
```

## Funcionalidades
- API REST com FastAPI
- Consulta de dados meteorológicos por cidade
- Histórico de consultas
- Armazenamento em PostgreSQL
- Formatação inteligente de temperaturas
- Documentação automática da API (Swagger UI)

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

# WeatherOps

Este é um projeto **Fullstack** para consulta de previsão do tempo, com histórico de buscas e monitoramento de API. O projeto utiliza uma arquitetura robusta com Frontend em React, Backend em FastAPI e banco de dados PostgreSQL, tudo orquestrado via Docker e utilizando Nginx.

</br>

##  Tecnologias
- **Frontend:** React (TypeScript), Vite, TanStack Query.
- **Backend:** Python 3.13, FastAPI, PostgreSQL.
- **DevOps/Infra:** Docker, Docker Compose, Nginx (Reverse Proxy).
- **API Externa:** OpenWeatherMap.

## Estrutura do Projeto
```text
api_Weather/
├── backend/            # API REST em FastAPI
│   ├── app/            # Lógica central, rotas e banco
│   └── database/       # Scripts SQL e modelagem
├── frontend/           # SPA em React + TypeScript
│   ├── src/            # Componentes, hooks e serviços
│   ├── Dockerfile      # Build multi-stage (Node + Nginx)
│   └── nginx.conf      # Configuração de proxy reverso
└── docker-compose.yml  # Orquestração de todos os serviços
```

## Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto seguindo o modelo abaixo:
```env
# Backend & DB
API_KEY=seu_token_openweathermap
DB_NAME=weather_db
USER=weather_user
PASSWORD=suasenha

# Frontend (Configurações de Build)
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000
```

## Como Executar

### Via Docker (Recomendado)
O projeto está configurado para subir todos os serviços (Banco, API e Frontend) com um único comando. O Nginx servirá o frontend na porta 80 e encaminhará as chamadas de API.

```bash
docker compose up --build -d
```
Acesse: `http://localhost`

### Desenvolvimento Local (Backend)
1. Instale as dependências: `pip install -r requirements.txt`
2. Inicie a API: `python main.py` ou `uvicorn backend.app.main:app --reload`

### Desenvolvimento Local (Frontend)
1. Acesse a pasta: `cd frontend`
2. Instale: `npm install`
3. Inicie: `npm run dev`

## Funcionalidades
- **Consulta em Tempo Real:** Dados meteorológicos precisos OpenWeather.
- **Histórico de Buscas:** Armazenamento persistente em PostgreSQL.
- **Proxy Reverso:** Nginx configurado para evitar problemas de CORS e unificar as portas.
- **Dockerizado:** Fácil deploy em qualquer servidor ou VPS.
- **Interface Moderna:** Componentizada e responsiva com React.

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

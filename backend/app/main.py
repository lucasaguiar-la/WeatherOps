from contextlib import asynccontextmanager

import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes import router as api_router
from backend.app.core.config import settings
from backend.app.db.database import Database


@asynccontextmanager
async def lifespan(app: FastAPI):
    database = Database(
        db_name=settings.db_name,
        user=settings.db_user,
        password=settings.db_password,
        host=settings.db_host,
        port=settings.db_port,
    )
    try:
        database.create_tables()
        yield
    finally:
        database.close()


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, lifespan=lifespan)
    frontend_port = settings.frontend_url.rsplit(':', 1)[-1]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url],
        allow_origin_regex=rf'^https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):{frontend_port}$',
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )
    app.include_router(api_router)

    @app.get('/')
    def read_root() -> dict[str, str]:
        return {'\u00d3la': 'Bem-vindo \u00e0 Weather API!'}

    return app


app = create_app()


if __name__ == '__main__':
    uvicorn.run('backend.app.main:app', host=settings.app_host, port=settings.app_port, reload=True)

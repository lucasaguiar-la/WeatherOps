import asyncio
import time
from collections.abc import Callable
from contextlib import asynccontextmanager

import requests
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes import router as api_router
from backend.app.core.config import settings
from backend.app.db.database import Database

HEALTH_CHECK_INTERVAL = 60


async def _health_check_loop(port: int, db_factory: Callable[[], Database]) -> None:
    url = f'http://localhost:{port}/health'
    while True:
        try:
            start = time.monotonic()
            http_status = 0
            try:
                loop = asyncio.get_event_loop()
                resp = await loop.run_in_executor(
                    None, lambda: requests.get(url, timeout=5)
                )
                http_status = resp.status_code
            except Exception:
                http_status = 0
            elapsed_ms = int((time.monotonic() - start) * 1000)

            if http_status == 200 and elapsed_ms < 500:
                status = 'ok'
            elif http_status == 200:
                status = 'warn'
            else:
                status = 'off'

            db = db_factory()
            try:
                db.insert_health_log(status, elapsed_ms, http_status)
            finally:
                db.close()
        except Exception:
            pass
        await asyncio.sleep(HEALTH_CHECK_INTERVAL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    database = Database(
        db_name=settings.db_name,
        user=settings.db_user,
        password=settings.db_password,
        host=settings.db_host,
        port=settings.db_port,
    )

    def db_factory() -> Database:
        return Database(
            db_name=settings.db_name,
            user=settings.db_user,
            password=settings.db_password,
            host=settings.db_host,
            port=settings.db_port,
        )

    task = None
    try:
        database.create_tables()
        task = asyncio.create_task(_health_check_loop(settings.app_port, db_factory))
        yield
    finally:
        if task is not None:
            task.cancel()
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
        return {'\u00d3la': 'Bem-vindo \u00e0 WeatherOps!'}

    return app


app = create_app()


if __name__ == '__main__':
    uvicorn.run('backend.app.main:app', host=settings.app_host, port=settings.app_port, reload=True)

import uvicorn

from backend.app.core.config import settings
from backend.app.main import app


if __name__ == '__main__':
    uvicorn.run('backend.app.main:app', host=settings.app_host, port=settings.app_port, reload=True)

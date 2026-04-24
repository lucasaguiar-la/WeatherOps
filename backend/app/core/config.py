from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

import os

load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_name: str = 'Weather API'
    app_host: str = field(default_factory=lambda: os.getenv('APP_HOST', '0.0.0.0'))
    app_port: int = field(default_factory=lambda: int(os.getenv('APP_PORT', '8000')))
    api_key: str = field(default_factory=lambda: os.getenv('API_KEY', ''))
    db_name: str = field(default_factory=lambda: os.getenv('DB_NAME', 'weather'))
    db_user: str = field(default_factory=lambda: os.getenv('USER', 'user'))
    db_password: str = field(default_factory=lambda: os.getenv('PASSWORD', 'password'))
    db_host: str = field(default_factory=lambda: os.getenv('HOST', 'localhost'))
    db_port: int = field(default_factory=lambda: int(os.getenv('PORT', '5432')))
    frontend_url: str = field(default_factory=lambda: os.getenv('FRONTEND_URL', 'http://localhost:5173'))
    data_dir: Path = field(
        default_factory=lambda: Path(os.getenv('DATA_DIR', 'backend/data')).resolve()
    )


settings = Settings()

# GUIA DE DEPLOY - NGINX (weather.lucasaguiar.online)

Este guia explica como configurar o Nginx do seu servidor para apontar para este projeto rodando via Docker.

## 1. Configuração do DNS
No seu provedor de domínio (ex: Cloudflare, Registro.br, HostGator):
1. Crie um novo registro do tipo "A".
2. Nome/Host: `weather`
3. Valor/IP: O endereço IP do seu servidor.

## 2. Configuração do Nginx no Servidor
Recomenda-se criar um novo arquivo em `/etc/nginx/sites-available/weather` e criar um link simbólico para `sites-enabled`.

### Conteúdo do arquivo Nginx:
```nginx
server {
    listen 80;
    server_name weather.lucasaguiar.online;

    # Frontend - Projeto Weather
    location / {
        proxy_pass http://localhost:8081; # Porta configurada no seu docker-compose
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend/API - Projeto Weather
    location /api/ {
        proxy_pass http://localhost:8000/; # Porta do backend com barra ao final
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 3. Alterações necessárias neste projeto (Weather)

### A. Docker Compose
As portas já estão mapeadas como:
- Frontend: 8081
- Backend: 8000
Certifique-se de que essas portas não estão sendo usadas por outros serviços no seu servidor. Caso precise mudar, altere no `docker-compose.yml`.

### B. Frontend (Base URL)
Como estamos usando um subdomínio (`weather.lucasaguiar.online`), o `base` no `vite.config.ts` deve continuar como `/`. Não é necessário alterar o código do frontend se as requisições para a API já usam o caminho relativo `/api`.

## 4. Comandos para Aplicar
Após criar o arquivo no Nginx:
1. Verifique se a sintaxe está correta: `sudo nginx -t`
2. Reinicie o Nginx: `sudo systemctl restart nginx`
3. Suba o projeto: `docker-compose up -d --build`

---
Nota sobre o arquivo 'portfolio': Você pode renomeá-lo para 'portfolio.conf' sem problemas. O Nginx apenas lê o conteúdo. Apenas evite nomes com espaços ou caracteres especiais.

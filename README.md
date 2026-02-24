# PulseAPI Web

Frontend para o backend PulseAPI, oferecendo um painel web para monitoramento de endpoints HTTP. A interface é inspirada em Frutiger Aero com glassmorphism, gradientes suaves e foco em legibilidade operacional.

## O que este projeto faz
- Autenticação (login e registro).
- Dashboard com totais, alertas recentes e piores monitores.
- Gestão de monitores com recheck manual.
- Visualização de métricas por janela (24h, 7d, 30d).
- Lista de alertas com fluxo de acknowledge.

## Arquitetura
- React + TypeScript com roteamento via React Router.
- Camada de API com Axios e interceptors.
- Cache e sincronização de dados via TanStack Query.
- Componentes UI próprios e Tailwind CSS para estilo.

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- Recharts

## Requisitos
- Node.js 20 LTS (ou superior)
- API PulseAPI disponível (local ou Railway)

## Configuração
1. Instale dependências:
```bash
npm install
```

2. Configure a base URL da API:
```bash
cp .env.example .env
```

Edite `.env` com o endereço da API. Em produção (Railway):
```
VITE_API_BASE_URL=https://pulseapi-production-c537.up.railway.app
```

3. Inicie o app:
```bash
npm run dev
```

## Scripts
- `npm run dev` inicia o ambiente local.
- `npm run build` gera a build de produção.
- `npm run preview` pré-visualiza a build localmente.
- `npm test` roda os testes (Vitest).

## Deploy (Vercel)
1. Crie um novo projeto e conecte este repositório.
2. Configure a variável `VITE_API_BASE_URL`.
3. Faça o deploy.
4. O projeto publica headers de segurança via `vercel.json` (CSP, HSTS, X-Frame-Options e outros).

## Observações
- A UI usa apenas endpoints documentados pelo backend PulseAPI.
- O access token fica apenas em memória; refresh token usa cookie HttpOnly no backend.

# Grid Asset Management & Performance

> EPRI AI for Power Challenge — agentic dashboard built on Azure AI Foundry.

AI-driven inspection, maintenance, and lifecycle optimization across transmission and distribution assets

## Architecture

- **Backend**: FastAPI + WebSocket + synthetic data simulator
- **Frontend**: React / Vite / Tailwind / MapLibre / Recharts
- **Agents**: 11 agents registered in **Azure AI Foundry**
  (orchestrator + 10 specialists)
- **Models**: GPT-5 family per-agent (gpt-5 / gpt-5-mini / gpt-5-chat)
- **Deployment**: Azure Container Apps, Bicep IaC

## Agent fabric

| Agent | Domain | Mission |
|---|---|---|
| `gam-orchestrator` | routing | Routes requests + aggregates evidence |
| `gam-asset-image-analysis` | imaging | Drone, thermal & ground imagery → defect classification |
| `gam-inspection-prioritization` | inspection | Risk-weighted inspection scheduling from imagery + history |
| `gam-maintenance-optimization` | maintenance | Cost-optimal maintenance schedules + crew routing |
| `gam-overhead-line-design-qa` | design | Validate OH-line designs against standards & failure history |
| `gam-vegetation-management` | vegetation | Satellite + LiDAR vegetation risk → optimized trim cycles |
| `gam-condition-monitoring` | monitoring | Multi-sensor fusion → asset health scores |
| `gam-rating-breach-prediction` | thermal | Dynamic line rating + thermal breach forecast |
| `gam-transformer-failure-risk` | transformer | DGA + load profile → failure-risk index |
| `gam-transformer-overload` | overload | Live overload detection + load-transfer plan |
| `gam-underground-cable-health` | cable | PD + tan-δ analytics for UG cable lifecycle |

## Scenarios

- **Drone Survey Findings** → `gam-asset-image-analysis` — Imagery batch flagged 14 insulator anomalies on circuit T-44
- **Vegetation Encroachment** → `gam-vegetation-management` — LiDAR shows 3 spans below clearance on OH-12 corridor
- **Transformer DGA Spike** → `gam-transformer-failure-risk` — Acetylene rose 4× on bank TX-09 — investigate
- **Thermal Breach Forecast** → `gam-rating-breach-prediction` — Heat dome forecast → 6 lines projected over rating in 72h
- **Live Overload** → `gam-transformer-overload` — TX-22 at 138% nameplate, oil temp climbing
- **UG Cable PD Trend** → `gam-underground-cable-health` — PD on cable C-301 trending up — aging risk
- **Inspection Backlog** → `gam-inspection-prioritization` — 412 inspections pending — propose priority order
- **Design QA Audit** → `gam-overhead-line-design-qa` — Audit OH-line designs in past 12 months for code conformance

## Local dev

```bash
# API
cd apps/dashboard-api
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Web
cd apps/dashboard-web
npm install && npm run dev
```

## Deploy

```bash
./scripts/deploy.sh   # provisions Container Apps + seeds Foundry agents
```

---
Part of the [EPRI AI for Power Challenge 2026](https://epri.brightidea.com/AIforPower2026) demo set.

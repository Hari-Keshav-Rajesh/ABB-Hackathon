## IntelliInspect (Angular + FastAPI)

End-to-end demo that pairs a FastAPI backend with an Angular 18+ frontend to simulate a quality inspection ML workflow: dataset load, date-range validation, anomaly detection training, and live simulation.

### Repository structure
- `api/` — FastAPI service exposing dataset metadata, date-range validation, training, and simulation endpoints
- `frontend/` — Angular app (Material + Chart.js) that simulates the workflow in the browser

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- A CSV file named `train_numeric.csv` placed inside `api/` (required by the backend)

### Quick start
1) Backend (FastAPI)
- Place your dataset at `api/train_numeric.csv`.
- In a terminal:
  - Windows (CMD):
    - `cd api`
    - `python -m venv .venv && .venv\Scripts\activate`
    - `pip install fastapi uvicorn pandas scikit-learn numpy`
    - `uvicorn main:app --reload --port 8000`
  - macOS/Linux (bash):
    - `cd api`
    - `python -m venv .venv && source .venv/bin/activate`
    - `pip install fastapi uvicorn pandas scikit-learn numpy`
    - `uvicorn main:app --reload --port 8000`

2) Frontend (Angular)
- In a separate terminal:
  - `cd frontend`
  - `npm ci`
  - `npx ng serve --port 5000 --open`
- App runs at `http://localhost:5000`.

Notes:
- The current Angular app uses simulated data and doesn’t call the API by default. You can integrate the API by adding HTTP calls in `frontend/src/app/services/data.service.ts` (see API section below).

### API overview (served by `api/` on port 8000)
- `GET /` — health check
- `GET /dataset-metadata` — basic dataset summary
- `POST /validate-ranges` — validates training/testing/simulation time windows and returns counts/durations
- `POST /train-and-detect` — trains an Isolation Forest on the training window and reports anomalies on the test window
- `POST /run-simulation` — runs anomaly prediction over the simulation window (requires prior training)

Example requests (PowerShell/CMD friendly):

```bash
curl http://localhost:8000/dataset-metadata

curl -X POST http://localhost:8000/validate-ranges ^
  -H "Content-Type: application/json" ^
  -d "{\"train_start\":\"2021-01-01 00:00:00\",\"train_end\":\"2021-01-10 23:59:59\",\"test_start\":\"2021-01-11 00:00:00\",\"test_end\":\"2021-01-15 23:59:59\",\"sim_start\":\"2021-01-16 00:00:00\",\"sim_end\":\"2021-01-20 23:59:59\"}"

curl -X POST http://localhost:8000/train-and-detect

curl -X POST http://localhost:8000/run-simulation
```

### Troubleshooting
- Backend fails on startup with "Dataset not found": Ensure `api/train_numeric.csv` exists. The backend loads only the first 50,000 rows by default for speed.
- `No trained model found` on `/run-simulation`: Call `/validate-ranges` then `/train-and-detect` first.
- Frontend 404 or port already in use: Change the dev server port using `npx ng serve --port 5001` and update your links.



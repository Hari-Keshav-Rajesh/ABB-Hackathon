# FastAPI service (IntelliInspect backend)

This service powers dataset loading, date-range validation, anomaly detection training, and simulation.

## Requirements
- Python 3.10+
- A CSV dataset at `api/train_numeric.csv`
  - The file must include a `Response` column. If no `synthetic_timestamp` column exists, the service will generate one on load (minute-wise from 2021-01-01).

## Install and run

Windows (CMD):
```bat
cd api
python -m venv .venv && .venv\Scripts\activate
pip install fastapi uvicorn pandas scikit-learn numpy
uvicorn main:app --reload --port 8000
```

macOS/Linux (bash):
```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install fastapi uvicorn pandas scikit-learn numpy
uvicorn main:app --reload --port 8000
```

On startup, the app loads the first 50,000 rows (configurable) of `train_numeric.csv` into memory for responsiveness during demos.

## Endpoints
- `GET /` — Health check
- `GET /dataset-metadata` — Returns dataset summary: total records, columns, pass rate from `Response`, and available date range
- `POST /validate-ranges` — Validates and summarizes training, testing, and simulation date windows
  - JSON body example:
    ```json
    {
      "train_start": "2021-01-01 00:00:00",
      "train_end":   "2021-01-10 23:59:59",
      "test_start":  "2021-01-11 00:00:00",
      "test_end":    "2021-01-15 23:59:59",
      "sim_start":   "2021-01-16 00:00:00",
      "sim_end":     "2021-01-20 23:59:59"
    }
    ```
- `POST /train-and-detect` — Trains Isolation Forest on training window and reports anomaly counts on test window
- `POST /run-simulation` — Uses trained model to predict anomalies for the simulation window

## Workflow
1. Load app and dataset (handled automatically at startup).
2. `POST /validate-ranges` with your desired time windows.
3. `POST /train-and-detect` to train and evaluate on the test window.
4. `POST /run-simulation` to run predictions across the simulation window.

## Configuration
- Rows loaded at startup are set in `step1.load_dataset(nrows=50000)` inside `main.py`. Adjust as needed.
- Expected dataset path: `api/train_numeric.csv`. Modify `step1.load_dataset(filename=...)` to point elsewhere.

## CORS (if calling from the Angular app)
If you integrate the frontend and need browser calls to this API, enable CORS:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Notes
- The `Response` column is used to compute a pass rate and as part of feature space after timestamp removal.
- Missing values are imputed using mean strategy before model training and prediction.


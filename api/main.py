from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import step1
import step2
import step3
import step4

app = FastAPI()

@app.on_event("startup")
def startup_event():
    try:
        step1.load_dataset(nrows=50000)
    except Exception as e:
        raise RuntimeError(f"Failed to load dataset: {e}")

@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

@app.get("/dataset-metadata")
def dataset_metadata():
    try:
        metadata = step1.get_metadata()
        return JSONResponse(content={"metadata": metadata})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate-ranges")
def validate_ranges(ranges: dict):
    """
    Validate training, testing, and simulation date ranges.
    Payload example:
    {
        "train_start": "2021-01-01 00:00:00",
        "train_end":   "2021-01-10 23:59:59",
        "test_start":  "2021-01-11 00:00:00",
        "test_end":    "2021-01-15 23:59:59",
        "sim_start":   "2021-01-16 00:00:00",
        "sim_end":     "2021-01-20 23:59:59"
    }
    """
    try:
        result = step2.validate_date_ranges(
            ranges["train_start"], ranges["train_end"],
            ranges["test_start"], ranges["test_end"],
            ranges["sim_start"], ranges["sim_end"]
        )
        return JSONResponse(content=result)
    except KeyError:
        raise HTTPException(status_code=400, detail="Missing one or more required date fields")

@app.post("/train-and-detect")
def train_and_detect():
    return step3.train_and_detect()

import step4

@app.post("/run-simulation")
def run_simulation():
    return step4.run_simulation()

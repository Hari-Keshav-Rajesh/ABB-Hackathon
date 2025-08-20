from fastapi import HTTPException
from datetime import datetime
import step1   # reuse dataset

def validate_date_ranges(train_start, train_end, test_start, test_end, sim_start, sim_end):
    """Validate and summarize the given date ranges."""

    # Parse into datetime objects
    try:
        train_start = datetime.fromisoformat(train_start)
        train_end   = datetime.fromisoformat(train_end)
        test_start  = datetime.fromisoformat(test_start)
        test_end    = datetime.fromisoformat(test_end)
        sim_start   = datetime.fromisoformat(sim_start)
        sim_end     = datetime.fromisoformat(sim_end)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid datetime format. Use ISO format (YYYY-MM-DD HH:MM:SS)")

    df = step1.DATASET_CACHE.get("dataset")
    if df is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded")

    min_time = df["synthetic_timestamp"].min()
    max_time = df["synthetic_timestamp"].max()

    # Rule checks
    if not (min_time <= train_start <= train_end <= max_time):
        return {"status": "Invalid", "message": "Training period out of range"}

    if not (train_end < test_start <= test_end <= max_time):
        return {"status": "Invalid", "message": "Testing period must follow training"}

    if not (test_end < sim_start <= sim_end <= max_time):
        return {"status": "Invalid", "message": "Simulation period must follow testing"}

    # Count records
    train_count = df[(df["synthetic_timestamp"] >= train_start) & (df["synthetic_timestamp"] <= train_end)].shape[0]
    test_count  = df[(df["synthetic_timestamp"] >= test_start) & (df["synthetic_timestamp"] <= test_end)].shape[0]
    sim_count   = df[(df["synthetic_timestamp"] >= sim_start) & (df["synthetic_timestamp"] <= sim_end)].shape[0]

    summary = {
        "status": "Valid",
        "train_records": train_count,
        "test_records": test_count,
        "sim_records": sim_count,
        "durations": {
            "train_days": (train_end - train_start).days + 1,
            "test_days":  (test_end - test_start).days + 1,
            "sim_days":   (sim_end - sim_start).days + 1,
        },
        "available_range": {
            "start": str(min_time),
            "end": str(max_time)
        }
    }

    # ✅ Store globally in cache
    step1.DATASET_CACHE["ranges"] = {
        "train_start": train_start,
        "train_end": train_end,
        "test_start": test_start,
        "test_end": test_end,
        "sim_start": sim_start,
        "sim_end": sim_end
    }

    return summary

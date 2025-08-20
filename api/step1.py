import pandas as pd
from datetime import datetime, timedelta
import os

# Global cache for dataset
DATASET_CACHE = {}

def load_dataset(nrows=50000, filename="train_numeric.csv"):
    """
    Load a subset of the dataset into memory.
    - nrows: number of rows to load (default = 50,000 for hackathon speed)
    - filename: dataset file (default = train_numeric.csv in same folder)
    """
    dataset_path = os.path.join(os.path.dirname(__file__), filename)

    if not os.path.exists(dataset_path):
        raise RuntimeError(f"Dataset not found at {dataset_path}")

    print(f"📂 Loading dataset subset (first {nrows} rows) from {dataset_path}...")
    df = pd.read_csv(dataset_path, nrows=nrows)

    if "Response" not in df.columns:
        raise RuntimeError("Dataset must contain 'Response' column")

    # Add synthetic timestamps if missing
    if "synthetic_timestamp" not in df.columns:
        start_time = datetime(2021, 1, 1, 0, 0, 0)
        df["synthetic_timestamp"] = [
                                        start_time + timedelta(minutes=i) for i in range(len(df))
                                    ] #range of 34.7 days

    DATASET_CACHE["dataset"] = df
    print(f"✅ Dataset subset loaded: {len(df)} rows, {len(df.columns)} columns")


def get_metadata():
    """Return dataset summary metadata as a dict."""
    if "dataset" not in DATASET_CACHE:
        raise RuntimeError("Dataset not loaded")

    df = DATASET_CACHE["dataset"]

    total_records = len(df)
    total_columns = len(df.columns)
    pass_rate = (df["Response"].sum() / total_records) * 100
    min_time = df["synthetic_timestamp"].min()
    max_time = df["synthetic_timestamp"].max()

    return {
        "total_records": total_records,
        "total_columns": total_columns,
        "pass_rate": f"{pass_rate:.2f}%",
        "date_range": f"{min_time} to {max_time}",
    }

import step1, step2
import numpy as np
from sklearn.ensemble import IsolationForest
from fastapi import HTTPException
from sklearn.impute import SimpleImputer

def train_and_detect():
    df = step1.DATASET_CACHE.get("dataset")
    ranges = step1.DATASET_CACHE.get("ranges")

    if df is None or ranges is None:
        raise HTTPException(status_code=400, detail="Dataset or ranges not set")

    # Slice data based on global ranges
    train_df = df[(df["synthetic_timestamp"] >= ranges["train_start"]) & 
                  (df["synthetic_timestamp"] <= ranges["train_end"])]

    test_df = df[(df["synthetic_timestamp"] >= ranges["test_start"]) & 
                 (df["synthetic_timestamp"] <= ranges["test_end"])]

    # Use only numeric columns (exclude timestamp)
    features = df.drop(columns=["synthetic_timestamp"]).columns
    X_train = train_df[features].values
    X_test = test_df[features].values

    # Handle NaNs using imputation (mean strategy)
    imputer = SimpleImputer(strategy="mean")
    X_train = imputer.fit_transform(X_train)
    X_test = imputer.transform(X_test)

    # Train Isolation Forest
    model = IsolationForest(contamination=0.05, random_state=42)
    step1.DATASET_CACHE["model"] = model
    model.fit(X_train)

    # Predict anomalies on test data
    preds = model.predict(X_test)  # -1 = anomaly, 1 = normal
    anomalies = np.sum(preds == -1)

    return {
        "train_samples": X_train.shape[0],
        "test_samples": X_test.shape[0],
        "anomalies_detected": int(anomalies),
        "anomaly_percentage": float(anomalies) / X_test.shape[0] * 100
    }

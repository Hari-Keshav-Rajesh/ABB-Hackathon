import step1, step2, step3
import numpy as np
from fastapi import HTTPException
from sklearn.impute import SimpleImputer

def run_simulation():
    df = step1.DATASET_CACHE.get("dataset")
    ranges = step1.DATASET_CACHE.get("ranges")

    if df is None or ranges is None:
        raise HTTPException(status_code=400, detail="Dataset or ranges not set")

    # Slice simulation range
    sim_df = df[(df["synthetic_timestamp"] >= ranges["sim_start"]) & 
                (df["synthetic_timestamp"] <= ranges["sim_end"])]

    if sim_df.empty:
        raise HTTPException(status_code=400, detail="No data found in simulation range")

    # Use same features as step3
    features = df.drop(columns=["synthetic_timestamp"]).columns
    X_sim = sim_df[features].values

    # Handle NaNs with imputer (same strategy as training)
    imputer = SimpleImputer(strategy="mean")
    X_sim = imputer.fit_transform(X_sim)

    # Train new Isolation Forest (or reuse one if cached)
    model = step1.DATASET_CACHE.get("model", None)
    if model is None:
        raise HTTPException(status_code=400, detail="No trained model found. Run training first.")

    # Predict anomalies
    preds = model.predict(X_sim)  # -1 = anomaly, 1 = normal
    sim_df = sim_df.copy()
    sim_df["anomaly"] = preds

    # Count anomalies
    anomaly_count = np.sum(preds == -1)

    return {
        "simulation_samples": sim_df.shape[0],
        "anomalies_detected": int(anomaly_count),
        "anomaly_percentage": float(anomaly_count) / sim_df.shape[0] * 100,
        "sample_results": sim_df[["synthetic_timestamp", "anomaly"]].head(10).to_dict(orient="records")  # preview
    }

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import step1   # import your dataset logic

app = FastAPI()

@app.on_event("startup")
def startup_event():
    """Load dataset subset when server starts."""
    try:
        step1.load_dataset(nrows=50000)   # load first 50k rows
    except Exception as e:
        raise RuntimeError(f"Failed to load dataset: {e}")

@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

@app.get("/dataset-metadata")
def dataset_metadata():
    """Return dataset summary from Step 1."""
    try:
        metadata = step1.get_metadata()
        return JSONResponse(content={"metadata": metadata})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

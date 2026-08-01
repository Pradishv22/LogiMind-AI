import sys
import json
import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "warehouse_model.pkl")

model = joblib.load(MODEL_PATH)

capacity = float(sys.argv[1])
occupied = float(sys.argv[2])
incoming = float(sys.argv[3])
outgoing = float(sys.argv[4])
workers = float(sys.argv[5])

sample = pd.DataFrame([{
    "capacity": capacity,
    "occupied": occupied,
    "incoming": incoming,
    "outgoing": outgoing,
    "workers": workers
}])

prediction = model.predict(sample)[0]
probability = model.predict_proba(sample)[0][1]

print(json.dumps({
    "prediction": "High Congestion" if prediction == 1 else "Normal",
    "congestion_probability": round(probability * 100, 2)
}))
import sys
import json
import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "breakdown_model.pkl")

model = joblib.load(MODEL_PATH)

vehicle_age = float(sys.argv[1])
mileage_km = float(sys.argv[2])
engine_temp = float(sys.argv[3])
tyre_health = float(sys.argv[4])
fuel_level = float(sys.argv[5])
maintenance_score = float(sys.argv[6])

sample = pd.DataFrame([{
    "vehicle_age": vehicle_age,
    "mileage_km": mileage_km,
    "engine_temp": engine_temp,
    "tyre_health": tyre_health,
    "fuel_level": fuel_level,
    "maintenance_score": maintenance_score
}])

prediction = model.predict(sample)[0]
probability = model.predict_proba(sample)[0][1]

print(json.dumps({
    "prediction": "Breakdown Risk" if prediction == 1 else "Healthy",
    "breakdown_probability": round(probability * 100, 2)
}))
import sys
import json
import joblib
import pandas as pd
import os

# Absolute path to model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "delay_model.pkl")

model = joblib.load(MODEL_PATH)

priority = int(sys.argv[1])
distance = float(sys.argv[2])
traffic = int(sys.argv[3])
weather = int(sys.argv[4])
vehicle_health = float(sys.argv[5])
fuel_level = float(sys.argv[6])
warehouse_utilization = float(sys.argv[7])

sample = pd.DataFrame([{
    "priority": priority,
    "distance_km": distance,
    "traffic_level": traffic,
    "weather": weather,
    "vehicle_health": vehicle_health,
    "fuel_level": fuel_level,
    "warehouse_utilization": warehouse_utilization
}])

prediction = model.predict(sample)[0]
probability = model.predict_proba(sample)[0][1]

print(json.dumps({
    "prediction": "Delayed" if prediction == 1 else "On Time",
    "delay_probability": round(probability * 100, 2)
}))
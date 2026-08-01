import sys
import json
import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "eta_model.pkl")

model = joblib.load(MODEL_PATH)

distance = float(sys.argv[1])
traffic = int(sys.argv[2])
weather = int(sys.argv[3])
speed = float(sys.argv[4])
fuel = float(sys.argv[5])
stops = int(sys.argv[6])

sample = pd.DataFrame([{
    "distance_km": distance,
    "traffic_level": traffic,
    "weather": weather,
    "average_speed": speed,
    "fuel_level": fuel,
    "stops": stops
}])

eta = model.predict(sample)[0]

print(json.dumps({
    "predicted_eta_hours": round(float(eta), 2)
}))
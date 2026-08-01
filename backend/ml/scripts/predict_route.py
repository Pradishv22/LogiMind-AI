import sys
import json
import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR,"..","models","route_model.pkl")

model = joblib.load(MODEL_PATH)

distance=float(sys.argv[1])
traffic=int(sys.argv[2])
weather=int(sys.argv[3])
road=int(sys.argv[4])
crime=int(sys.argv[5])
flood=int(sys.argv[6])

sample=pd.DataFrame([{
    "distance_km":distance,
    "traffic_level":traffic,
    "weather":weather,
    "road_quality":road,
    "crime_index":crime,
    "flood_risk":flood
}])

prediction=model.predict(sample)[0]
prob=model.predict_proba(sample)[0][1]

print(json.dumps({
    "prediction":"High Risk" if prediction else "Safe",
    "risk_probability":round(prob*100,2)
}))
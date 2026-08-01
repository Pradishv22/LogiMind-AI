import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

data = pd.read_csv("../dataset/route.csv")

X = data[
    [
        "distance_km",
        "traffic_level",
        "weather",
        "road_quality",
        "crime_index",
        "flood_risk"
    ]
]

y = data["risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\n===========================")
print("Route Risk Model")
print("===========================")
print(f"Accuracy : {accuracy*100:.2f}%")

joblib.dump(model,"../models/route_model.pkl")

print("\nModel saved successfully.")
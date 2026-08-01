import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Load Dataset
data = pd.read_csv("../dataset/eta.csv")

# Features
X = data[
    [
        "distance_km",
        "traffic_level",
        "weather",
        "average_speed",
        "fuel_level",
        "stops",
    ]
]

# Target
y = data["eta_hours"]

# Split Dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# Train Model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
)

model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)

# Evaluation
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\n=============================")
print("ETA Prediction Model")
print("=============================")
print(f"Mean Absolute Error : {mae:.2f} hrs")
print(f"R² Score            : {r2:.4f}")

# Save Model
joblib.dump(model, "../models/eta_model.pkl")

print("\nModel saved successfully.")
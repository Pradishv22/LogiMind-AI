import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load Dataset
data = pd.read_csv("../dataset/shipments.csv")

# Features
X = data[
    [
        "priority",
        "distance_km",
        "traffic_level",
        "weather",
        "vehicle_health",
        "fuel_level",
        "warehouse_utilization",
    ]
]

# Target
y = data["delay"]

# Split Dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# Train Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
)

model.fit(X_train, y_train)

# Predictions
predictions = model.predict(X_test)

# Accuracy
accuracy = accuracy_score(y_test, predictions)

print("\n==============================")
print("Delay Prediction Model")
print("==============================")
print(f"Accuracy : {accuracy * 100:.2f}%")

print("\nClassification Report\n")
print(classification_report(y_test, predictions))

# Save Model
joblib.dump(model, "../models/delay_model.pkl")

print("\nModel saved successfully.")
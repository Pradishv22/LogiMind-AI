import json
import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCRIPTS = os.path.join(BASE_DIR, "..", "scripts")

BASE_INPUTS = {
    "delay": ["3", "1200", "5", "2", "40", "25", "95"],
    "eta": ["800", "5", "2", "35", "50", "5"],
    "breakdown": ["7", "180000", "105", "35", "25", "35"],
    "warehouse": ["1200", "1160", "250", "110", "18"],
    "route": ["900", "5", "2", "3", "5", "2"],
}

# Each profile changes model inputs only; prediction values always come from the existing models.
SCENARIOS = {
    "truck-breakdown": {"breakdown": ["9", "250000", "112", "20", "18", "20"], "delay": ["3", "1200", "5", "2", "25", "18", "95"]},
    "heavy-rain": {"delay": ["3", "1200", "5", "5", "40", "25", "95"], "eta": ["800", "5", "5", "24", "50", "6"], "route": ["900", "5", "5", "3", "5", "5"]},
    "fuel-shortage": {"delay": ["3", "1200", "4", "2", "40", "8", "95"], "eta": ["800", "4", "2", "30", "8", "6"], "breakdown": ["7", "180000", "105", "35", "8", "35"]},
    "road-closure": {"delay": ["3", "1400", "5", "2", "40", "25", "95"], "eta": ["1100", "5", "2", "25", "50", "7"], "route": ["1100", "5", "2", "2", "5", "2"]},
    "warehouse-fire": {"warehouse": ["1200", "1180", "320", "30", "10"], "delay": ["3", "1200", "4", "2", "40", "25", "99"]},
    "traffic-congestion": {"delay": ["3", "1200", "5", "2", "40", "25", "95"], "eta": ["800", "5", "2", "12", "50", "7"], "route": ["900", "5", "2", "3", "5", "2"]},
    "driver-unavailable": {"delay": ["3", "1200", "4", "2", "40", "25", "95"], "eta": ["800", "4", "2", "28", "50", "6"]},
    "warehouse-overflow": {"warehouse": ["1200", "1190", "380", "70", "12"], "delay": ["3", "1200", "4", "2", "40", "25", "99"]},
    "vehicle-accident": {"breakdown": ["8", "210000", "110", "22", "20", "25"], "delay": ["3", "1300", "5", "2", "30", "20", "95"], "route": ["1000", "5", "2", "2", "5", "2"]},
    "high-demand-surge": {"warehouse": ["1200", "1140", "420", "90", "18"], "delay": ["3", "1200", "5", "2", "40", "25", "98"], "eta": ["900", "5", "2", "30", "50", "8"]},
}

def run(script, args):
    result = subprocess.run(
        [sys.executable, os.path.join(SCRIPTS, script)] + args,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return {"error": result.stderr}
    return json.loads(result.stdout)

scenario_key = sys.argv[1] if len(sys.argv) > 1 else "baseline"
if scenario_key != "baseline" and scenario_key not in SCENARIOS:
    print(json.dumps({"error": "Unknown simulation scenario", "scenario": scenario_key}))
    sys.exit(1)

inputs = BASE_INPUTS.copy()
inputs.update(SCENARIOS.get(scenario_key, {}))

decision = {
    "scenario": scenario_key,
    "delay": run("predict_delay.py", inputs["delay"]),
    "eta": run("predict_eta.py", inputs["eta"]),
    "breakdown": run("predict_breakdown.py", inputs["breakdown"]),
    "warehouse": run("predict_warehouse.py", inputs["warehouse"]),
    "route": run("predict_route.py", inputs["route"]),
}

print(json.dumps(decision))

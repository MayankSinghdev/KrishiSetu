import joblib
import pandas as pd


MODEL_PATH = "ml/models/yield_model.joblib"


def main():
    model = joblib.load(MODEL_PATH)

    sample_input = pd.DataFrame(
        [
            {
                "Crop": "Rice",
                "Season": "Kharif",
                "State": "Uttar Pradesh",
                "Crop_Year": 2020,
                "Area": 1000.0,
                "Annual_Rainfall": 1000.0,
                "Fertilizer": 100000.0,
                "Pesticide": 500.0,
            }
        ]
    )

    prediction = model.predict(sample_input)[0]

    print("Model loaded successfully.")
    print(f"Predicted Yield: {prediction:.4f}")


if __name__ == "__main__":
    main()
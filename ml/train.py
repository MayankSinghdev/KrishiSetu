import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


DATASET_PATH = "ml/data/raw/dataset/crop_yield.csv"
MODEL_PATH = "ml/models/yield_model.joblib"

CATEGORICAL_FEATURES = [
    "Crop",
    "Season",
    "State",
]

NUMERICAL_FEATURES = [
    "Crop_Year",
    "Area",
    "Annual_Rainfall",
    "Fertilizer",
    "Pesticide",
]

FEATURE_COLUMNS = CATEGORICAL_FEATURES + NUMERICAL_FEATURES
TARGET_COLUMN = "Yield"


def load_and_clean_dataset() -> pd.DataFrame:
    """Load the dataset and clean column/text formatting."""

    df = pd.read_csv(DATASET_PATH)

    df.columns = df.columns.str.strip()

    for column in CATEGORICAL_FEATURES:
        df[column] = df[column].astype(str).str.strip()

    return df


def create_preprocessor() -> ColumnTransformer:
    """Create preprocessing for categorical and numerical features."""

    return ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=True,
                ),
                CATEGORICAL_FEATURES,
            ),
            (
                "numerical",
                "passthrough",
                NUMERICAL_FEATURES,
            ),
        ]
    )


def evaluate_model(
    model_name: str,
    model: Pipeline,
    X_test: pd.DataFrame,
    y_test: pd.Series,
) -> dict:
    """Evaluate a trained model."""

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    r2 = r2_score(y_test, predictions)

    print(f"\n{model_name}")
    print("-" * 40)
    print(f"MAE : {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R²  : {r2:.4f}")

    return {
        "name": model_name,
        "model": model,
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
    }


def main() -> None:
    """Train, evaluate, and save the best model."""

    df = load_and_clean_dataset()

    # Time-based split:
    # Train on earlier years and test on later years.
    train_df = df[df["Crop_Year"] <= 2017].copy()
    test_df = df[df["Crop_Year"] >= 2018].copy()

    print("Dataset information")
    print("=" * 40)
    print(f"Total rows : {len(df)}")
    print(f"Train rows : {len(train_df)}")
    print(f"Test rows  : {len(test_df)}")
    print(f"Train years: {train_df['Crop_Year'].min()} - {train_df['Crop_Year'].max()}")
    print(f"Test years : {test_df['Crop_Year'].min()} - {test_df['Crop_Year'].max()}")

    X_train = train_df[FEATURE_COLUMNS]
    y_train = train_df[TARGET_COLUMN]

    X_test = test_df[FEATURE_COLUMNS]
    y_test = test_df[TARGET_COLUMN]

    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(
            n_estimators=200,
            random_state=42,
            n_jobs=-1,
        ),
    }

    results = []

    for model_name, estimator in models.items():
        pipeline = Pipeline(
            steps=[
                ("preprocessor", create_preprocessor()),
                ("model", estimator),
            ]
        )

        print(f"\nTraining {model_name}...")

        pipeline.fit(X_train, y_train)

        result = evaluate_model(
            model_name,
            pipeline,
            X_test,
            y_test,
        )

        results.append(result)

    # Select the model with the lowest RMSE.
    best_result = min(results, key=lambda result: result["rmse"])

    print("\nBest model")
    print("=" * 40)
    print(f"Model: {best_result['name']}")
    print(f"RMSE: {best_result['rmse']:.4f}")
    print(f"MAE : {best_result['mae']:.4f}")
    print(f"R²  : {best_result['r2']:.4f}")

    joblib.dump(best_result["model"], MODEL_PATH, compress=3)

    print(f"\nSaved model to: {MODEL_PATH}")


if __name__ == "__main__":
    main()
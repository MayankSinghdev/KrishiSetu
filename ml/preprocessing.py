import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder


# Dataset location
DATASET_PATH = "ml/data/raw/dataset/crop_yield.csv"


# Features used by the model
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

TARGET_COLUMN = "Yield"


def load_dataset() -> pd.DataFrame:
    """Load and clean the crop-yield dataset."""

    df = pd.read_csv(DATASET_PATH)

    # Remove unnecessary whitespace from column names.
    df.columns = df.columns.str.strip()

    # Remove unnecessary whitespace from text columns.
    for column in CATEGORICAL_FEATURES:
        df[column] = df[column].astype(str).str.strip()

    return df


def prepare_features_and_target(
    df: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.Series]:
    """Separate model features from the prediction target."""

    feature_columns = CATEGORICAL_FEATURES + NUMERICAL_FEATURES

    X = df[feature_columns].copy()
    y = df[TARGET_COLUMN].copy()

    return X, y


def create_preprocessor() -> ColumnTransformer:
    """Create the preprocessing pipeline for categorical and numerical data."""

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


if __name__ == "__main__":
    dataset = load_dataset()
    features, target = prepare_features_and_target(dataset)

    print("Dataset loaded successfully.")
    print(f"Rows: {len(dataset)}")
    print(f"Feature columns: {features.columns.tolist()}")
    print(f"Target column: {TARGET_COLUMN}")
    print(f"Target values: {len(target)}")

    preprocessor = create_preprocessor()

    transformed_features = preprocessor.fit_transform(features)

    print(f"Transformed feature shape: {transformed_features.shape}")
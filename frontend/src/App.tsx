import { useState } from "react";
import type { FormEvent } from "react";

import {
  predictYield,
  recommendCrops,
  getMarketPrices,
  type PredictionRequest,
  type PredictionResponse,
  type RecommendationRequest,
  type RecommendationResponse,
  type MarketRequest,
  type MarketResponse,
} from "./services/api";
// then your existing constants/components/code...

const governmentSchemes = [
  {
    name: "PM-KISAN",
    shortName: "Income Support",
    description:
      "Provides income support to eligible landholding farmer families through direct benefit transfers.",
    beneficiaries:
      "Eligible landholding farmer families, subject to the scheme guidelines and applicable exclusion criteria.",
    benefit:
      "₹6,000 per year in three equal instalments for eligible beneficiaries.",
    eligibility:
      "Eligibility is determined under the current PM-KISAN guidelines. Farmers should verify their status and applicable exclusions on the official portal.",
    source: "Official PM-KISAN Portal",
    url: "https://pmkisan.gov.in/",
    detailsUrl: "https://pmkisan.gov.in/",
    applyLabel: "New Farmer Registration",
    applyUrl:
      "https://pmkisan.gov.in/RegistrationFormupdated.aspx",
  },

  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    shortName: "Crop Insurance",
    description:
      "Provides crop insurance coverage for eligible farmers against specified crop losses under notified crops, areas and seasons.",
    beneficiaries:
      "Farmers covered under the applicable crop, area, season and insurance conditions.",
    benefit:
      "Financial protection against covered crop losses according to the applicable PMFBY provisions.",
    eligibility:
      "Coverage depends on notified crops, areas, seasons and the current PMFBY guidelines. Farmers should verify the applicable conditions before applying.",
    source: "Official PMFBY Portal",
    url: "https://pmfby.gov.in/",
    detailsUrl: "https://pmfby.gov.in/",
    applyLabel: "Apply for Crop Insurance",
    applyUrl:
      "https://pmfby.gov.in/",
  },

  {
    name: "Soil Health Card",
    shortName: "Soil Management",
    description:
      "Helps farmers understand soil nutrient conditions and use recommendations for better soil and fertilizer management.",
    beneficiaries:
      "Farmers who need soil nutrient information and recommendations for improving soil management.",
    benefit:
      "Provides soil nutrient information and recommendations related to soil and fertilizer management.",
    eligibility:
      "Farmer registration, soil-sample collection and testing are handled through the Soil Health Card programme and its authorised system.",
    source: "Official Soil Health Card Portal",
    url: "https://soilhealth.dac.gov.in/",
    detailsUrl: "https://soilhealth.dac.gov.in/",
    applyLabel: "Visit Soil Health Portal",
    applyUrl:
      "https://soilhealth.dac.gov.in/",
  },
];
const crops = [
  "Rice",
  "Wheat",
  "Maize",
  "Bajra",
  "Cotton",
  "Sugarcane",
  "Soybean",
  "Groundnut",
  "Potato",
  "Tomato",
];

const seasons = [
  "Kharif",
  "Rabi",
  "Summer",
  "Autumn",
  "Whole Year",
  "Winter",
];

const states = [
  "Uttar Pradesh",
  "Punjab",
  "Haryana",
  "Bihar",
  "Madhya Pradesh",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Telangana",
  "West Bengal",
  "Odisha",
  "Gujarat",
  "Rajasthan",
  "Kerala",
];


const defaultForm: PredictionRequest = {
  crop: "Rice",
  season: "Kharif",
  state: "Uttar Pradesh",
  crop_year: 2020,
  area: 1000,
  annual_rainfall: 1000,
  fertilizer: 100000,
  pesticide: 500,
};

function App() {
  const [form, setForm] =
    useState<PredictionRequest>(defaultForm);

  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [selectedScheme, setSelectedScheme] =
  useState<string | null>(null);

  const [recommendationForm, setRecommendationForm] =
  useState<RecommendationRequest>({
    state: "Uttar Pradesh",
    season: "Kharif",
    soil_type: "Alluvial",
    annual_rainfall: 1200,
    temperature: 28,
    irrigation: "Available",
  });

const [recommendations, setRecommendations] =
  useState<RecommendationResponse | null>(null);

const [recommendationLoading, setRecommendationLoading] =
  useState(false);

const [recommendationError, setRecommendationError] =
  useState("");
    const [marketForm, setMarketForm] =
    useState<MarketRequest>({
      state: "Uttar Pradesh",
      commodity: "Rice",
      district: "",
      market: "",
    });

  const [marketData, setMarketData] =
    useState<MarketResponse | null>(null);

  const [marketLoading, setMarketLoading] =
    useState(false);

  const [marketError, setMarketError] =
    useState("");

  const updateField = (
    field: keyof PredictionRequest,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]:
        field === "crop" ||
        field === "season" ||
        field === "state"
          ? value
          : Number(value),
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const result = await predictYield(form);
      setPrediction(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the prediction.",
      );
    } finally {
      setLoading(false);
    }
  };
  const updateRecommendationField = <
  K extends keyof RecommendationRequest,
>(
  field: K,
  value: RecommendationRequest[K],
) => {
  setRecommendationForm((current) => ({
    ...current,
    [field]: value,
  }));
};

const handleRecommendationSubmit = async (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  setRecommendationLoading(true);
  setRecommendationError("");
  setRecommendations(null);

  try {
    const result = await recommendCrops(recommendationForm);
    setRecommendations(result);
  } catch (requestError) {
    setRecommendationError(
      requestError instanceof Error
        ? requestError.message
        : "Unable to generate crop recommendations.",
    );
  } finally {
    setRecommendationLoading(false);
  }
};
  const updateMarketField = (
    field: keyof MarketRequest,
    value: string,
  ) => {
    setMarketForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleMarketSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMarketLoading(true);
    setMarketError("");
    setMarketData(null);

    try {
      const result = await getMarketPrices(marketForm);
      setMarketData(result);
    } catch (requestError) {
      setMarketError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to retrieve market prices.",
      );
    } finally {
      setMarketLoading(false);
    }
  };

 const scrollToPrediction = () => {
  const element = document.getElementById("prediction");

  if (!element) return;

  const yOffset = -90;
  const y =
    element.getBoundingClientRect().top +
    window.pageYOffset +
    yOffset;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};
 const scrollToRecommendation = () => {
  document
    .getElementById("crop-recommendation")
    ?.scrollIntoView({ behavior: "smooth" });
};
const scrollToGovernmentSchemes = () => {
  const element = document.getElementById("government-schemes");

  if (!element) return;

  const yOffset = -90;
  const y =
    element.getBoundingClientRect().top +
    window.pageYOffset +
    yOffset;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};
const toggleSchemeDetails = (schemeName: string) => {
  setSelectedScheme((current) =>
    current === schemeName ? null : schemeName,
  );
};
  const scrollToMarket = () => {
    const element = document.getElementById("market-prices");

    if (!element) return;

    const yOffset = -90;
    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  /*
   * The ML model returns yield per hectare.
   *
   * For the farmer-facing interface:
   * 1 tonne = 10 quintals
   *
   * We keep the model's predicted value unchanged and only
   * convert it into easier-to-understand units for display.
   */
  const predictedYieldTonnes =
    prediction?.predicted_yield ?? 0;

  const predictedYieldQuintals =
    predictedYieldTonnes * 10;

  const estimatedTotalTonnes =
    predictedYieldTonnes * form.area;

  const estimatedTotalQuintals =
    predictedYieldQuintals * form.area;

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav-container">
          <a className="brand" href="#home">
            <div className="brand-mark">
              <span>क</span>
            </div>

            <div>
              <div className="brand-name">KrishiSetu</div>
              <div className="brand-subtitle">
                Smart Agriculture Intelligence
              </div>
            </div>
          </a>

          <nav className="desktop-nav">
  <a href="#home">Home</a>
  <a href="#prediction">Yield Prediction</a>
  <a href="#crop-recommendation">Crop Recommendation</a>
  <a href="#government-schemes">Government Schemes</a>
  <a href="#about">About</a>
</nav>

          <button
            className="nav-cta"
            onClick={scrollToPrediction}
          >
            Predict Yield
            <span>→</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <span className="status-dot" />
                Smart farming information for better agricultural decisions
              </div>

              <h1>
                Make every farming
                <span> decision smarter.</span>
              </h1>

              <p className="hero-description">
                KrishiSetu helps farmers understand crop potential,
                estimate yield, and make data-informed decisions
                using agricultural data and machine learning.
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  onClick={scrollToPrediction}
                >
                  Start Yield Prediction
                  <span>→</span>
                </button>

                <a
                  className="secondary-button"
                  href="#features"
                >
                  Explore KrishiSetu
                </a>
              </div>

              <div className="trust-row">
                <div className="trust-item">
                  <strong>55+</strong>
                  <span>Crop types</span>
                </div>

                <div className="trust-divider" />

                <div className="trust-item">
                  <strong>30</strong>
                  <span>Indian states</span>
                </div>

                <div className="trust-divider" />

                <div className="trust-item">
                  <strong>19K+</strong>
                  <span>Data records</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="dashboard-card">
                <div className="dashboard-top">
                  <div>
                    <span className="small-label">
                      FARM INTELLIGENCE
                    </span>
                    <h3>Yield outlook</h3>
                  </div>

                  <div className="live-pill">
                    <span />
                    ML Ready
                  </div>
                </div>

                <div className="chart-area">
                  <div className="chart-grid">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <svg
                    className="yield-chart"
                    viewBox="0 0 500 220"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="areaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#2f9e62"
                          stopOpacity="0.24"
                        />
                        <stop
                          offset="100%"
                          stopColor="#2f9e62"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="M0 180 C55 165 65 140 110 150 C155 160 165 120 215 130 C260 140 275 82 320 100 C365 118 380 65 425 78 C455 86 475 48 500 42 L500 220 L0 220 Z"
                      fill="url(#areaGradient)"
                    />

                    <path
                      d="M0 180 C55 165 65 140 110 150 C155 160 165 120 215 130 C260 140 275 82 320 100 C365 118 380 65 425 78 C455 86 475 48 500 42"
                      fill="none"
                      stroke="#2f9e62"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="dashboard-metrics">
                  <div>
                    <span>Crop</span>
                    <strong>Rice</strong>
                  </div>

                  <div>
                    <span>Season</span>
                    <strong>Kharif</strong>
                  </div>

                  <div>
                    <span>Region</span>
                    <strong>U.P.</strong>
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-icon">✦</div>
                  <div>
                    <strong>Data-driven insight</strong>
                    <p>
                      Combine crop, rainfall, soil inputs and
                      regional data for an informed estimate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="floating-card floating-card-one">
                <span className="floating-icon">🌱</span>
                <div>
                  <strong>Smarter farming</strong>
                  <span>Powered by data</span>
                </div>
              </div>

              <div className="floating-card floating-card-two">
                <span className="floating-number">AI</span>
                <div>
                  <strong>ML Prediction</strong>
                  <span>Real model inference</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="prediction-section" id="prediction">
          <div className="container">
            <div className="section-heading centered">
              <div className="section-kicker">
                YIELD INTELLIGENCE
              </div>

              <h2>
                Estimate your crop yield
                <span> with KrishiSetu</span>
              </h2>

              <p>
                Enter the agricultural details below. Our trained
                machine-learning model will generate an estimated
                yield based on patterns in the dataset.
              </p>
            </div>

            <div className="prediction-layout">
              <form
                className="prediction-card"
                onSubmit={handleSubmit}
              >
                <div className="form-header">
                  <div>
                    <span className="small-label">
                      PREDICTION INPUT
                    </span>
                    <h3>Tell us about your farm</h3>
                  </div>

                  <div className="step-badge">
                    01 / 01
                  </div>
                </div>

                <div className="form-grid">
                  <label className="field">
                    <span>Crop</span>
                    <select
                      value={form.crop}
                      onChange={(event) =>
                        updateField(
                          "crop",
                          event.target.value,
                        )
                      }
                    >
                      {crops.map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field">
                    <span>Season</span>
                    <select
                      value={form.season}
                      onChange={(event) =>
                        updateField(
                          "season",
                          event.target.value,
                        )
                      }
                    >
                      {seasons.map((season) => (
                        <option key={season} value={season}>
                          {season}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field field-wide">
                    <span>State / Region</span>
                    <select
                      value={form.state}
                      onChange={(event) =>
                        updateField(
                          "state",
                          event.target.value,
                        )
                      }
                    >
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field">
                    <span>Crop year</span>
                    <input
                      type="number"
                      min="1997"
                      max="2100"
                      value={form.crop_year}
                      onChange={(event) =>
                        updateField(
                          "crop_year",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Farm area</span>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={form.area}
                        onChange={(event) =>
                          updateField(
                            "area",
                            event.target.value,
                          )
                        }
                      />
                      <span>ha</span>
                    </div>
                  </label>

                  <label className="field">
                    <span>Annual rainfall</span>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={form.annual_rainfall}
                        onChange={(event) =>
                          updateField(
                            "annual_rainfall",
                            event.target.value,
                          )
                        }
                      />
                      <span>mm</span>
                    </div>
                  </label>

                  <label className="field">
                    <span>Fertilizer used</span>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={form.fertilizer}
                        onChange={(event) =>
                          updateField(
                            "fertilizer",
                            event.target.value,
                          )
                        }
                      />
                      <span>kg</span>
                    </div>
                  </label>

                  <label className="field">
                    <span>Pesticide used</span>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={form.pesticide}
                        onChange={(event) =>
                          updateField(
                            "pesticide",
                            event.target.value,
                          )
                        }
                      />
                      <span>kg</span>
                    </div>
                  </label>
                </div>

                {error && (
                  <div className="error-box">
                    <strong>Prediction unavailable</strong>
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-footer">
                  <div className="privacy-note">
                    <span>✓</span>
                    Your inputs are used only for this prediction.
                  </div>

                  <button
                    className="predict-button"
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? "Analyzing..."
                      : "Generate Prediction"}
                    {!loading && <span>→</span>}
                  </button>
                </div>
              </form>

              <aside className="result-panel">
                {!prediction && !loading && (
                  <div className="empty-result">
                    <div className="result-orbit">
                      <div className="result-icon">✦</div>
                    </div>

                    <span className="small-label">
                      YOUR RESULT
                    </span>

                    <h3>
                      Your estimated yield
                      <br />
                      will appear here
                    </h3>

                    <p>
                      Complete the farm details and generate a
                      prediction to see the model's estimate.
                    </p>

                    <div className="result-points">
                      <div>
                        <span>01</span>
                        Crop & season
                      </div>

                      <div>
                        <span>02</span>
                        Regional conditions
                      </div>

                      <div>
                        <span>03</span>
                        Farm inputs
                      </div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="loading-result">
                    <div className="loader" />
                    <span>ANALYZING FARM DATA</span>

                    <h3>
                      KrishiSetu is calculating
                      <br />
                      your estimate...
                    </h3>

                    <p>
                      Processing your inputs through the trained
                      crop-yield model.
                    </p>
                  </div>
                )}

                {prediction && !loading && (
                  <div className="prediction-result">
                    <div className="result-header">
                      <div>
                        <span className="small-label">
                          PREDICTION COMPLETE
                        </span>
                        <h3>Estimated crop yield</h3>
                      </div>

                      <div className="success-icon">✓</div>
                    </div>

                    <div className="result-value">
                      <strong>
                        {predictedYieldTonnes.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          },
                        )}
                      </strong>

                      <span>tonnes / hectare</span>

                      <div className="result-secondary-unit">
                        ≈{" "}
                        {predictedYieldQuintals.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 1,
                          },
                        )}{" "}
                        quintals / hectare
                      </div>
                    </div>

                    <div className="result-explanation">
                      <div className="explanation-icon">🌾</div>

                      <div>
                        <strong>
                          What does this mean?
                        </strong>

                        <p>
                          KrishiSetu estimates that your farm may
                          produce around{" "}
                          <strong>
                            {predictedYieldQuintals.toLocaleString(
                              "en-IN",
                              {
                                maximumFractionDigits: 1,
                              },
                            )}{" "}
                            quintals
                          </strong>{" "}
                          of {form.crop} per hectare under the
                          conditions you entered.
                        </p>
                      </div>
                    </div>

                    <div className="total-output-card">
                      <div>
                        <span>
                          ESTIMATED TOTAL PRODUCTION
                        </span>

                        <strong>
                          {estimatedTotalTonnes.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            },
                          )}{" "}
                          tonnes
                        </strong>

                        <small>
                          ≈{" "}
                          {estimatedTotalQuintals.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 1,
                            },
                          )}{" "}
                          quintals
                        </small>
                      </div>

                      <div className="area-badge">
                        <strong>
                          {form.area.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </strong>

                        <span>hectares</span>
                      </div>
                    </div>

                    <div className="result-summary">
                      <div>
                        <span>Crop</span>
                        <strong>{form.crop}</strong>
                      </div>

                      <div>
                        <span>Season</span>
                        <strong>{form.season}</strong>
                      </div>

                      <div>
                        <span>Region</span>
                        <strong>{form.state}</strong>
                      </div>
                    </div>

                    <div className="result-message">
                      <div>✦</div>

                      <p>
                        {prediction.message}
                      </p>
                    </div>

                    <div className="estimate-note">
                      <strong>Important:</strong> This is an
                      AI/ML-based estimate, not a guaranteed
                      production value. Actual harvest can vary
                      due to weather, soil conditions, pests,
                      irrigation and farming practices.
                    </div>

                    <button
                      className="outline-button"
                      onClick={() =>
                        setPrediction(null)
                      }
                      type="button"
                    >
                      Run another prediction
                    </button>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
        <section
  id="crop-recommendation"
  className="prediction-section recommendation-section"
>
  <div className="section-heading">
    <span className="section-kicker">
      Smart Crop Planning
    </span>

    <h2>Crop Recommendation</h2>

    <p>
      Tell us about your farm conditions and KrishiSetu will
      suggest suitable crops using transparent agricultural
      suitability rules.
    </p>
  </div>

  <div className="prediction-layout">
    <form
      className="prediction-form"
      onSubmit={handleRecommendationSubmit}
    >
      <div className="form-card">
        <div className="form-card-header">
          <h3>Tell us about your farm</h3>

          <p>
            Provide basic information about your location,
            soil and growing conditions.
          </p>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>State / Region</span>

            <select
              value={recommendationForm.state}
              onChange={(event) =>
                updateRecommendationField(
                  "state",
                  event.target.value,
                )
              }
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Season</span>

            <select
              value={recommendationForm.season}
              onChange={(event) =>
                updateRecommendationField(
                  "season",
                  event.target.value,
                )
              }
            >
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Soil Type</span>

            <select
              value={recommendationForm.soil_type}
              onChange={(event) =>
                updateRecommendationField(
                  "soil_type",
                  event.target.value,
                )
              }
            >
              <option value="Alluvial">Alluvial</option>
              <option value="Loamy">Loamy</option>
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
              <option value="Black">Black</option>
            </select>
          </label>

          <label className="form-field">
            <span>Irrigation Availability</span>

            <select
              value={recommendationForm.irrigation}
              onChange={(event) =>
                updateRecommendationField(
                  "irrigation",
                  event.target.value,
                )
              }
            >
              <option value="Available">
                Available
              </option>

              <option value="Good">Good</option>

              <option value="Limited">
                Limited
              </option>
            </select>
          </label>

          <label className="form-field">
            <span>Annual Rainfall (mm)</span>

            <input
              type="number"
              min="0"
              step="0.1"
              value={recommendationForm.annual_rainfall}
              onChange={(event) =>
                updateRecommendationField(
                  "annual_rainfall",
                  Number(event.target.value),
                )
              }
              required
            />
          </label>

          <label className="form-field">
            <span>Average Temperature (°C)</span>

            <input
              type="number"
              step="0.1"
              value={recommendationForm.temperature}
              onChange={(event) =>
                updateRecommendationField(
                  "temperature",
                  Number(event.target.value),
                )
              }
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="primary-button"
          disabled={recommendationLoading}
        >
          {recommendationLoading
            ? "Analyzing Farm Conditions..."
            : "Get Crop Recommendations"}
        </button>

        {recommendationError && (
          <div className="error-message">
            {recommendationError}
          </div>
        )}
      </div>
    </form>

    <div className="prediction-result">
      {!recommendations && !recommendationLoading && (
        <div className="empty-result">
          <span className="result-icon">🌱</span>

          <h3>Your crop recommendations will appear here</h3>

          <p>
            Enter your farm conditions and click
            <strong> Get Crop Recommendations</strong>.
          </p>
        </div>
      )}

      {recommendationLoading && (
        <div className="empty-result">
          <span className="result-icon">🌾</span>

          <h3>Analyzing your farm conditions...</h3>

          <p>
            KrishiSetu is comparing your conditions with
            configured crop suitability rules.
          </p>
        </div>
      )}

      {recommendations && (
        <div className="recommendation-results">
          <div className="result-header">
            <div>
              <span className="result-label">
                RECOMMENDED CROPS
              </span>

              <h3>Suitable crops for your conditions</h3>
            </div>
          </div>

          <div className="recommendation-list">
            {recommendations.recommendations.map(
              (item, index) => (
                <article
                  className="recommendation-card"
                  key={item.crop}
                >
                  <div className="recommendation-rank">
                    {index + 1}
                  </div>

                  <div className="recommendation-content">
                    <div className="recommendation-title-row">
                      <h4>{item.crop}</h4>

                      <span className="suitability-score">
                        {item.suitability_score}/100
                      </span>
                    </div>

                    <div className="score-bar">
                      <div
                        className="score-bar-fill"
                        style={{
                          width: `${item.suitability_score}%`,
                        }}
                      />
                    </div>

                    <div className="recommendation-reasons">
                      {item.reasons.map((reason) => (
                        <p key={reason}>
                          <span>✓</span>
                          {reason}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>

          <div className="recommendation-message">
            {recommendations.message}
          </div>

          <p className="estimate-note">
            These recommendations are generated using
            transparent project-level suitability rules.
            They are intended for planning support and
            should not replace local agricultural advice.
          </p>
        </div>
      )}
    </div>
  </div>
</section>
        <section
          id="market-prices"
          className="prediction-section recommendation-section"
        >
          <div className="section-heading">
            <span className="section-kicker">
              AGRICULTURAL MARKET INTELLIGENCE
            </span>

            <h2>Market Prices</h2>

            <p>
              Explore the latest available mandi price records
              for selected crops and markets.
            </p>
          </div>

          <div className="prediction-layout">
            <form
              className="prediction-form"
              onSubmit={handleMarketSubmit}
            >
              <div className="form-card">
                <div className="form-card-header">
                  <h3>Find mandi prices</h3>

                  <p>
                    Select a state and commodity to retrieve
                    available market price records.
                  </p>
                </div>

                <div className="form-grid">
                  <label className="form-field">
                    <span>State / Region</span>

                    <select
                      value={marketForm.state}
                      onChange={(event) =>
                        updateMarketField(
                          "state",
                          event.target.value,
                        )
                      }
                    >
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-field">
                    <span>Commodity</span>

                    <select
                      value={marketForm.commodity}
                      onChange={(event) =>
                        updateMarketField(
                          "commodity",
                          event.target.value,
                        )
                      }
                    >
                      {crops.map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-field">
                    <span>District (optional)</span>

                    <input
                      type="text"
                      value={marketForm.district ?? ""}
                      placeholder="e.g. Gorakhpur"
                      onChange={(event) =>
                        updateMarketField(
                          "district",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label className="form-field">
                    <span>Market (optional)</span>

                    <input
                      type="text"
                      value={marketForm.market ?? ""}
                      placeholder="e.g. APMC"
                      onChange={(event) =>
                        updateMarketField(
                          "market",
                          event.target.value,
                        )
                      }
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={marketLoading}
                >
                  {marketLoading
                    ? "Fetching Market Prices..."
                    : "Get Market Prices"}
                </button>

                {marketError && (
                  <div className="error-message">
                    {marketError}
                  </div>
                )}
              </div>
            </form>

            <div className="prediction-result">
              {!marketData && !marketLoading && (
                <div className="empty-result">
                  <span className="result-icon">₹</span>

                  <h3>
                    Mandi prices will appear here
                  </h3>

                  <p>
                    Select a state and commodity to retrieve
                    the latest available market records.
                  </p>
                </div>
              )}

              {marketLoading && (
                <div className="empty-result">
                  <span className="result-icon">₹</span>

                  <h3>
                    Fetching market information...
                  </h3>

                  <p>
                    KrishiSetu is retrieving available mandi
                    price records from the Government OGD API.
                  </p>
                </div>
              )}

              {marketData && !marketLoading && (
                <div className="recommendation-results">
                  <div className="result-header">
                    <div>
                      <span className="result-label">
                        MARKET PRICES
                      </span>

                      <h3>
                        Latest available mandi records
                      </h3>
                    </div>
                  </div>

                  {marketData.records.length === 0 ? (
                    <div className="empty-result">
                      <span className="result-icon">₹</span>

                      <h3>
                        No matching market records found
                      </h3>

                      <p>
                        Try another state, commodity,
                        district or market.
                      </p>
                    </div>
                  ) : (
                    <div className="market-results-list">
                      {marketData.records.map((record, index) => (
                        <article
                          className="market-card"
                          key={`${record.state}-${record.district}-${record.market}-${record.commodity}-${record.variety}-${index}`}
                        >
                          <div className="market-card-header">
                            <div>
                              <h4>{record.market}</h4>

                              <span>
                                {record.district},{" "}
                                {record.state}
                              </span>
                            </div>

                            <span className="market-date">
                              {record.arrival_date}
                            </span>
                          </div>

                          <div className="market-commodity">
                            <strong>
                              {record.commodity}
                            </strong>

                            <span>
                              {record.variety}
                              {record.grade
                                ? ` • ${record.grade}`
                                : ""}
                            </span>
                          </div>

                          <div className="market-price-grid">
                            <div>
                              <span>Minimum</span>
                              <strong>
                                ₹
                                {record.min_price.toLocaleString(
                                  "en-IN",
                                  {
                                    maximumFractionDigits: 2,
                                  },
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>Maximum</span>
                              <strong>
                                ₹
                                {record.max_price.toLocaleString(
                                  "en-IN",
                                  {
                                    maximumFractionDigits: 2,
                                  },
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>Modal</span>
                              <strong>
                                ₹
                                {record.modal_price.toLocaleString(
                                  "en-IN",
                                  {
                                    maximumFractionDigits: 2,
                                  },
                                )}
                              </strong>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  <div className="recommendation-message">
                    {marketData.message}
                  </div>

                  <p className="estimate-note">
                    Prices shown are the latest available
                    records returned by the Government Open
                    Government Data (OGD) source. Arrival dates
                    are shown for each market record. Availability
                    and reported prices may change over time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section
  id="government-schemes"
  className="prediction-section recommendation-section"
>
  <div className="section-heading">
    <span className="section-kicker">
      GOVERNMENT AGRICULTURE SUPPORT
    </span>

    <h2>Government Schemes</h2>

    <p>
      Explore selected agriculture-related government
      schemes and visit their official sources for current
      eligibility and application information.
    </p>
  </div>

  <div className="scheme-grid">
    {governmentSchemes.map((scheme) => (
     <article className="scheme-card" key={scheme.name}>
  <div className="scheme-card-header">
    <span className="scheme-label">
      {scheme.shortName}
    </span>

    <span className="scheme-icon">⌂</span>
  </div>

  <h3>{scheme.name}</h3>

  <p className="scheme-description">
    {scheme.description}
  </p>

  <div className="scheme-detail">
    <span>Who it is for</span>
    <p>{scheme.beneficiaries}</p>
  </div>

  <div className="scheme-detail">
    <span>Main benefit</span>
    <p>{scheme.benefit}</p>
  </div>

  <div className="scheme-detail">
    <span>Eligibility</span>
    <p>{scheme.eligibility}</p>
  </div>

  <div className="scheme-actions">
    <button
  type="button"
  className="scheme-details-button"
  onClick={() => toggleSchemeDetails(scheme.name)}
>
  {selectedScheme === scheme.name
    ? "Hide Details"
    : "More Details"}

  <span>
    {selectedScheme === scheme.name ? "↑" : "↓"}
  </span>
</button>
    <a
      className="scheme-apply-button"
      href={scheme.applyUrl}
      target="_blank"
      rel="noreferrer"
    >
      {scheme.applyLabel}
      <span>→</span>
    </a>
  </div>

{selectedScheme === scheme.name && (
  <div className="scheme-expanded-details">
    <div>
      <span>About this scheme</span>
      <p>{scheme.description}</p>
    </div>

    <div>
      <span>Who can benefit</span>
      <p>{scheme.beneficiaries}</p>
    </div>

    <div>
      <span>Benefits</span>
      <p>{scheme.benefit}</p>
    </div>

    <div>
      <span>Eligibility</span>
      <p>{scheme.eligibility}</p>
    </div>

    <div className="scheme-expanded-source">
      <span>Official information</span>

      <a
        href={scheme.url}
        target="_blank"
        rel="noreferrer"
      >
        Visit {scheme.source}
        <span>↗</span>
      </a>
    </div>
  </div>
)}

  <div className="scheme-source">
    <span>Official Source</span>

    <a
      href={scheme.url}
      target="_blank"
      rel="noreferrer"
    >
      {scheme.source}
      <span>↗</span>
    </a>
  </div>
</article>
    ))}
  </div>

 <div className="scheme-application-notice">
  <strong>Before you apply</strong>

  <p>
    KrishiSetu provides scheme information and connects
    farmers to official government portals. Government
    applications are completed on the respective official
    website. Always verify current eligibility,
    documents, deadlines and application requirements
    before submitting an application.
  </p>
</div>
</section>

        <section className="features-section" id="features">
          <div className="container">
            <div className="section-heading">
              <div className="section-kicker">
                BUILT FOR FARMING DECISIONS
              </div>

              <h2>
                One platform for
                <span> smarter agriculture.</span>
              </h2>

              <p>
                KrishiSetu is designed to bring useful agricultural
                information into one simple experience for farmers
                and agriculture learners.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card feature-card-primary">
                <div className="feature-number">01</div>
                <div className="feature-icon">◒</div>
                <h3>Crop Yield Prediction</h3>

                <p>
                  Estimate potential crop yield using a trained
                  machine-learning model and agricultural inputs.
                </p>

                <button onClick={scrollToPrediction}>
                  Try prediction <span>→</span>
                </button>
              </article>

              <article className="feature-card">
  <div className="feature-number">02</div>
  <div className="feature-icon">✦</div>

  <h3>Crop Recommendation</h3>

  <p>
    Understand suitable crop choices using practical
    factors such as region, season and agricultural
    conditions.
  </p>

  <button
  className="recommendation-feature-button"
  onClick={scrollToRecommendation}
>
  Explore recommendations <span>→</span>
</button>
</article>
<article className="feature-card">
  <div className="feature-number">03</div>
  <div className="feature-icon">₹</div>

  <h3>Market Information</h3>

  <p>
    Explore the latest available mandi prices from the
    Government Open Government Data platform.
  </p>

  <button
    className="recommendation-feature-button"
    onClick={scrollToMarket}
  >
    Explore market prices <span>→</span>
  </button>
</article>
<article className="feature-card">
  <div className="feature-number">04</div>

  <div className="feature-icon">⌂</div>

  <h3>Government Schemes</h3>

  <p>
    Explore useful agriculture schemes with benefits,
    eligibility information and official government sources.
  </p>

  <button
    className="recommendation-feature-button"
    onClick={scrollToGovernmentSchemes}
  >
    Explore schemes <span>→</span>
  </button>
</article>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="container about-grid">
            <div>
              <div className="section-kicker">
                ABOUT KRISHISETU
              </div>

              <h2>
                Technology that speaks
                <span> the farmer's language.</span>
              </h2>
            </div>

            <div className="about-copy">
              <p>
               KrishiSetu is a smart agriculture platform designed
               to bring useful farming information into one simple
               experience.
              </p>

              <p>
                The platform provides crop-yield prediction,
                crop recommendations, available market prices and
                information about selected government agriculture
                schemes.
              </p>

              <div className="technology-row">
                <span>React</span>
                <span>FastAPI</span>
                <span>Python</span>
                <span>Scikit-learn</span>
                
              </div>
            </div>
          </div>
        </section>
      </main>

      
<footer className="site-footer">
  <div className="container footer-content">
    <div className="footer-main">
      <div className="brand footer-brand">
        <div className="brand-mark">
          <span>क</span>
        </div>

        <div>
          <div className="brand-name">KrishiSetu</div>
          <div className="brand-subtitle">
            Smart Agriculture Platform
          </div>
        </div>
      </div>

      <p className="footer-description">
        A simple platform for crop-yield prediction,
        crop recommendations, market information and
        government agriculture schemes.
      </p>
    </div>

    <div className="footer-links">
      <div className="footer-column">
        <span className="footer-heading">
          Quick Links
        </span>

        <button
          type="button"
          onClick={scrollToPrediction}
        >
          Yield Prediction
        </button>

        <button
          type="button"
          onClick={scrollToRecommendation}
        >
          Crop Recommendation
        </button>

        <button
          type="button"
          onClick={scrollToMarket}
        >
          Market Prices
        </button>

        <button
          type="button"
          onClick={scrollToGovernmentSchemes}
        >
          Government Schemes
        </button>

        <a href="#about">
          About
        </a>
      </div>
    </div>
  </div>

  <div className="container footer-bottom">
    <p>
      Predictions are estimates and should not be
      treated as guaranteed results.
    </p>

    <span className="footer-copy">
      © 2026 KrishiSetu. All rights reserved.
    </span>
  </div>
</footer>


    </div>
  );
}

export default App;


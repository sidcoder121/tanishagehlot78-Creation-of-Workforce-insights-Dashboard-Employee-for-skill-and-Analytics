# Talent Intelligence & Workforce Analytics Platform

An end-to-end predictive workforce analytics system. The platform combines machine learning classification, automated talent scanning, and a RAG (Retrieval-Augmented Generation) query system to help HR managers identify at-risk staff, diagnose workforce health, and lookup company policies.

---

## System Architecture & Directory Layout

```text
New folder/
├── data/
│   └── encoded_data.xlsx    # Enriched dataset containing engineered metrics and dummy columns
├── docs/
│   └── hr_policies.txt      # Knowledge base for RAG containing training, work-life, and promotion policies
├── models/
│   ├── lr_model.joblib      # Saved Logistic Regression classification model
│   ├── rf_model.joblib      # Saved Random Forest baseline model
│   ├── xgb_model.joblib     # Saved XGBoost baseline model
│   ├── scaler.joblib        # StandardScaler instance for feature standardization
│   ├── feature_names.joblib # Serialized ordered list of training features
│   └── validation_metrics.json # Calculated test-set evaluation scores
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI web backend containing predictive and search endpoints
│   ├── rag.py               # RAG indexing, search vectorizer, and QA fallback engine
│   └── agent.py             # Talent scanning scanner that runs weekly assessments
├── scripts/
│   └── run_agent.py         # Entry point script to trigger weekly report generation
├── tests/
│   └── test_api.py          # Integration tests for FastAPI endpoints
├── .env                     # Configuration file housing the OpenAI API key
└── README.md                # System documentation manual
```

---

# Machine Learning & Data Pipeline

## Step 1: Data Prep & Feature Encoding

The 1,470-row HR dataset is prepared and transformed before being used for machine learning classification.

### Binary Mapping

The following categorical values are converted into numerical values:

* `Attrition`: `Yes` to `1`, `No` to `0`
* `OverTime`: `Yes` to `1`, `No` to `0`
* `Gender`: `Male` to `1`, `Female` to `0`

### One-Hot Encoding

The following variables are converted into multiple binary features:

* `Department`
* `JobRole`
* `MaritalStatus`
* `BusinessTravel`
* `EducationField`
* Dynamic age categories
* Dynamic tenure categories

This process creates a total of **57 binary features**.

### Feature Scaling

The features are standardized using `StandardScaler`.

This brings all values to:

* Mean: `μ = 0`
* Standard deviation: `σ = 1`

This is important for models such as Logistic Regression.

---

## Step 2: Model Evaluation

The models are trained using a stratified 80/20 train-test split.

The test dataset contains **294 employees**.

| Metric           | Logistic Regression | Random Forest | XGBoost |
| :--------------- | :-----------------: | :-----------: | :-----: |
| Accuracy         |        76.87%       |     83.67%    |  82.65% |
| Precision        |        37.65%       |     42.86%    |  44.74% |
| Recall (Class 1) |        68.09%       |     6.38%     |  36.17% |
| F1-Score         |        48.48%       |     11.11%    |  40.00% |
| ROC-AUC          |        80.58%       |     77.53%    |  76.07% |

### Logistic Regression

Logistic Regression is selected as the active model because of its high:

* Recall: `68.09%`
* ROC-AUC: `80.58%`

For employee attrition prediction, identifying employees who may leave is more important than avoiding every false positive. Therefore, recall is considered an important metric for this use case.

### Confusion Matrices

**Logistic Regression**

* True Negatives: `194`
* True Positives: `32`
* False Positives: `53`
* False Negatives: `15`

**Random Forest**

* True Negatives: `243`
* True Positives: `3`
* False Positives: `4`
* False Negatives: `44`

**XGBoost**

* True Negatives: `226`
* True Positives: `17`
* False Positives: `21`
* False Negatives: `30`

---

# Diagnostic Health & Skill-Gap Scoring

Three business metrics are calculated and stored in `encoded_data.xlsx`.

## Skill Gap Flag

`Skill_Gap_Flag = 1` is assigned to employees who meet the following conditions:

```text
TrainingTimesLastYear <= 1
PerformanceRating <= 3
```

This represents **7.2% of the workforce**.

---

## Promotion Ready Flag

`Promotion = 1` is assigned to employees who meet the following conditions:

```text
YearsSinceLastPromotion >= 3
PerformanceRating >= 3
JobLevel < 5
```

This represents **23.1% of the workforce**.

---

## Workforce Health Score

The Workforce Health Score is calculated using the following weighted formula:

```text
Health Score Raw =
0.30 × JobSatisfaction
+ 0.20 × TrainingTimesLastYearnorm
+ 0.25 × PerformanceRating
+ 0.25 × WorkLifeBalance
```

The normalized training value is calculated as:

```text
TrainingTimesLastYearnorm =
1.0 + (TrainingTimesLastYear / 6.0) × 3.0
```

The final health score is normalized to a scale from 0 to 100:

```text
Health Score =
((Health Score Raw - 1.0) / 3.0) × 100
```

### Health Score Categories

* `>= 75`: Healthy
* `50–74`: Moderate
* `< 50`: At-Risk

---

# API Endpoint Documentation

The web backend is built using FastAPI and hosted through Uvicorn.

---

## 1. POST /predict-attrition

This endpoint accepts employee profiles, standardizes the input data, and runs the Logistic Regression model.

It returns:

* Attrition prediction
* Attrition probability
* XGBoost reference probability
* Risk score category
* Top risk drivers
* Top retention drivers

### Mathematical Explanation

The contribution of each scaled feature is calculated as:

```text
Ci = wi × Xscaled,i
```

Where:

* `wi` is the Logistic Regression coefficient for feature `i`
* `Xscaled,i` is the scaled value of that feature

Features with high positive contributions increase attrition risk, while negative contributions reduce attrition risk.

### Request Example

```json
[
  {
    "Age": 30.0,
    "Department": "Sales",
    "JobRole": "Sales Representative",
    "MonthlyIncome": 2500.0,
    "OverTime": "Yes",
    "JobSatisfaction": 2,
    "TotalWorkingYears": 5.0
  }
]
```

### Response Example

```json
{
  "predictions": [
    {
      "employee_index": 0,
      "attrition_prediction": 0,
      "attrition_probability": 0.3573,
      "xgb_probability_ref": 0.4124,
      "risk_score_category": "Medium Risk",
      "top_risk_drivers": [
        {
          "feature": "OverTime",
          "contribution": 1.2592
        },
        {
          "feature": "TotalWorkingYears",
          "contribution": 0.7017
        }
      ],
      "top_retention_drivers": [
        {
          "feature": "EducationField_Life Sciences",
          "contribution": -0.6479
        }
      ]
    }
  ]
}
```

---

## 2. POST /health-score

This endpoint calculates the workforce health score and returns its category.

### Request Example

```json
{
  "JobSatisfaction": 3,
  "TrainingTimesLastYear": 2,
  "PerformanceRating": 4,
  "WorkLifeBalance": 2
}
```

### Response Example

```json
{
  "health_score_raw": 2.8,
  "health_score": 60.0,
  "category": "Moderate"
}
```

---

## 3. POST /query

This endpoint uses the RAG system to answer questions related to company HR policies.

### Request Example

```json
{
  "query": "What are the rules regarding hybrid and remote work?"
}
```

### Response Example

```json
{
  "query": "What are the rules regarding hybrid and remote work?",
  "answer": "According to the Work-Life Balance Guidelines:\n- Remote work: Full-time employees are eligible for hybrid work, allowing up to 2 days of remote work per week, subject to team performance and manager approval.",
  "source": "Local Fallback Generator (No API Key)"
}
```

---

# RAG Vector Search & Fallback Engine

The system uses a Retrieval-Augmented Generation pipeline to search and retrieve information from company HR policies.

## Step 1: Parsing & Chunking

The `hr_policies.txt` handbook is divided into different sections based on topics such as:

* Training
* Work-Life
* Promotions
* Retention

---

## Step 2: Indexing

The system uses a `TF-IDF Vectorizer` from `scikit-learn`.

The policy sections are converted into sparse vectors that can be compared with user queries.

---

## Step 3: Retrieval

The system calculates Cosine Similarity between:

* The user query
* The stored policy vectors

The top 2 most relevant policy sections are retrieved.

---

## Step 4: Generative Fallback Design

If `OPENAI_API_KEY` is available:

1. The system collects the relevant policy context.
2. The context is sent to a GPT completions model.
3. A natural language answer is generated.

If the API key is missing or an API call fails, such as an Error 429 due to exhausted balance:

1. The system uses the local rule-based query parser.
2. Relevant policy text is extracted.
3. The application continues to provide answers without depending completely on the API.

---

# Agentic Weekly Automation

The weekly scanner is executed through:

```bash
python scripts/run_agent.py
```

The scanner performs the following steps:

### Step 1: Load Employee Data

The system loads the preprocessed Excel dataset.

### Step 2: Run Predictions

The required features are scaled and predictions are generated for all employees.

### Step 3: Identify High-Risk Employees

Employees with an attrition probability of `50%` or higher are identified as high-risk employees.

### Step 4: Collect Workforce Insights

The system collects:

* Active skill-gap employees
* Promotion-ready employees
* High-risk employees

### Step 5: Generate Weekly Report

A detailed summary report is generated and saved as:

```text
reports/weekly_report_latest.md
```

---

# Setup & Execution Guide

Follow the steps below to install and run the complete system.

## Step 1: Install Python

Ensure that Python version `3.10` or higher is installed.

Check the version using:

```bash
python --version
```

---

## Step 2: Open the Project Folder

Open Command Prompt or PowerShell and navigate to your project directory:

```powershell
cd "c:\Users\anil5\Desktop\New folder"
```

---

## Step 3: Install Required Dependencies

Run the following command:

```bash
pip install pandas openpyxl scikit-learn xgboost joblib fastapi uvicorn httpx python-dotenv
```

Wait for all dependencies to install successfully.

---

## Step 4: Run the Weekly Agent Scanner

Use the following command:

```bash
python scripts/run_agent.py
```https://github.com/aishwaryauggi-collab/Creation-of-Workforce-Insights-Dashboard-for-Employee-Skill-and-Analytics/blob/main/ml/README.md

This scans employee data, predicts attrition risk, identifies skill gaps and promotion candidates, and generates the latest workforce report.

---

## Step 5: Start the FastAPI Server

Run:

```bash
uvicorn app.main:app --reload
```

After the server starts, open:

```text
http://127.0.0.1:8000/docs
```

This opens the FastAPI interactive documentation where all API endpoints can be tested.

---

## Step 6: Run Integration Tests

Run:

```bash
python tests/test_api.py
```

This validates the main API endpoints and checks whether the system components are working correctly.

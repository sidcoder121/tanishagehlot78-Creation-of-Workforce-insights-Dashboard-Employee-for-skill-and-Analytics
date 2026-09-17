<div align="center">

# Creation of Workforce Insights Dashboard for Employee Skill and Analytics

Predict Employee Skills • Analyze Workforce Trends • Empower HR Decisions with Data Analytics

</div>

---

## Project Objective

Develop a Workforce Insights Dashboard to analyze employee skills, workforce performance, and HR metrics through interactive visualizations, enabling organizations to make informed, data-driven decisions.

---

# Milestone 1: Database Setup Instructions

To ensure the entire team is working with the same database architecture, please follow these steps to set up the `WorkforceAnalyticsDB` locally.

## Prerequisites

Before starting, make sure you have the following installed and available:

* MySQL Server
* MySQL Workbench
* `HR_Analytics_Cleaned.csv` dataset downloaded to your machine

---

## Step-by-Step Setup

### Step 1: Create the Schema

Open the `Milestone1_schema_query.sql` file in MySQL Workbench.

Execute the complete SQL script to create the `WorkforceAnalyticsDB` database and all required tables.

---

### Step 2: Import the Dataset

After creating the database:

1. Refresh the Schemas section in MySQL Workbench.
2. Locate the `hr_employee_data` table.
3. Right-click on the table.
4. Select **Table Data Import Wizard**.
5. Choose the `HR_Analytics_Cleaned.csv` file from your system.
6. Complete the import process.

---

### Step 3: Validate the Database

Open and execute:

```text
Milestone2_validation_query.sql
```

Check the Result Grid to verify the baseline metrics.

Expected results:

* Total Employees: `1,470`
* Attrition Rate: `16.12%`

If the values match, the database setup has been completed successfully.

---

# Milestone 2: AI Analytics & Predictive Intelligence

Follow the steps below to set up and run the AI analytics and predictive intelligence system.

## Step-by-Step Setup

### Step 1: Install Python

Ensure that Python `3.10` or higher is installed on your system.

To check the installed Python version, open your terminal and run:

```bash
python --version
```

If Python is not installed, or the installed version is older than Python 3.10, install Python 3.10 or a newer version.

---

### Step 2: Open the Terminal in the Project Folder

Open Command Prompt or PowerShell and navigate to the project directory:

```powershell
cd "c:\Users\anil5\Desktop\New folder"
```

Make sure you are inside the main project folder before continuing.

---

### Step 3: Install Required Dependencies

Run the following command to install all required Python libraries:

```bash
pip install pandas openpyxl scikit-learn xgboost joblib fastapi uvicorn httpx python-dotenv openai
```

Wait for all dependencies to install successfully before moving to the next step.

---

### Step 4: Configure Environment Variables

The project contains a `.env` file in the root directory.

Open the `.env` file.

If you want to use the AI-powered search using RAG, add your OpenAI API key:

```text
OPENAI_API_KEY=your_actual_api_key_here
```

If you do not have an OpenAI API key, the system will automatically use a local rules-based keyword extractor.

This means the system can still work offline without an API key.

---

### Step 5: Run the Project Components

You can now run any of the following components depending on what you want to test.

---

## Run the Weekly Automation Agent

The automation agent scans employee data, identifies attrition risk, and creates reports.

Run:

```bash
python scripts/run_agent.py
```

This process:

* Reads the employee dataset
* Calculates predictions
* Identifies employee attrition risk
* Generates the required report

---

## Start the Web API Server

Start the FastAPI server using:

```bash
uvicorn app.main:app --reload
```

Once the server starts successfully, open the interactive API documentation in your browser:

```text
http://127.0.0.1:8000/docs
```

From there, you can view and test the available API endpoints.

---

## Run the Automated Tests

To verify that the complete system is working correctly, run:

```bash
python tests/test_api.py
```

This validates the major components and API functionality of the project.

---

# Milestone 3: Workforce Intelligence Dashboard

Develop an interactive Workforce Insights Dashboard to analyze employee data, workforce trends, attrition risk, diversity metrics, and employee health indicators.

## Dashboard Features

* Workforce headcount and department analysis
* Diversity and employee demographic metrics
* Attrition and job-role analysis
* ML-based employee attrition risk analysis
* Employee health score analysis
* Interactive filters and slicers
* KPI-based workforce insights
* Executive workforce summaries

---


## Step-by-Step Setup

### Step 1: Open the Dashboard 

Open the Power BI dashboard file:

WorkForce_Dashboard.pbix

Open the file using Microsoft Power BI Desktop.

---
### Step 2: Workforce Overview

The Overview page provides key workforce metrics including:

Total Employees: 1,470
Employees Left: 237
Attrition Rate: 16.1%
High-Risk Employees: 428
Average Monthly Income: approximately $6.5K

The page also includes visualizations for department, job role, gender, and employee tenure.

---
### Step 3: Predictive Insights

The Predictive Insights page displays ML-based attrition risk.

Employees are classified into:

High Risk: 428
Medium Risk: 252
Low Risk: 790

The page also includes:

Average Risk Score
Risk Score Distribution
High-Risk Employees by Department
Employee Health Score
Health Score Distribution

The Average Risk Score uses a 0–1 probability scale, while the Health Score uses a 0–100 scale.

---
### Step 4: Interactive Filters

The dashboard provides filters for:

Department
Job Role
Age Group
Gender
OverTime

These filters allow users to analyze specific employee groups.

Department and Gender filters are synchronized across the dashboard pages. 

---
### Step 5: Dashboard Validation

The dashboard metrics are validated for consistency.

High Risk + Medium Risk + Low Risk = Total Employees

428 + 252 + 790 = 1,470
High-Risk Employees by Department

228 + 182 + 18 = 428
Employees by Department

961 + 446 + 63 = 1,470

---


## Milestone 4: Frontend Dashboard – Workforce Insights Application

A React-based dashboard for exploring workforce analytics, employee performance, attrition risk, workforce health, diversity, recruitment, and HR policies.

## Frontend Features

* Workforce overview and analytics
* Department and timeframe filters
* Attrition and retention analysis
* Employee performance analysis
* Diversity and recruitment analysis
* AI-powered HR Policy Assistant
* RAG-based HR policy search
* Employee attrition prediction
* Workforce health score
* Responsive dashboard layout

---

## Prerequisites

* Node.js 18 or newer
* npm
* Python 3.10 or newer
* FastAPI backend

Check Node.js and npm:

```bash
node --version
npm --version
````

---

## Step-by-Step Setup

## Step 1: Open Frontend
---
```bash
cd frontend
```

## Step 2: Install Dependencies
---
```bash
npm install
```

## Step 3: Start Frontend
---
```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Step 4: Start Backend
---
Open another terminal:

```bash
cd ml
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## Step 5: Configure API URL
---
Create:

```text
frontend/.env.local
```

Add:

```text
VITE_API_URL=http://localhost:8000
```

## Step 6: Access Dashboard
---
Open:

```text
http://localhost:5173
```

Login to access the workforce dashboard.

---

## Dashboard Modules

* **Workforce Overview** – KPIs, departments, filters, and workforce analysis
* **Retention** – Attrition risk and employee retention analysis
* **Performance** – Employee performance insights
* **DEI** – Diversity, Equity, and Inclusion analysis
* **Recruitment** – Recruitment and talent flow analysis
* **AI Assistant** – HR policy questions using RAG
* **Health Score** – Workforce health indicators

---

## Application Routes

| Route           | Description             |
| --------------- | ----------------------- |
| `/`             | Login                   |
| `/dashboard`    | Workforce overview      |
| `/retention`    | Attrition and retention |
| `/performance`  | Employee performance    |
| `/dei`          | Diversity and Inclusion |
| `/recruitment`  | Recruitment analysis    |
| `/ai-assistant` | HR Policy Assistant     |

---

## Backend API Integration

| Method | Endpoint             | Purpose                |
| ------ | -------------------- | ---------------------- |
| GET    | `/`                  | Backend status         |
| POST   | `/query`             | HR policy RAG          |
| POST   | `/health-score`      | Workforce health score |
| POST   | `/predict-attrition` | Attrition prediction   |

---

## Frontend Technology Stack

* React
* Vite
* React Router
* Tailwind CSS
* FastAPI
* Python
* Machine Learning

---

## Frontend Validation

Run:

```bash
npm run lint
npm run build
```

Both commands should complete successfully without errors.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

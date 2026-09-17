import warnings
warnings.filterwarnings("ignore")

import os
import sys
import unittest
from fastapi.testclient import TestClient

# Add project root to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from app.main import app

class TestWorkforceAnalyticsAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root_endpoint(self):
        """Test that the API root endpoint responds with online status."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "online")

    def test_health_score_endpoint(self):
        """Test health score calculation with typical inputs."""
        payload = {
            "JobSatisfaction": 4,
            "TrainingTimesLastYear": 3,
            "PerformanceRating": 3,
            "WorkLifeBalance": 4
        }
        response = self.client.post("/health-score", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("health_score", data)
        self.assertIn("category", data)
        self.assertTrue(50 <= data["health_score"] <= 100)

    def test_health_score_validation(self):
        """Test that invalid values trigger standard validation errors."""
        invalid_payload = {
            "JobSatisfaction": 5, # Exceeds range limit [1, 4]
            "TrainingTimesLastYear": 3,
            "PerformanceRating": 3,
            "WorkLifeBalance": 4
        }
        response = self.client.post("/health-score", json=invalid_payload)
        self.assertEqual(response.status_code, 422)

    def test_predict_attrition_endpoint(self):
        """Test attrition prediction on custom employee records."""
        payload = [
            {
                "Age": 28.0,
                "Department": "Sales",
                "JobRole": "Sales Representative",
                "MonthlyIncome": 2500.0,
                "OverTime": "Yes",
                "JobSatisfaction": 1,
                "YearsAtCompany": 1.0,
                "TotalWorkingYears": 2.0
            },
            {
                "Age": 45.0,
                "Department": "Research & Development",
                "JobRole": "Manager",
                "MonthlyIncome": 12000.0,
                "OverTime": "No",
                "JobSatisfaction": 4,
                "YearsAtCompany": 12.0,
                "TotalWorkingYears": 20.0
            }
        ]
        response = self.client.post("/predict-attrition", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("predictions", data)
        self.assertEqual(len(data["predictions"]), 2)
        
        # Test first (high risk) employee output
        emp1 = data["predictions"][0]
        self.assertIn("attrition_prediction", emp1)
        self.assertIn("attrition_probability", emp1)
        self.assertIn("top_risk_drivers", emp1)
        
        # Risk should be high/medium due to low income, short tenure, high overtime, young age
        self.assertTrue(emp1["attrition_probability"] > 0.40)

    def test_query_rag_endpoint(self):
        """Test the RAG query engine endpoint with standard policy queries."""
        payload = {
            "query": "What is the funding limit for professional training?"
        }
        response = self.client.post("/query", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("query", data)
        self.assertIn("answer", data)
        self.assertIn("context", data)
        
        # Should retrieve the relevant section referencing $5,000 funding limit
        self.assertTrue(len(data["context"]) > 0)
        self.assertTrue(any("$5,000" in chunk["content"] for chunk in data["context"]))

if __name__ == "__main__":
    unittest.main()

USE WorkforceAnalyticsDB;

-- Query 1: Total Employees
SELECT COUNT(EmployeeNumber) AS Total_Employees 
FROM hr_employee_data;

-- Query 2: Average Employee Age
SELECT ROUND(AVG(Age), 2) AS Average_Age 
FROM hr_employee_data;

-- Query 3: Average Monthly Income
SELECT ROUND(AVG(MonthlyIncome), 2) AS Average_Monthly_Income 
FROM hr_employee_data;

-- Query 4: Average Years At Company
SELECT ROUND(AVG(YearsAtCompany), 2) AS Average_Years_At_Company 
FROM hr_employee_data;

-- Query 5: Overall Attrition Rate (%)
SELECT 
    SUM(CASE WHEN Attrition = 'Yes' THEN 1 ELSE 0 END) AS Total_Attrition,
    ROUND((SUM(CASE WHEN Attrition = 'Yes' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS Attrition_Rate_Percentage
FROM hr_employee_data;
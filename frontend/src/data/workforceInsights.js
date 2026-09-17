export const workforceMetrics = {
  totalEmployees: 1470, activeEmployees: 1182, attritionRate: 19.6, promotionRate: 8.7,
  healthScore: 74.2, avgTenure: 6.8, avgPerformance: 3.2, topPerformers: 350,
  lowPerformers: 85, avgKpiScore: 78.4, attendance: 94.2, avgLeaveDays: 8.5,
  overtimeHours: 12.3, eligiblePromotion: 127, promotionProbability: 62.3, highRiskEmployees: 288,
}

export const departmentInsights = [
  { name: 'Research & Development', shortName: 'R&D', employees: 1206, attrition: 19.2, rating: 3.1, health: 72.8, attendance: 95, overtime: 14.2 },
  { name: 'Sales', shortName: 'Sales', employees: 264, attrition: 22, rating: 3.5, health: 76.2, attendance: 92, overtime: 8.5 },
  { name: 'Human Resources', shortName: 'HR', employees: 88, attrition: 14.8, rating: 3.6, health: 78.5, attendance: 96, overtime: 5.8 },
]

export const workforceTrends = [
  { month: 'Jan', employees: 1420, attendance: 91, attrition: 18.2 }, { month: 'Feb', employees: 1435, attendance: 92, attrition: 18.5 },
  { month: 'Mar', employees: 1448, attendance: 93, attrition: 19 }, { month: 'Apr', employees: 1452, attendance: 92, attrition: 18.8 },
  { month: 'May', employees: 1460, attendance: 94, attrition: 19.2 }, { month: 'Jun', employees: 1465, attendance: 95, attrition: 19.5 },
  { month: 'Jul', employees: 1470, attendance: 93, attrition: 19.8 }, { month: 'Aug', employees: 1472, attendance: 94, attrition: 20 },
  { month: 'Sep', employees: 1475, attendance: 95, attrition: 19.6 }, { month: 'Oct', employees: 1478, attendance: 94, attrition: 19.4 },
  { month: 'Nov', employees: 1480, attendance: 93, attrition: 19.2 }, { month: 'Dec', employees: 1470, attendance: 94.2, attrition: 19.6 },
]

export const ageGroups = [{ name: '18-30', value: 35 }, { name: '31-45', value: 45 }, { name: '46-60', value: 20 }]
export const experienceGroups = [{ name: '0-5 years', value: 45 }, { name: '6-10 years', value: 35 }, { name: '10+ years', value: 20 }]
export const performanceDistribution = [
  { name: 'Outstanding', value: 78, attrition: 2 }, { name: 'Exceeds', value: 272, attrition: 5 },
  { name: 'Meets', value: 369, attrition: 15 }, { name: 'Needs improvement', value: 233, attrition: 28 }, { name: 'Unsatisfactory', value: 19, attrition: 50 },
]
export const salaryByRole = [{ name: 'Director', value: 18500 }, { name: 'Manager', value: 15200 }, { name: 'Specialist', value: 9800 }, { name: 'Executive', value: 6200 }]
export const promotionByRole = [{ name: 'Manager', value: 78 }, { name: 'Director', value: 65 }, { name: 'Specialist', value: 45 }, { name: 'Executive', value: 32 }]
export const attritionDrivers = [{ name: 'Overtime', value: 30.2 }, { name: 'Low satisfaction', value: 25.8 }, { name: 'No promotion', value: 22.1 }, { name: 'Junior-level role', value: 19.5 }]
export const riskEmployees = [
  { name: 'Ravi Kulkarni', department: 'Research & Development', score: 91, level: 'High', factor: 'Excessive overtime', tenure: '1.2 yrs', performance: 2.4, action: 'Schedule retention conversation' },
  { name: 'Neha Gupta', department: 'Sales', score: 87, level: 'High', factor: 'Low job satisfaction', tenure: '0.9 yrs', performance: 2.8, action: 'Review compensation and role fit' },
  { name: 'Sanjay Patel', department: 'Research & Development', score: 83, level: 'High', factor: 'No recent promotion', tenure: '3.1 yrs', performance: 3.2, action: 'Fast-track promotion review' },
  { name: 'Ritu Malhotra', department: 'Sales', score: 79, level: 'High', factor: 'Junior-level role', tenure: '0.7 yrs', performance: 2.9, action: 'Assign senior mentor' },
  { name: 'Amitabh Das', department: 'Human Resources', score: 74, level: 'Medium', factor: 'Excessive overtime', tenure: '2.4 yrs', performance: 3.1, action: 'Redistribute workload' },
  { name: 'Pooja Reddy', department: 'Research & Development', score: 69, level: 'Medium', factor: 'Low job satisfaction', tenure: '4.6 yrs', performance: 3.4, action: 'Follow up on engagement survey' },
  { name: 'Manish Bhatt', department: 'Sales', score: 65, level: 'Medium', factor: 'No recent promotion', tenure: '5.2 yrs', performance: 3.6, action: 'Discuss career growth path' },
  { name: 'Kavita Chawla', department: 'Human Resources', score: 58, level: 'Medium', factor: 'Commute / location', tenure: '2.0 yrs', performance: 3.5, action: 'Offer flexible work options' },
]
export const executiveSummary = [
  'Workforce health is 74.2/100, with performance and diversity as the strongest signals.',
  'Sales has the highest attrition rate at 22%, while R&D carries the largest headcount impact.',
  'Engagement is the main improvement area at 65%, alongside retention at 71%.',
  '288 employees are in the high-risk population and should receive proactive outreach.',
]
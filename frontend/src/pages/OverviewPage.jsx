import { useMemo, useState } from 'react'
import { ChevronDown, Filter } from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, LabelList, Line,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

const departments = ['All', 'Research & Development', 'Sales', 'Human Resources']
const jobRoles = ['All', 'Sales Representative', 'Laboratory Technician', 'Human Resources', 'Sales Executive', 'Research Scientist', 'Manufacturing Director', 'Healthcare Representative', 'Manager', 'Research Director']
const ageGroups = ['All', 'Under 30', '30-45', '46+']
const genders = ['All', 'Male', 'Female']
const overtimeOptions = ['All', 'Yes', 'No']

const departmentData = [
  { name: 'Research & Development', count: 961 },
  { name: 'Sales', count: 446 },
  { name: 'Human Resources', count: 63 },
]

const roleData = [
  { name: 'Sales Representative', rate: 39.8, share: 0.059 },
  { name: 'Laboratory Technician', rate: 23.9, share: 0.117 },
  { name: 'Human Resources', rate: 23.1, share: 0.035 },
  { name: 'Sales Executive', rate: 17.5, share: 0.224 },
  { name: 'Research Scientist', rate: 16.1, share: 0.196 },
  { name: 'Manufacturing Director', rate: 6.9, share: 0.103 },
  { name: 'Healthcare Representative', rate: 6.9, share: 0.063 },
  { name: 'Manager', rate: 4.9, share: 0.069 },
  { name: 'Research Director', rate: 2.5, share: 0.054 },
]

const filterFactors = {
  age: { 'Under 30': 0.27, '30-45': 0.48, '46+': 0.25 },
  gender: { Male: 0.6, Female: 0.4 },
  overtime: { Yes: 0.282, No: 0.718 },
}

const tooltipStyle = { border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' }

function OverviewPage({ filters }) {
  const [selections, setSelections] = useState({ department: filters?.department || 'All', jobRole: 'All', age: 'All', gender: 'All', overtime: 'All' })

  const dashboard = useMemo(() => buildDashboard(selections), [selections])
  const setFilter = (key, value) => setSelections((current) => ({ ...current, [key]: value }))

  return (
    <main className="mx-auto max-w-[1680px] p-4 sm:p-6 lg:p-8">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
        <header className="border-b border-slate-200 pb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">Workforce analytics</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">WORKFORCE INSIGHTS DASHBOARD : Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Power BI Canvas Emulation • Interactive Cross-Visual Filtering</p>
        </header>

        <section aria-label="Key performance indicators" className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="Total Employees" value={dashboard.total.toLocaleString()} />
          <KpiCard label="Attrition Rate" value={`${dashboard.attrition.toFixed(1)}%`} accent />
          <KpiCard label="Employees Left" value={dashboard.left.toLocaleString()} />
          <KpiCard label="High-Risk Employees" value={dashboard.highRisk.toLocaleString()} accent />
          <KpiCard label="Avg Monthly Income" value={`$${(dashboard.income / 1000).toFixed(1)}K`} />
        </section>

        <section aria-label="Dashboard filters" className="mt-5 rounded-lg border border-slate-200 bg-white p-3">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><Filter size={14} /> Slicers</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Slicer label="Department" value={selections.department} options={departments} onChange={(value) => setFilter('department', value)} />
            <Slicer label="JobRole" value={selections.jobRole} options={jobRoles} onChange={(value) => setFilter('jobRole', value)} />
            <Slicer label="Age Group" value={selections.age} options={ageGroups} onChange={(value) => setFilter('age', value)} />
            <Slicer label="Gender" value={selections.gender} options={genders} onChange={(value) => setFilter('gender', value)} />
            <Slicer label="OverTime" value={selections.overtime} options={overtimeOptions} onChange={(value) => setFilter('overtime', value)} />
          </div>
        </section>

        <section aria-label="Workforce visuals" className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartPanel title="Headcount by department" subtitle="Click a column to filter the dashboard">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.departments} margin={{ top: 25, right: 10, left: -15, bottom: 42 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="shortName" angle={-18} textAnchor="end" height={55} tick={{ fontSize: 11, fill: '#64748b' }} /><YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [value.toLocaleString(), 'Employees']} />
              <Bar dataKey="count" fill="#1e3a8a" radius={[3, 3, 0, 0]} cursor="pointer" onClick={(entry) => setFilter('department', entry.name)}><LabelList dataKey="count" position="top" fill="#334155" fontSize={12} fontWeight={700} /></Bar>
            </BarChart></ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Attrition Rate by Job Role" subtitle="Ranked attrition rate">
            <ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={dashboard.roles} margin={{ top: 4, right: 38, left: 12, bottom: 4 }} barCategoryGap={5}>
              <CartesianGrid horizontal={false} stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis type="number" domain={[0, 45]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 10, fill: '#64748b' }} /><YAxis type="category" dataKey="shortName" width={118} tick={{ fontSize: 10, fill: '#475569' }} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value.toFixed(1)}%`, 'Attrition']} />
              <Bar dataKey="rate" fill="#e11d48" radius={[0, 3, 3, 0]}><LabelList dataKey="rate" position="right" formatter={(value) => `${value.toFixed(1)}%`} fill="#be123c" fontSize={10} fontWeight={700} /></Bar>
            </BarChart></ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Headcount vs Attrition Rate by Tenure" subtitle="Volume and attrition trend">
            <ResponsiveContainer width="100%" height="100%"><ComposedChart data={dashboard.tenure} margin={{ top: 15, right: 12, left: -15, bottom: 35 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} /><YAxis yAxisId="left" allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} /><YAxis yAxisId="right" orientation="right" domain={[10, 30]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 10, fill: '#e11d48' }} /><Tooltip contentStyle={tooltipStyle} /><Bar yAxisId="left" dataKey="headcount" fill="#1e3a8a" radius={[3, 3, 0, 0]} /><Line yAxisId="right" type="monotone" dataKey="attrition" stroke="#e11d48" strokeWidth={3} dot={{ r: 4, fill: '#e11d48', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </ComposedChart></ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Gender Distribution" subtitle="Current filtered workforce">
            <div className="flex h-full items-center justify-center gap-8 px-4"><div className="relative h-full min-h-[190px] w-[55%] max-w-[260px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dashboard.gender} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="84%" paddingAngle={2} stroke="none">{dashboard.gender.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" fill="#0f172a" fontSize="24" fontWeight="700">{dashboard.total.toLocaleString()}</text><text x="50%" y="59%" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="10">EMPLOYEES</text></PieChart></ResponsiveContainer></div><div className="space-y-4 text-sm text-slate-600">{dashboard.gender.map((entry) => <div key={entry.name} className="flex items-center gap-2"><span className="size-3 rounded-full" style={{ backgroundColor: entry.color }} /><span>{entry.name}</span><strong className="text-slate-900">{entry.value}%</strong></div>)}</div></div>
          </ChartPanel>
        </section>
      </div>
    </main>
  )
}

function buildDashboard(selections) {
  const ageFactor = selections.age === 'All' ? 1 : filterFactors.age[selections.age]
  const genderFactor = selections.gender === 'All' ? 1 : filterFactors.gender[selections.gender] / 0.5
  const overtimeFactor = selections.overtime === 'All' ? 1 : filterFactors.overtime[selections.overtime] / 0.5
  const roleFactor = selections.jobRole === 'All' ? 1 : (roleData.find((role) => role.name === selections.jobRole)?.share || 0.1) / 0.1
  const commonFactor = ageFactor * genderFactor * overtimeFactor * roleFactor
  const total = Math.max(1, Math.round(1470 * commonFactor * (selections.department === 'All' ? 1 : departmentData.find((item) => item.name === selections.department).count / 1470)))
  const attritionFactor = selections.overtime === 'Yes' ? 1.22 : selections.overtime === 'No' ? 0.91 : 1
  const attrition = Math.min(99, 16.1 * attritionFactor * (selections.age === 'Under 30' ? 1.16 : selections.age === '46+' ? 0.78 : 1))
  const roles = roleData.map((role) => ({ ...role, shortName: role.name.length > 20 ? `${role.name.slice(0, 18)}...` : role.name, rate: Math.min(99, role.rate * attritionFactor) }))
  const departmentsView = departmentData.map((item) => ({ ...item, shortName: item.name === 'Research & Development' ? 'R&D' : item.name, count: Math.max(1, Math.round(item.count * commonFactor * (selections.department === 'All' || selections.department === item.name ? 1 : 0.02))) }))
  const left = Math.round(total * (attrition / 100))
  const gender = selections.gender === 'Male' ? [{ name: 'Male', value: 100, color: '#1e3a8a' }, { name: 'Female', value: 0, color: '#0284c7' }] : selections.gender === 'Female' ? [{ name: 'Male', value: 0, color: '#1e3a8a' }, { name: 'Female', value: 100, color: '#0284c7' }] : [{ name: 'Male', value: 60, color: '#1e3a8a' }, { name: 'Female', value: 40, color: '#0284c7' }]
  return { total, attrition, left, highRisk: Math.round(total * 0.291), income: Math.round(6500 * (selections.jobRole === 'Manager' || selections.jobRole === 'Research Director' ? 1.2 : 1)), departments: departmentsView, roles, gender, tenure: [{ name: 'Long-Term Employee', headcount: Math.round(total * 0.38), attrition: Math.max(10, attrition * 0.72) }, { name: 'Experienced', headcount: Math.round(total * 0.36), attrition: Math.max(10, attrition * 1.02) }, { name: 'New Employee', headcount: Math.round(total * 0.26), attrition: Math.min(30, attrition * 1.52) }] }
}

function KpiCard({ label, value, accent = false }) {
  return <article className="h-[78px] border border-[#cbd1d6] bg-white text-center shadow-none"><p className="pt-2 text-[11px] font-semibold leading-4 text-[#36516a]">{label}</p><p className={`mt-1 text-[21px] font-semibold leading-7 tracking-tight ${accent ? 'text-[#d9534f]' : 'text-[#36516a]'}`}>{value}</p></article>
}

function Slicer({ label, value, options, onChange }) {
  return <label className="relative block"><span className="mb-1.5 block text-[11px] font-semibold text-slate-500">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-9 text-xs text-slate-700 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute bottom-3 right-3 text-slate-400" /></label>
}

function ChartPanel({ title, subtitle, children }) {
  return <article className="min-h-[350px] rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="mb-2"><h2 className="text-sm font-bold text-slate-800">{title}</h2><p className="mt-1 text-[11px] text-slate-400">{subtitle}</p></div><div className="h-[270px]">{children}</div></article>
}

export default OverviewPage
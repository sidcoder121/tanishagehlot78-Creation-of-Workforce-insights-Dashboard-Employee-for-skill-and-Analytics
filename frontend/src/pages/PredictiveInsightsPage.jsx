import { useMemo, useState } from 'react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const departments = ['Research & Development', 'Sales', 'Human Resources']

const riskDistribution = [
  { name: '0-0.2', value: 645, color: '#65a30d' },
  { name: '0.2-0.4', value: 287, color: '#38bdf8' },
  { name: '0.4-0.6', value: 205, color: '#60a5fa' },
  { name: '0.6-0.8', value: 180, color: '#f59e0b' },
  { name: '0.8-1.0', value: 153, color: '#ef4444' },
]

const healthDistribution = [
  { name: '0-40', value: 475, color: '#f87171' },
  { name: '40-55', value: 573, color: '#eab308' },
  { name: '55-70', value: 389, color: '#3b82f6' },
  { name: '70-85', value: 33, color: '#14b8a6' },
]

const roleRisk = [
  ['Sales Representative', 0.7], ['Laboratory Technician', 0.48], ['Human Resources', 0.4],
  ['Sales Executive', 0.39], ['Research Scientist', 0.3], ['Manufacturing Director', 0.23],
  ['Manager', 0.19], ['Healthcare Representative', 0.19], ['Research Director', 0.07],
].map(([name, value]) => ({ name, value }))

const baseData = {
  highRisk: 428,
  averageRisk: 0.34,
  lowRisk: 790,
  mediumRisk: 252,
  total: 1470,
  healthAverage: 45.7,
  healthy: 6,
  atRisk: 605,
  critical: 859,
}

function PredictiveInsightsPage() {
  const [filter, setFilter] = useState({ type: '', value: '' })

  const filtered = useMemo(() => {
    if (!filter.value) return { ...baseData, scale: 1 }
    const departmentScale = { Sales: 0.52, 'Research & Development': 0.43, 'Human Resources': 0.05 }
    const riskScale = { 'Low Risk': 0.537, 'Medium Risk': 0.171, 'High Risk': 0.291 }
    const scale = filter.type === 'department' ? departmentScale[filter.value] : riskScale[filter.value]
    return {
      ...baseData,
      scale,
      total: Math.round(baseData.total * scale),
      highRisk: Math.round(baseData.highRisk * (filter.type === 'risk' && filter.value === 'High Risk' ? 1 : scale)),
      lowRisk: Math.round(baseData.lowRisk * (filter.type === 'risk' && filter.value === 'Low Risk' ? 1 : scale)),
      mediumRisk: Math.round(baseData.mediumRisk * (filter.type === 'risk' && filter.value === 'Medium Risk' ? 1 : scale)),
      healthy: Math.max(1, Math.round(baseData.healthy * scale)),
      atRisk: Math.round(baseData.atRisk * scale),
      critical: Math.round(baseData.critical * scale),
      averageRisk: filter.type === 'risk' ? (filter.value === 'High Risk' ? 0.68 : filter.value === 'Low Risk' ? 0.13 : 0.41) : baseData.averageRisk,
      healthAverage: filter.type === 'department' ? (filter.value === 'Sales' ? 46 : filter.value === 'Human Resources' ? 46 : 45) : baseData.healthAverage,
    }
  }, [filter])

  const selectFilter = (type, value) => setFilter((current) => current.value === value ? { type: '', value: '' } : { type, value })
  const scaleValue = (value) => Math.max(1, Math.round(value * filtered.scale))

  const departmentRisk = departments.map((name, index) => ({
    name,
    value: scaleValue([228, 182, 18][index]),
  }))
  const departmentHealth = departments.slice().reverse().map((name, index) => ({
    name,
    value: filter.value === name ? (name === 'Sales' || name === 'Human Resources' ? 46 : 45) : [45, 46, 46][index],
  }))
  const categoryHealth = [
    { name: 'Low Risk', value: filter.value === 'Low Risk' ? 48 : 48, color: '#15803d' },
    { name: 'Medium Risk', value: filter.value === 'Medium Risk' ? 44 : 44, color: '#f59e0b' },
    { name: 'High Risk', value: filter.value === 'High Risk' ? 42 : 42, color: '#dc2626' },
  ]

  return (
    <main className="mx-auto max-w-[1680px] p-4 sm:p-6 lg:p-8">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400"><SlidersHorizontal size={14} /> Predictive analytics</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">WORKFORCE INSIGHTS DASHBOARD : ML + Health Score Integration</h1>
          </div>
          {filter.value && <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800"><span>{filter.type === 'department' ? 'Department' : 'Risk category'}: {filter.value}</span><button type="button" aria-label="Reset filters" onClick={() => setFilter({ type: '', value: '' })} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 hover:bg-blue-100"><RotateCcw size={13} /> Reset Filters</button></div>}
        </header>

        <Section title="SECTION 1: ML PREDICTIONS — ATTRITION RISK">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Kpi label="Predicted High Risk" value={filtered.highRisk.toLocaleString()} sub={`High Risk Employees % ${filter.value ? Math.round(filtered.highRisk / filtered.total * 1000) / 10 : '29.1'}%`} tone="red" />
            <Kpi label="Average Risk Score" value={filtered.averageRisk.toFixed(2)} sub="out of 1.0" tone="navy" />
            <Kpi label="Low Risk Employees" value={filtered.lowRisk.toLocaleString()} sub={`${filter.value ? Math.round(filtered.lowRisk / filtered.total * 1000) / 10 : '53.7'}% of total`} tone="green" />
            <Kpi label="Medium Risk Employees" value={filtered.mediumRisk.toLocaleString()} sub={`${filter.value ? Math.round(filtered.mediumRisk / filtered.total * 1000) / 10 : '17.1'}% of total`} tone="amber" />
            <Kpi label="Total Employees" value={filtered.total.toLocaleString()} sub={filter.value ? 'Filtered population' : '100.0%'} tone="slate" />
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            <ChartCard title="Predicted High Risk Employees by Department"><HorizontalChart data={departmentRisk} color="#dc2626" onSelect={(value) => selectFilter('department', value)} format={(value) => value} /></ChartCard>
            <ChartCard title="Average Risk Score by Job Role"><HorizontalChart data={roleRisk} color="#1e293b" format={(value) => value.toFixed(2)} domain={[0, 0.8]} /></ChartCard>
            <ChartCard title="Risk Score Distribution"><ColumnChart data={riskDistribution.map((item) => ({ ...item, value: scaleValue(item.value) }))} /></ChartCard>
          </div>
        </Section>

        <Section title="SECTION 2: EMPLOYEE HEALTH SCORE">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Average Health Score" value={filtered.healthAverage.toFixed(2)} sub="out of 100" tone="navy" />
            <Kpi label="Healthy Employees" value={`${(filtered.healthy / filtered.total * 100).toFixed(1)}%`} sub={`${filtered.healthy} employees`} tone="green" />
            <Kpi label="At Risk Employees" value={`${(filtered.atRisk / filtered.total * 100).toFixed(1)}%`} sub={`${filtered.atRisk} employees`} tone="amber" />
            <Kpi label="Critical Employees" value={`${(filtered.critical / filtered.total * 100).toFixed(1)}%`} sub={`${filtered.critical} employees`} tone="red" />
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            <ChartCard title="Health Score by Department"><HorizontalChart data={departmentHealth} color="#1e3a8a" onSelect={(value) => selectFilter('department', value)} format={(value) => value} domain={[0, 55]} /></ChartCard>
            <ChartCard title="Health Score Distribution"><ColumnChart data={healthDistribution.map((item) => ({ ...item, value: scaleValue(item.value) }))} /></ChartCard>
            <ChartCard title="Health Score by Risk Category"><HorizontalChart data={categoryHealth} onSelect={(value) => selectFilter('risk', value)} format={(value) => value} domain={[0, 55]} /></ChartCard>
          </div>
        </Section>
        <p className="mt-4 text-[11px] text-slate-400">Select a department or risk category in any chart to cross-filter the dashboard. Select it again or use the reset control to clear the view.</p>
      </div>
    </main>
  )
}

function Section({ title, children }) { return <section className="mb-7 last:mb-0"><h2 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold tracking-tight text-slate-700">{title}</h2>{children}</section> }
function Kpi({ label, value, sub, tone }) { const colors = { red: 'text-red-600', navy: 'text-slate-800', green: 'text-green-600', amber: 'text-amber-600', slate: 'text-slate-900' }; return <div className="rounded-lg border border-slate-200 bg-white p-3 text-center shadow-xs"><p className="text-[11px] font-semibold text-slate-500">{label}</p><p className={`mt-1 text-2xl font-bold ${colors[tone]}`}>{value}</p><p className="mt-1 text-[10px] text-slate-400">{sub}</p></div> }
function ChartCard({ title, children }) { return <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3"><h3 className="mb-2 truncate text-xs font-bold text-slate-700" title={title}>{title}</h3>{children}</div> }
function HorizontalChart({ data, color, onSelect, format, domain = [0, 'auto'] }) { return <ResponsiveContainer width="100%" height={245}><BarChart data={data} layout="vertical" margin={{ top: 3, right: 35, left: 4, bottom: 3 }} barCategoryGap={7}><CartesianGrid horizontal={false} stroke="#e2e8f0" /><XAxis type="number" domain={domain} hide /><YAxis type="category" dataKey="name" width={112} tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => format(value)} /><Bar dataKey="value" fill={color || undefined} radius={[0, 3, 3, 0]} onClick={(entry) => onSelect?.(entry.name)}>{!color && data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}<LabelList dataKey="value" position="right" formatter={format} style={{ fontSize: 10, fontWeight: 700, fill: '#334155' }} /></Bar></BarChart></ResponsiveContainer> }
function ColumnChart({ data }) { return <ResponsiveContainer width="100%" height={245}><BarChart data={data} margin={{ top: 20, right: 8, left: 0, bottom: 20 }}><CartesianGrid vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} /><YAxis hide /><Tooltip cursor={{ fill: '#f8fafc' }} /><Bar dataKey="value" radius={[3, 3, 0, 0]}>{data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}<LabelList dataKey="value" position="top" style={{ fontSize: 10, fontWeight: 700, fill: '#334155' }} /></Bar></BarChart></ResponsiveContainer> }

export default PredictiveInsightsPage
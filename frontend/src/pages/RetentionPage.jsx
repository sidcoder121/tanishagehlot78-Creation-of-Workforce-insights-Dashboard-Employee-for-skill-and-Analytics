import { useState } from 'react'
import { AlertTriangle, ArrowDownRight, ArrowUpRight, HeartPulse, LoaderCircle, ShieldCheck } from 'lucide-react'
import { getHealthScore, predictAttrition } from '../api'

const initialProfile = {
  Age: 30,
  Department: 'Sales',
  JobRole: 'Sales Representative',
  MonthlyIncome: 2500,
  OverTime: 'Yes',
  JobSatisfaction: 2,
  TotalWorkingYears: 5,
}

const initialHealth = {
  JobSatisfaction: 3,
  TrainingTimesLastYear: 2,
  PerformanceRating: 4,
  WorkLifeBalance: 2,
}

function RetentionPage({ title = 'Attrition & Retention', eyebrow = 'Predictive retention workspace', description = 'Submit an employee profile to score attrition risk and review the workforce health signal.' }) {
  const [profile, setProfile] = useState(initialProfile)
  const [healthInputs, setHealthInputs] = useState(initialHealth)
  const [prediction, setPrediction] = useState(null)
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateProfile = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: ['Age', 'MonthlyIncome', 'JobSatisfaction', 'TotalWorkingYears'].includes(name) ? Number(value) : value }))
  }

  const updateHealth = (event) => {
    const { name, value } = event.target
    setHealthInputs((current) => ({ ...current, [name]: Number(value) }))
  }

  const analyze = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const [attritionResult, healthResult] = await Promise.all([predictAttrition(profile), getHealthScore(healthInputs)])
      setPrediction(attritionResult.predictions?.[0] || null)
      setHealth(healthResult)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-8 p-5 sm:p-8 lg:p-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>
      </header>

      {error && <div role="alert" className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <form onSubmit={analyze} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><ShieldCheck className="text-blue-600" size={21} /><div><h2 className="font-semibold text-slate-900">Employee risk profile</h2><p className="mt-1 text-xs text-slate-500">Fields are sent to <code>/predict-attrition</code>.</p></div></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Age" name="Age" type="number" value={profile.Age} onChange={updateProfile} />
            <Field label="Monthly income" name="MonthlyIncome" type="number" value={profile.MonthlyIncome} onChange={updateProfile} />
            <Field label="Total working years" name="TotalWorkingYears" type="number" value={profile.TotalWorkingYears} onChange={updateProfile} />
            <Field label="Job satisfaction (1-4)" name="JobSatisfaction" type="number" min="1" max="4" value={profile.JobSatisfaction} onChange={updateProfile} />
            <SelectField label="Department" name="Department" value={profile.Department} onChange={updateProfile} options={['Sales', 'Research & Development', 'Human Resources']} />
            <SelectField label="Job role" name="JobRole" value={profile.JobRole} onChange={updateProfile} options={['Sales Representative', 'Sales Executive', 'Research Scientist', 'Laboratory Technician', 'Manager']} />
            <SelectField label="Overtime" name="OverTime" value={profile.OverTime} onChange={updateProfile} options={['Yes', 'No']} />
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6"><h3 className="text-sm font-semibold text-slate-900">Workforce health inputs</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Training times last year" name="TrainingTimesLastYear" type="number" min="0" max="6" value={healthInputs.TrainingTimesLastYear} onChange={updateHealth} /><Field label="Performance rating (1-4)" name="PerformanceRating" type="number" min="1" max="4" value={healthInputs.PerformanceRating} onChange={updateHealth} /><Field label="Work-life balance (1-4)" name="WorkLifeBalance" type="number" min="1" max="4" value={healthInputs.WorkLifeBalance} onChange={updateHealth} /></div></div>
          <button type="submit" disabled={loading} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{loading && <LoaderCircle size={16} className="animate-spin" />} Analyze employee</button>
        </form>

        <Results prediction={prediction} health={health} />
      </div>
    </main>
  )
}

function Results({ prediction, health }) {
  if (!prediction && !health) return <div className="grid min-h-80 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><div><HeartPulse size={30} className="mx-auto text-slate-400" /><p className="mt-4 text-sm font-semibold text-slate-700">Results will appear here</p><p className="mt-1 text-xs text-slate-500">Run an analysis to connect this view to the ML service.</p></div></div>
  const probability = prediction ? Math.round(prediction.attrition_probability * 100) : null
  return <section className="space-y-6"><div className="rounded-xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/10"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">Attrition prediction</p><div className="mt-4 flex items-end justify-between gap-4"><div><p className="text-5xl font-semibold">{probability}%</p><p className="mt-2 text-sm text-slate-300">Logistic regression probability</p></div><span className="rounded-full bg-amber-400/15 px-3 py-1.5 text-xs font-bold text-amber-200">{prediction?.risk_score_category}</span></div><div className="mt-6 grid grid-cols-2 gap-3 text-xs"><Metric label="Prediction" value={prediction?.attrition_prediction ? 'Likely to leave' : 'Likely to stay'} /><Metric label="XGBoost reference" value={`${Math.round((prediction?.xgb_probability_ref || 0) * 100)}%`} /></div></div><div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Health score</p><p className="mt-2 text-3xl font-semibold text-slate-900">{health?.health_score}/100</p></div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">{health?.category}</span></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><DriverList title="Top risk drivers" drivers={prediction?.top_risk_drivers} icon={ArrowUpRight} tone="rose" /><DriverList title="Retention drivers" drivers={prediction?.top_retention_drivers} icon={ArrowDownRight} tone="emerald" /></div></div></section>
}

function DriverList({ title, drivers = [], icon: Icon, tone }) { return <div className="min-w-0"><h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><Icon size={14} className={tone === 'rose' ? 'text-rose-500' : 'text-emerald-500'} />{title}</h3><div className="mt-3 space-y-2">{drivers.length ? drivers.map((driver) => <div key={driver.feature} className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-xs"><span className="min-w-0 break-words text-slate-600">{driver.feature}</span><strong className={`shrink-0 ${tone === 'rose' ? 'text-rose-600' : 'text-emerald-600'}`}>{driver.contribution}</strong></div>) : <p className="text-xs text-slate-400">No drivers returned.</p>}</div></div> }
function Metric({ label, value }) { return <div className="rounded-lg bg-white/10 p-3"><p className="text-slate-400">{label}</p><p className="mt-1 font-semibold">{value}</p></div> }
function Field({ label, ...props }) { return <label className="block text-xs font-semibold text-slate-600">{label}<input {...props} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label> }
function SelectField({ label, options, ...props }) { return <label className="block text-xs font-semibold text-slate-600">{label}<select {...props} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">{options.map((option) => <option key={option}>{option}</option>)}</select></label> }

export default RetentionPage

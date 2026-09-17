import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const roles = [
  { label: 'HR Leader', email: 'hr.leader@infosys.com' },
  { label: 'Business Stakeholder', email: 'stakeholder@infosys.com' },
  { label: 'Executive', email: 'executive@infosys.com' },
  { label: 'Admin (Demo)', email: 'admin.demo@infosys.com' },
]

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState(roles[0].label)
  const [email, setEmail] = useState(roles[0].email)
  const [password, setPassword] = useState('Springboard2026')
  const [showPassword, setShowPassword] = useState(false)

  const handleRoleChange = (event) => {
    const selectedRole = roles.find(({ label }) => label === event.target.value)
    setRole(selectedRole.label)
    setEmail(selectedRole.email)
  }

  const handleSignIn = (event) => {
    event.preventDefault()
    login(role, email)
    navigate('/dashboard')
  }

  const handleSso = () => {
    login(role, email)
    navigate('/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:grid lg:grid-cols-[minmax(420px,0.92fr)_1.08fr]">
      <section className="relative isolate flex min-h-[470px] flex-col overflow-hidden bg-[#071a3b] px-7 py-8 text-white sm:px-12 lg:min-h-screen lg:px-[clamp(48px,7vw,112px)] lg:py-12">
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(126,169,220,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(126,169,220,.18)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div className="absolute -right-24 top-24 -z-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-cyan-200">
          <span className="grid size-9 place-items-center rounded-lg border border-cyan-200/30 bg-cyan-300/10"><BarChart3 size={19} strokeWidth={2.2} /></span>
          INFOSYS
        </div>

        <div className="my-auto max-w-xl py-16 lg:py-20">
          <div className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300"><Sparkles size={15} /> Intelligence, in focus</div>
          <h1 className="max-w-lg text-4xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] sm:text-5xl">Workforce Intelligence Hub</h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-blue-100/80">AI-Powered Analytics &amp; Talent Intelligence Dashboard</p>
          <p className="mt-10 border-l-2 border-cyan-300 pl-4 text-sm font-medium tracking-wide text-cyan-100">Gain strategic insights with LLM &amp; RAG.</p>
          <p className="mt-3 text-sm text-blue-200/60">An Infosys Springboard Project.</p>
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-6 text-[11px] font-medium uppercase tracking-[0.1em] text-blue-100/65 sm:grid-cols-2">
          <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-cyan-300" /> SOC2/GDPR Compliant Architecture</span>
          <span className="flex items-center gap-2"><LockKeyhole size={15} className="text-cyan-300" /> Role-Scoped Data Access Control</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="w-full max-w-[460px]">
          <div className="mb-9">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Secure workspace access</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to access your analytics</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <label className="block text-sm font-semibold text-slate-700">Role
              <span className="relative mt-2 block">
                <select value={role} onChange={handleRoleChange} className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-11 text-sm font-normal shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10">
                  {roles.map(({ label }) => <option key={label}>{label}</option>)}
                </select>
                <ChevronDown size={17} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </span>
            </label>

            <label className="block text-sm font-semibold text-slate-700">Work email
              <span className="relative mt-2 block"><Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm font-normal shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" /></span>
            </label>

            <label className="block text-sm font-semibold text-slate-700">Password
              <span className="relative mt-2 block"><LockKeyhole size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-12 text-sm font-normal shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
            </label>

            <button type="submit" className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0b2d66] text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#092451] focus:outline-none focus:ring-4 focus:ring-blue-600/20">Sign In <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" /></button>
          </form>

          <div className="my-8 flex items-center gap-3 text-xs font-medium text-slate-400"><span className="h-px flex-1 bg-slate-200" /> Or sign in with SSO: <span className="h-px flex-1 bg-slate-200" /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={handleSso} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40"><span className="grid size-5 place-items-center rounded-sm bg-[#0879f9] text-[10px] font-bold text-white">M</span> Microsoft Azure AD</button>
            <button type="button" onClick={handleSso} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50/40"><span className="grid size-5 place-items-center rounded-sm bg-[#f36f21] text-[10px] font-bold text-white">W</span> Workday SSO</button>
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><Check size={14} className="text-emerald-500" /> This is a student prototype. Actual SSO integration simulated.</p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage

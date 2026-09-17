import { Bell, ChevronDown, LogOut, Search, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const departments = ['All', 'Research & Development', 'Sales', 'Human Resources']
const timeframes = ['FY 2026', 'Q3 2026', 'FY 2025']

function Navbar({ onFilterChange }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 flex min-h-20 flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <label className="relative min-w-[210px] flex-1 sm:flex-none">
          <span className="sr-only">Search workforce data</span>
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" placeholder="Search workforce data" onChange={(event) => onFilterChange('search', event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:w-56" />
        </label>
        <FilterSelect label="Department" options={departments} onChange={(value) => onFilterChange('department', value)} />
        <FilterSelect label="Timeframe" options={timeframes} onChange={(value) => onFilterChange('timeframe', value)} />
      </div>

      <div className="flex items-center justify-between gap-5 lg:justify-end">
        <button type="button" aria-label="Notifications" className="relative grid size-10 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
          <Bell size={19} />
          <span className="absolute right-2 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-5 sm:flex">
          <UserCircle size={34} strokeWidth={1.5} className="text-slate-400" />
          <div className="max-w-44">
            <p className="truncate text-xs font-semibold text-slate-800">{user?.email || 'guest@infosys.com'}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{user?.role || 'Guest'}</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"><LogOut size={15} /> Logout</button>
      </div>
    </header>
  )
}

function FilterSelect({ label, options, onChange }) {
  return (
    <label className="relative flex h-10 items-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600">
      <span className="sr-only">{label}</span>
      <select defaultValue={options[0]} onChange={(event) => onChange(event.target.value)} className="h-full max-w-[165px] appearance-none bg-transparent py-0 pl-3 pr-8 outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 text-slate-400" />
    </label>
  )
}

export default Navbar

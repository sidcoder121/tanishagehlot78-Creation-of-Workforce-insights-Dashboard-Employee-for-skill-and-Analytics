import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Clock3,
  FileText,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  User,
} from 'lucide-react'
import { getApiUrl, queryHrPolicies } from '../api'

const suggestedPrompts = [
  'What are the rules regarding hybrid and remote work?',
  'What are the criteria for promotion readiness?',
  'How is the Skill Gap Flag calculated for underperforming staff?',
  'What are our training program entitlements?',
]

const sourceDocuments = [
  'hr_policies.txt (Training, Work-Life, Promotions, Retention)',
  'encoded_data.xlsx (1,470 Records • Skill Gap & Promotion Ready Flags)',
]

const starterPrompts = [
  'Ask about hybrid work rules',
  'Explain promotion readiness',
  'How is Skill Gap Flag calculated?',
]

const offlineResponse = (query) => ({
  answer: `The FastAPI RAG service is currently unavailable, so I cannot retrieve a verified policy answer for “${query}”. Start the backend with the FastAPI app and retry this question.`,
  source: 'Client fallback (FastAPI server offline)',
})

function AiAssistantPage() {
  const [messages, setMessages] = useState([{ role: 'assistant', welcome: true }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking')
  const [expandedSources, setExpandedSources] = useState({})
  const [copiedMessage, setCopiedMessage] = useState(null)
  const feedEndRef = useRef(null)

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    let isMounted = true
    fetch(`${getApiUrl()}/`)
      .then((response) => {
        if (!response.ok) throw new Error('FastAPI health check failed')
        if (isMounted) setApiStatus('connected')
      })
      .catch(() => {
        if (isMounted) setApiStatus('offline')
      })
    return () => { isMounted = false }
  }, [])

  const submitQuery = async (query = input) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery || isLoading) return

    setMessages((current) => [...current, { role: 'user', text: trimmedQuery }])
    setInput('')
    setIsLoading(true)

    try {
      const result = await queryHrPolicies(trimmedQuery)
      setApiStatus(result.source?.toLowerCase().includes('fallback') ? 'fallback' : 'connected')
      setMessages((current) => [...current, {
        role: 'assistant',
        answer: result.answer || 'The RAG engine returned an empty answer.',
        source: result.source || 'FastAPI RAG response',
        context: result.context,
      }])
    } catch (error) {
      console.warn('RAG API request failed:', error)
      setApiStatus('offline')
      setMessages((current) => [...current, { role: 'assistant', ...offlineResponse(trimmedQuery) }])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSources = (messageIndex) => {
    setExpandedSources((current) => ({ ...current, [messageIndex]: !current[messageIndex] }))
  }

  const copyResponse = async (message, messageIndex) => {
    await navigator.clipboard?.writeText(message.answer)
    setCopiedMessage(messageIndex)
    window.setTimeout(() => setCopiedMessage(null), 1800)
  }

  const statusIsConnected = apiStatus === 'connected'

  return (
    <main className="h-[calc(100vh-4rem)] min-h-0 overflow-hidden flex flex-col bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 pb-3 pt-5">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">GenAI workforce intelligence</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">HR Strategy &amp; Policy Assistant</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Retrieval-Augmented Generation (RAG) agent querying company HR policies, compensation bands, and workforce data.</p>
        </div>
        <div title={apiStatus === 'checking' ? 'Checking FastAPI connection' : statusIsConnected ? 'FastAPI is responding' : 'Using fallback mode'} className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-inset ${statusIsConnected ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
          <span className="relative flex size-2"><span className={`absolute inline-flex size-full animate-ping rounded-full opacity-75 ${statusIsConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} /><span className={`relative inline-flex size-2 rounded-full ${statusIsConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} /></span>
          RAG Engine Online <span className={statusIsConnected ? 'text-emerald-400' : 'text-amber-400'}>•</span> FastAPI / TF-IDF Vectorizer
        </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <KnowledgeScope onPromptSelect={(prompt) => submitQuery(prompt)} />
        <section className="relative flex min-w-0 flex-1 flex-col bg-slate-50">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {messages.map((message, index) => <ChatMessage key={`${message.role}-${index}`} message={message} messageIndex={index} expanded={expandedSources[index]} copied={copiedMessage === index} onToggleSources={() => toggleSources(index)} onPromptSelect={(prompt) => submitQuery(prompt)} onCopy={() => copyResponse(message, index)} />)}
            {isLoading && <TypingIndicator />}
            <div ref={feedEndRef} />
          </div>
          <div className="shrink-0 border-t border-slate-200 bg-white/80 p-4 backdrop-blur-sm">
            <form onSubmit={(event) => { event.preventDefault(); submitQuery() }} className="mx-auto flex max-w-4xl items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
              <button type="button" aria-label="Attach document" title="Attach document" className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"><Paperclip size={17} /></button>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question about HR policies, remote work, promotions, or training..." className="min-w-0 flex-1 text-xs text-slate-800 outline-none placeholder:text-slate-400 md:text-sm" />
              <button type="button" aria-label="Voice input" title="Voice input" className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"><Mic size={17} /></button>
              <button type="submit" aria-label="Send question" title="Send question" disabled={!input.trim() || isLoading} className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-40"><Send size={16} /></button>
            </form>
            <p className="mt-1.5 text-center text-[10px] text-slate-600">Grounding provided by TF-IDF vector retrieval over hr_policies.txt. Always cross-verify critical talent decisions.</p>
          </div>
        </section>
      </div>
    </main>
  )
}

function KnowledgeScope({ onPromptSelect }) {
  return (
    <aside className="hidden w-80 shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-200 bg-white p-4 md:flex">
      <div>
        <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600"><Sparkles size={16} /></span><h2 className="text-sm font-semibold text-slate-900">Knowledge scope</h2></div>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Active RAG index sources</p>
        <div className="mt-3 space-y-2">{sourceDocuments.map((document) => <div key={document} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600"><FileText size={15} className="mt-0.5 shrink-0 text-blue-500" /><span className="min-w-0 flex-1">{document}</span><span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">Indexed</span></div>)}</div>
        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Suggested prompts</p>
        <div className="mt-3 space-y-2">{suggestedPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => onPromptSelect(prompt)} className="group flex w-full items-start gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-xs leading-5 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"><ChevronRight size={14} className="mt-0.5 shrink-0 text-blue-500 transition group-hover:translate-x-0.5" />{prompt}</button>)}</div>
      </div>
      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600"><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-700"><Check size={13} /> RAG technical details</p><dl className="mt-2 space-y-1.5"><div className="flex justify-between gap-2"><dt>Vectorizer</dt><dd className="text-right font-medium text-slate-800">TF-IDF + Cosine</dd></div><div className="flex justify-between gap-2"><dt>Top-K</dt><dd className="text-right font-medium text-slate-800">2 policy sections</dd></div><div className="flex justify-between gap-2"><dt>Generator</dt><dd className="text-right font-medium text-slate-800">GPT / Local fallback</dd></div></dl></div>
    </aside>
  )
}

function ChatMessage({ message, messageIndex, expanded, copied, onToggleSources, onPromptSelect, onCopy }) {
  if (message.role === 'user') return <div className="flex items-end justify-end gap-2"><div className="max-w-[75%] rounded-2xl rounded-tr-none bg-slate-900 px-4 py-2.5 text-xs font-medium leading-5 text-white md:text-sm">{message.text}</div><span className="grid size-7 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-600"><User size={14} /></span></div>

  return <div className="flex items-start gap-2.5"><div className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-white shadow-sm"><Bot size={16} /></div><div className="max-w-[85%] rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-sm md:text-sm"><div className="mb-3 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2"><span className="font-semibold text-slate-900">Workforce RAG Assistant</span><span className="inline-flex items-center gap-1 text-[10px] text-slate-400"><Clock3 size={11} /> {message.welcome ? 'Now' : 'Just now'}</span></div>{message.welcome ? <><p>I can look up verified policies from <strong>docs/hr_policies.txt</strong>, or explain workforce model scoring such as Skill Gap and Promotion Ready flags from the indexed dataset.</p><div className="mt-4 flex flex-wrap gap-2">{starterPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => onPromptSelect(prompt)} className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">{prompt}</button>)}</div></> : <><div className="space-y-2">{message.answer.split('\n').map((line, lineIndex) => <FormattedLine key={`${messageIndex}-${lineIndex}`} line={line} />)}</div><div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3"><button type="button" onClick={onToggleSources} className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-100"><ChevronDown size={13} className={expanded ? 'rotate-180 transition' : 'transition'} /> Source: {message.source}</button><ActionButton icon={copied ? Check : Clipboard} label={copied ? 'Copied' : 'Copy'} onClick={onCopy} /></div>{expanded && <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[10px] leading-5 text-slate-500">{message.source}{message.context?.length ? `\n${message.context.map((chunk) => `\n[Chunk ${chunk.chunk_id} | Similarity: ${chunk.score.toFixed(2)}]\n${chunk.content}`).join('')}` : ''}</div>}</>}</div></div>
}

function FormattedLine({ line }) {
  const trimmedLine = line.trim()
  const isBullet = /^[-*•]\s/.test(trimmedLine)
  const isSection = /^SECTION\s+\d+\s*:/i.test(trimmedLine)
  const content = isBullet ? trimmedLine.slice(2) : trimmedLine
  const parts = content.split(/(\*\*.*?\*\*)/g)
  return <p className={`${isBullet ? 'flex gap-2 pl-2 text-slate-600' : ''} ${isSection ? 'border-t border-slate-100 pt-2 font-semibold uppercase tracking-wide text-slate-900' : ''}`}>{isBullet && <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-500" />}{parts.map((part, index) => part.startsWith('**') ? <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong> : part)}</p>
}

function ActionButton({ icon: Icon, label, onClick }) {
  return <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><Icon size={13} />{label}</button>
}

function TypingIndicator() {
  return <div className="flex items-center gap-2.5"><div className="grid size-8 place-items-center rounded-lg bg-blue-600 text-white"><Bot size={16} /></div><div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-slate-200 bg-white px-4 py-4 shadow-sm"><span className="size-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" /><span className="size-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" /><span className="size-1.5 animate-bounce rounded-full bg-blue-500" /></div></div>
}

export default AiAssistantPage
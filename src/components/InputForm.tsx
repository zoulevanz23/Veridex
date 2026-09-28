import { useState } from 'react'
import { Mail, Link2, Newspaper, FileText, Image as ImageIcon, ArrowRight, ShieldCheck, AlertTriangle, XCircle, Upload } from 'lucide-react'
import { analyzeContent, type AnalysisResponse } from '../lib/api'
import ResultCard from './ResultCard'
import Loader from './Loader'
import { toast } from 'react-hot-toast'
import Button from './ui/Button'

type AnalysisType = 'message' | 'link' | 'news' | 'document' | 'image'

const typeMeta: Record<AnalysisType, { label: string; icon: React.ReactNode; helper: string; placeholder: string }> = {
  message: { label: 'Message', icon: <Mail size={16} />, helper: 'Email, SMS, DM or chat transcript', placeholder: 'Paste the full message including sender and subject if available…\n\nExample: "Congratulations! You\'ve won $1,000,000! Click here to claim your prize now!"' },
  link:    { label: 'Link',    icon: <Link2 size={16} />, helper: 'URL, shortened link or QR destination', placeholder: 'Paste the URL to check…\n\nExample: https://suspicious-website.com/claim-prize' },
  news:    { label: 'Article', icon: <Newspaper size={16} />, helper: 'Headline, article or social post', placeholder: 'Paste the headline and key claims…\n\nExample: "Scientists Discover That Drinking Coffee Cures All Diseases"' },
  document:{ label: 'Document',icon: <FileText size={16} />, helper: 'Text file, report or exported chat', placeholder: 'Paste document text here…' },
  image:   { label: 'AI Image Scan', icon: <ImageIcon size={16} />, helper: 'Upload image to detect AI generation, deepfakes, or digital manipulation', placeholder: 'Upload an image file below or paste image base64 data / image URL…' },
}

const InputForm = () => {
  const [input, setInput] = useState('')
  const [type, setType] = useState<AnalysisType>('message')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResponse['result'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const canSubmit = (input.trim().length > 0 || !!file || !!imagePreview) && !isLoading

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('That file is too large. Please choose an image under 10 MB.')
      setFile(null)
      setImagePreview(null)
      return
    }
    setFile(selectedFile)
    setError(null)
    const ext = selectedFile.name.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
      setType('image')
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') setImagePreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    if (input.trim().length > 0 && input.trim().length < 10) {
      setError('Please paste at least a sentence or two — a few words are hard to verify.')
      return
    }
    setIsLoading(true); setError(null); setResult(null)
    try {
      let content = input
      if (imagePreview) {
        content = imagePreview
      } else if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase()
        if (ext === 'txt') content = await file.text()
        else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
          content = await new Promise((resolve, reject) => {
            const r = new FileReader()
            r.onload = () => resolve(r.result as string)
            r.onerror = reject
            r.readAsDataURL(file)
          })
        } else {
          setError('That file type isn\'t supported. For text documents, copy the text into the box instead.')
          setIsLoading(false)
          return
        }
      }
      const out = await analyzeContent(content, type)
      setResult(out)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed.'
      setError(msg); try { toast.error(msg) } catch {}
    } finally { setIsLoading(false) }
  }

  const meta = typeMeta[type]
  const count = file ? (file.name + ' • ' + (file.size/1024).toFixed(1) + ' KB') : `${input.length} / 10,000`

  return (
    <div className="max-w-[720px] mx-auto">
      <div role="tablist" aria-label="Analysis type" className="flex gap-2 flex-wrap mb-3">
        {(Object.keys(typeMeta) as AnalysisType[]).map(k => {
          const active = k === type
          const m = typeMeta[k]
          return (
            <button
              key={k}
              role="tab"
              aria-selected={active}
              onClick={() => setType(k)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border text-sm font-semibold cursor-pointer transition-colors"
              style={{
                borderColor: active ? 'var(--ink)' : 'var(--line)',
                background: active ? 'var(--ink)' : 'var(--surface)',
                color: active ? 'var(--paper)' : 'var(--ink-soft)',
              }}
            >
              <span className="inline-flex">{m.icon}</span>
              {m.label}
            </button>
          )
        })}
      </div>
      <div className="text-sm mb-4 flex items-center gap-1.5" style={{ color: 'var(--ink-soft)' }}>
        <ShieldCheck size={14} style={{ color: 'var(--lamp)' }} /> {meta.helper}
      </div>

      <div className="rounded-sm overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
        <form onSubmit={handleSubmit} className="m-0">
          <div className="px-4 py-4 flex justify-between items-center" style={{ borderBottom: `1px solid var(--line)` }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Content</span>
            <span className="text-xs font-mono" style={{ color: 'var(--ink-soft)' }}>{count}</span>
          </div>

          <div className="p-4">
            <textarea
              rows={7}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={meta.placeholder}
              maxLength={10000}
              disabled={isLoading}
              className={`w-full border rounded-sm p-3.5 bg-surface text-[14px] ${type === 'link' ? 'font-mono text-[13px]' : ''}`}
              style={{ borderColor: 'var(--line)', color: 'var(--ink)', outline: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--lamp)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--line)'}
            />
            {input.length > 9000 && (
              <div className="flex gap-1.5 items-center mt-2 text-xs" style={{ color: 'var(--suspicious)' }}>
                <AlertTriangle size={14} /> Approaching limit
              </div>
            )}

            {imagePreview && (
              <div className="mt-3 relative inline-block rounded-sm overflow-hidden max-w-[240px]" style={{ border: '1px solid var(--line)' }}>
                <img src={imagePreview} alt="Upload preview" className="w-full max-h-48 object-cover block" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setFile(null) }}
                  className="absolute top-1.5 right-1.5 rounded-full p-1 cursor-pointer border-none"
                  style={{ background: 'rgba(27,32,39,0.85)', color: 'var(--paper)' }}
                >
                  <XCircle size={16} />
                </button>
              </div>
            )}

            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <label className="text-sm inline-flex items-center gap-2 cursor-pointer" style={{ color: 'var(--ink-soft)' }}>
                <input
                  type="file"
                  accept=".txt,.png,.jpg,.jpeg,.webp,.gif"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
                />
                <span className="border rounded-sm px-2.5 py-1.5 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer" style={{ borderColor: 'var(--line)', background: 'var(--paper)', color: 'var(--ink)' }}>
                  <Upload size={13} /> Attach file or image
                </span>
                <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>JPG, PNG, WEBP, TXT</span>
              </label>
              {file && !imagePreview && (
                <span className="text-xs rounded-sm px-2.5 py-1 inline-flex gap-1.5 items-center" style={{ color: 'var(--ink)', background: 'var(--paper)', border: '1px solid var(--line)' }}>
                  {file.name}
                  <button type="button" onClick={() => setFile(null)} className="border-none bg-transparent cursor-pointer p-0 leading-none" style={{ color: 'var(--ink-soft)' }}>
                    <XCircle size={14} />
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="px-4 py-3 flex justify-end items-center gap-3" style={{ background: 'var(--paper)', borderTop: '1px solid var(--line)' }}>
            <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>{isLoading ? 'Verifying…' : 'No data is stored'}</span>
            <Button type="submit" disabled={!canSubmit} variant={canSubmit ? 'primary' : 'secondary'} icon={<ArrowRight size={16} />}>
              {isLoading ? 'Analyzing…' : 'Analyze'}
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mt-4 rounded-sm p-3 flex gap-2 items-center" style={{ background: 'rgba(168,64,42,0.08)', border: '1px solid rgba(168,64,42,0.25)', color: 'var(--scam)' }}>
          <XCircle size={16} /> {error}
        </div>
      )}
      {isLoading && (
        <div className="mt-4 rounded-sm p-4 flex items-center gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
          <Loader />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Running verification</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)' }}>Cross-checking patterns and signals…</div>
          </div>
        </div>
      )}
      {result && (
        <div className="mt-4">
          <ResultCard result={result} />
        </div>
      )}

      <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-soft)' }}>How to get a better result</div>
        <ul className="m-0 pl-4 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          <li>Include the complete message, sender and subject for emails.</li>
          <li>For links, paste the exact URL. Shortened links are automatically expanded.</li>
          <li>For articles, include headline and the specific claim to check.</li>
        </ul>
      </div>
    </div>
  )
}
export default InputForm
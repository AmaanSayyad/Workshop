import { useCallback, useEffect, useState } from 'react'
import type { ContractTransactionResponse, JsonRpcSigner } from 'ethers'
import { formatEther, parseEther } from 'ethers'
import {
  SEPOLIA_CHAIN_ID,
  STORAGE_KEY,
  connectWallet,
  explorerTx,
  getContract,
  hashText,
  isAddressLike,
  shortAddress,
  switchToSepolia,
} from './ethereum'
import { abi } from './abi'

export default function App() {

  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [chainId, setChainId] = useState<bigint | null>(null)
  const [appId, setAppId] = useState('')
  const [saved, setSaved] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)

  const isSepolia = chainId === SEPOLIA_CHAIN_ID
  const ready = Boolean(signer && saved && isSepolia && !busy)

  useEffect(() => {
    const fromEnv = import.meta.env.VITE_APP_ID as string | undefined
    const s = fromEnv && isAddressLike(fromEnv) ? fromEnv : localStorage.getItem(STORAGE_KEY)
    if (s && isAddressLike(s)) {
      setAppId(s)
      setSaved(s)
    }
  }, [])

  async function signIn() {
    try {
      const w = await connectWallet()
      setAddress(w.address)
      setSigner(w.signer)
      setChainId(w.chainId)
      if (w.chainId !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia()
        const again = await connectWallet()
        setAddress(again.address)
        setSigner(again.signer)
        setChainId(again.chainId)
      }
      setStatus('')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not sign in')
    }
  }

  function saveConnection() {
    const v = appId.trim()
    if (!isAddressLike(v)) {
      setStatus('Paste a valid app connection id (0x…)')
      return
    }
    localStorage.setItem(STORAGE_KEY, v)
    setSaved(v)
    setSettingsOpen(false)
    setStatus('Connected to your deployment')
  }

  const run = useCallback(async (label: string, fn: () => Promise<ContractTransactionResponse>) => {
    if (!signer || !saved) {
      setStatus('Sign in and connect your deployment in Settings first')
      setSettingsOpen(true)
      return
    }
    if (!isSepolia) {
      setStatus('Switch your wallet network, then try again')
      return
    }
    setBusy(true)
    setStatus(label + '…')
    setTxHash(null)
    try {
      const tx = await fn()
      setTxHash(tx.hash)
      setStatus('Waiting for confirmation…')
      await tx.wait()
      setStatus(label + ' — done')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }, [signer, saved, isSepolia])

  const [content, setContent] = useState('Certificate of completion — Blockchain Lab 2026')
  const [student, setStudent] = useState('')
  const [course, setCourse] = useState('Blockchain Technologies')


  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo">
          <div className="mark">C</div>
          <div>
            <strong>Credence</strong>
            <small>Credentials</small>
          </div>
        </div>
        <div className="nav-actions">
          <button type="button" className="btn secondary" onClick={() => setSettingsOpen(true)}>Settings</button>
          {address ? (
            <span className="pill">{shortAddress(address)}</span>
          ) : (
            <button type="button" className="btn" onClick={() => void signIn()}>Sign in</button>
          )}
        </div>
      </nav>

      <header className="hero">
        <div>
          <p className="kicker">Credentials</p>
          <h1>Authentic credentials. Instant verification.</h1>
          <p>Issue certificates students can verify forever.</p>
        </div>
        <div className="hero-card">
          <h3>Welcome{address ? '' : ' — sign in to continue'}</h3>
          <p>{saved ? 'Your workspace is connected. Actions below are live.' : 'Open Settings once to connect this app to your deployment, then use it like any normal product.'}</p>
          <div className="stats">
            <div className="stat"><b>{address ? 'In' : '—'}</b><span>Signed in</span></div>
            <div className="stat"><b>{saved ? 'On' : 'Off'}</b><span>Workspace</span></div>
            <div className="stat"><b>{isSepolia ? 'OK' : '—'}</b><span>Network</span></div>
          </div>
        </div>
      </header>

      <div className="workspace">

        <section className="card">
          <h2>Issue a certificate</h2>
          <p className="sub">Write the credential text. We fingerprint it automatically for verification later.</p>
          <label>Certificate text</label>
          <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
          <label>Student name</label>
          <input value={student} onChange={(e) => setStudent(e.target.value)} />
          <label>Course</label>
          <input value={course} onChange={(e) => setCourse(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Issuing certificate', async () => getContract(saved!, abi, signer!).issueCertificate(student, course, hashText(content)))}>Issue</button>
          </div>
        </section>
        <section className="card">
          <h2>Verify a certificate</h2>
          <p className="sub">Paste the same certificate text a student shows you.</p>
          <label>Certificate text to verify</label>
          <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!signer || !saved} onClick={async () => {
              const v = await getContract(saved!, abi, signer!).verify(hashText(content))
              setResult(v.valid ? `Authentic\n${v.studentName}\n${v.courseName}` : 'Not found or revoked')
            }}>Verify now</button>
          </div>
        </section>
      </div>

      {(status || txHash) && (
        <div className="toast">
          {status}
          {txHash && (
            <>
              {' · '}
              <a href={explorerTx(txHash)} target="_blank" rel="noreferrer">View receipt</a>
            </>
          )}
        </div>
      )}
      {result && <pre className="result">{result}</pre>}

      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Workspace connection</h3>
            <p>Paste the deployment id from your admin once. Everyday users never need this screen again.</p>
            <label>Deployment id</label>
            <input value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="0x…" spellCheck={false} />
            <div className="row">
              <button type="button" className="btn" onClick={saveConnection}>Save & close</button>
              <button type="button" className="btn secondary" onClick={() => setSettingsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>© Credence</span>
        <span>Built for real campus workflows</span>
      </footer>
    </div>
  )
}

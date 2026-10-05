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

  const [category, setCategory] = useState('Lost')
  const [description, setDescription] = useState('')
  const [ticketId, setTicketId] = useState('0')
  const [newStatus, setNewStatus] = useState('1')


  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo">
          <div className="mark">C</div>
          <div>
            <strong>CampusDesk</strong>
            <small>Support</small>
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
          <p className="kicker">Support</p>
          <h1>File a ticket. Track the fix.</h1>
          <p>Lost & found and facility issues, tracked end to end.</p>
        </div>
        <div className="hero-card">
          <h3>{address ? 'You are signed in' : 'Sign in to get started'}</h3>
          <p>{saved ? 'Everything below is ready to use.' : 'First time here? Open Settings, paste the app ID from your organizer, then continue as usual.'}</p>
          <div className="stats">
            <div className="stat"><b>{address ? 'Yes' : 'No'}</b><span>Account</span></div>
            <div className="stat"><b>{saved ? 'Yes' : 'No'}</b><span>Connected</span></div>
            <div className="stat"><b>{isSepolia || !address ? (address ? 'Ready' : '—') : 'Fix'}</b><span>Status</span></div>
          </div>
        </div>
      </header>

      <div className="workspace">

        <section className="card">
          <h2>New request</h2>
          <p className="sub">Lost ID? Broken projector? File it in under a minute.</p>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Lost</option><option>Found</option><option>Facility</option><option>Other</option>
          </select>
          <label>What happened?</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Filing ticket', async () => getContract(saved!, abi, signer!).createTicket(category, description))}>Submit ticket</button>
          </div>
        </section>
        <section className="card">
          <h2>Staff updates</h2>
          <p className="sub">Admins move tickets through the workflow.</p>
          <label>Ticket number</label>
          <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
          <label>New status</label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="0">Open</option>
            <option value="1">In progress</option>
            <option value="2">Resolved</option>
            <option value="3">Closed</option>
          </select>
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Updating ticket', async () => getContract(saved!, abi, signer!).updateStatus(BigInt(ticketId), Number(newStatus)))}>Update status</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const labels = ['Open','In progress','Resolved','Closed']
              const t = await getContract(saved!, abi, signer!).getTicket(BigInt(ticketId))
              setResult(`Ticket #${ticketId} · ${labels[Number(t.status)]}\n${t.category}\n${t.description}`)
            }}>View ticket</button>
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
            <h3>App setup</h3>
            <p>Organizers paste the shared app ID once. After that, everyone just signs in and uses the product.</p>
            <label>App ID</label>
            <input value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="0x…" spellCheck={false} />
            <div className="row">
              <button type="button" className="btn" onClick={saveConnection}>Save</button>
              <button type="button" className="btn secondary" onClick={() => setSettingsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>© CampusDesk</span>
        <span>Built for real campus workflows</span>
      </footer>
    </div>
  )
}

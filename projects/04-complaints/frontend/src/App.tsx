import { useCallback, useEffect, useState } from 'react'
import type { ContractTransactionResponse, JsonRpcSigner } from 'ethers'
import { formatEther, parseEther } from 'ethers'
import {
  SEPOLIA_CHAIN_ID, STORAGE_KEY, connectWallet, explorerTx, getContract, hashText,
  isAddressLike, shortAddress, switchToSepolia,
} from './ethereum'
import { abi } from './abi'
import { DEFAULT_APP_ID } from './config'

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
  const [tab, setTab] = useState<'create' | 'use'>('use')

  const isSepolia = chainId === SEPOLIA_CHAIN_ID
  const ready = Boolean(signer && saved && isSepolia && !busy)
  const setupHint = !address
    ? 'Sign in to continue'
    : !saved
      ? 'Connect the app ID in Settings before publishing'
      : !isSepolia
        ? 'Switch your wallet to Sepolia, then try again'
        : ''

  useEffect(() => {
    const fromEnv = import.meta.env.VITE_APP_ID as string | undefined
    const s =
      (fromEnv && isAddressLike(fromEnv) && fromEnv) ||
      (localStorage.getItem(STORAGE_KEY) && isAddressLike(localStorage.getItem(STORAGE_KEY)!) && localStorage.getItem(STORAGE_KEY)) ||
      (isAddressLike(DEFAULT_APP_ID) ? DEFAULT_APP_ID : '')
    if (s && isAddressLike(s)) { setAppId(s); setSaved(s) }
  }, [])

  async function signIn() {
    try {
      const w = await connectWallet()
      setAddress(w.address); setSigner(w.signer); setChainId(w.chainId)
      if (w.chainId !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia()
        const again = await connectWallet()
        setAddress(again.address); setSigner(again.signer); setChainId(again.chainId)
      }
      setStatus('')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not sign in')
    }
  }

  function saveConnection() {
    const v = appId.trim()
    if (!isAddressLike(v)) { setStatus('Paste a valid app ID'); return }
    localStorage.setItem(STORAGE_KEY, v)
    setSaved(v); setSettingsOpen(false); setStatus('App connected')
  }

  const run = useCallback(async (label: string, fn: () => Promise<ContractTransactionResponse>) => {
    if (!signer || !saved) {
      setSettingsOpen(true)
      setStatus('Sign in and connect the app ID in Settings first')
      return
    }
    if (!isSepolia) {
      setStatus('Switch your wallet to Sepolia, then retry')
      return
    }
    setBusy(true); setStatus(label + '…'); setTxHash(null)
    try {
      const tx = await fn(); setTxHash(tx.hash); setStatus('Confirming…'); await tx.wait(); setStatus(label + ' complete')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Something went wrong')
    } finally { setBusy(false) }
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
          {address ? <span className="pill">{shortAddress(address)}</span> : (
            <button type="button" className="btn" onClick={() => void signIn()}>Sign in</button>
          )}
        </div>
      </nav>

      <header className="hero">
        <div>
          <p className="kicker">Support</p>
          <h1>File a ticket. Track the fix.</h1>
          <p className="hero-lead">Lost & found and facility issues, tracked end to end.</p>
          <div className="feature-row">
            <span className="feature">Fast filing</span>
            <span className="feature">Status updates</span>
            <span className="feature">Staff workflow</span>
          </div>
        </div>
        <div className="visual" data-kind="ticket">
          <div className="visual-inner"><div className="orb" /></div>
          <div className="visual-caption">
            <strong>{address ? 'Signed in' : 'Guest mode'}</strong>
            <span>{saved ? (isSepolia || !address ? 'Ready to use' : 'Wrong network — switch to Sepolia') : 'Open Settings → paste App ID (contract address from Remix)'}</span>
          </div>
        </div>
      </header>

      {setupHint && (
        <div className="setup-banner">
          <div>
            <strong>Almost there</strong>
            <p>{setupHint}</p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (!address) void signIn()
              else setSettingsOpen(true)
            }}
          >
            {!address ? 'Sign in' : 'Open Settings'}
          </button>
        </div>
      )}

      <div className="tabs">
        <button type="button" className={tab === 'use' ? 'tab active' : 'tab'} onClick={() => setTab('use')}>Use app</button>
        <button type="button" className={tab === 'create' ? 'tab active' : 'tab'} onClick={() => setTab('create')}>Create / manage</button>
      </div>

      <div className="workspace">
        {tab === 'use' ? (
          <section className="card">
            <h2>New request</h2>
            <p className="sub">Lost ID? Broken projector? Tell us what happened.</p>
            <div className="field"><label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Lost</option><option>Found</option><option>Facility</option><option>Other</option>
              </select>
            </div>
            <div className="field"><label>Details</label><textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue…" /></div>
            <div className="row"><button type="button" className="btn" disabled={!ready} onClick={() => void run('Filing ticket', async () => getContract(saved!, abi, signer!).createTicket(category, description))}>Submit ticket</button></div>
          </section>
        ) : (
          <section className="card">
            <h2>Staff workspace</h2>
            <p className="sub">Update ticket status as you work through the queue.</p>
            <div className="field"><label>Ticket number</label><input value={ticketId} onChange={(e) => setTicketId(e.target.value)} /></div>
            <div className="field"><label>Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="0">Open</option><option value="1">In progress</option><option value="2">Resolved</option><option value="3">Closed</option>
              </select>
            </div>
            <div className="row">
              <button type="button" className="btn" disabled={!ready} onClick={() => void run('Updating', async () => getContract(saved!, abi, signer!).updateStatus(BigInt(ticketId), Number(newStatus)))}>Update status</button>
              <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
                const labels = ['Open','In progress','Resolved','Closed']
                const t = await getContract(saved!, abi, signer!).getTicket(BigInt(ticketId))
                setResult(`Ticket #${ticketId} · ${labels[Number(t.status)]}\n${t.category}\n${t.description}`)
              }}>View ticket</button>
            </div>
          </section>
        )}
      </div>

      {result && <pre className="result">{result}</pre>}

      {status && (
        <div className="toast">
          {status}
          {txHash && <> · <a href={explorerTx(txHash)} target="_blank" rel="noreferrer">View receipt</a></>}
        </div>
      )}

      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>App setup</h3>
            <p>Organizers paste the shared app ID once. After that, everyone signs in and uses the product.</p>
            <div className="field">
              <label>App ID</label>
              <input value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="0x…" spellCheck={false} />
            </div>
            <div className="row">
              <button type="button" className="btn" onClick={saveConnection}>Save</button>
              <button type="button" className="btn secondary" onClick={() => setSettingsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>© CampusDesk</span>
        <span>Made for real campus workflows</span>
      </footer>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import type { ContractTransactionResponse, JsonRpcSigner } from 'ethers'
import { formatEther, parseEther } from 'ethers'
import {
  SEPOLIA_CHAIN_ID, STORAGE_KEY, connectWallet, explorerTx, getContract, hashText,
  isAddressLike, reconnectWallet, shortAddress, switchToSepolia,
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

    let cancelled = false
    const apply = (w: { address: string; signer: import('ethers').JsonRpcSigner; chainId: bigint }) => {
      if (cancelled) return
      setAddress(w.address)
      setSigner(w.signer)
      setChainId(w.chainId)
    }
    const clear = () => {
      if (cancelled) return
      setAddress(null)
      setSigner(null)
      setChainId(null)
    }

    // Restore MetaMask session after refresh (no popup)
    void reconnectWallet().then((w) => { if (w) apply(w) }).catch(() => {})

    const eth = window.ethereum
    const onAccounts = (accounts: unknown) => {
      const list = accounts as string[]
      if (!list?.length) { clear(); return }
      void reconnectWallet().then((w) => { if (w) apply(w) }).catch(() => {})
    }
    const onChain = () => {
      void reconnectWallet().then((w) => { if (w) apply(w) }).catch(() => {})
    }
    eth?.on?.('accountsChanged', onAccounts)
    eth?.on?.('chainChanged', onChain)
    return () => {
      cancelled = true
      eth?.removeListener?.('accountsChanged', onAccounts)
      eth?.removeListener?.('chainChanged', onChain)
    }
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

  const [student, setStudent] = useState('')
  const [purpose, setPurpose] = useState('Tuition support')
  const [amountWei, setAmountWei] = useState('1000000000000000')
  const [grantId, setGrantId] = useState('0')


  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo">
          <div className="mark">G</div>
          <div>
            <strong>GrantBook</strong>
            <small>Transparency</small>
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
          <p className="kicker">Transparency</p>
          <h1>See where support goes.</h1>
          <p className="hero-lead">A public book of scholarships and fee support.</p>
          <div className="feature-row">
            <span className="feature">Public ledger</span>
            <span className="feature">Searchable entries</span>
            <span className="feature">Running totals</span>
          </div>
        </div>
        <div className="visual" data-kind="book">
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
            <h2>Look up an entry</h2>
            <p className="sub">Browse the public ledger by entry number.</p>
            <div className="field"><label>Entry number</label><input value={grantId} onChange={(e) => setGrantId(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!signer || !saved} onClick={async () => {
              const g = await getContract(saved!, abi, signer!).getGrant(BigInt(grantId))
              const total = await getContract(saved!, abi, signer!).totalRecorded()
              setResult(`${g.studentName}\n${g.purpose}\nAmount ${g.amountWei}\nLedger total ${total}`)
            }}>Open entry</button></div>
          </section>
        ) : (
          <section className="card">
            <h2>Record a grant</h2>
            <p className="sub">Publish support decisions for anyone to read.</p>
            <div className="field"><label>Student</label><input value={student} onChange={(e) => setStudent(e.target.value)} /></div>
            <div className="field"><label>Purpose</label><input value={purpose} onChange={(e) => setPurpose(e.target.value)} /></div>
            <div className="field"><label>Amount (wei)</label><input value={amountWei} onChange={(e) => setAmountWei(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!ready} onClick={() => void run('Recording', async () => getContract(saved!, abi, signer!).recordGrant(student, purpose, BigInt(amountWei)))}>Publish entry</button></div>
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
        <span>© GrantBook</span>
        <span>Made for real campus workflows</span>
      </footer>
    </div>
  )
}

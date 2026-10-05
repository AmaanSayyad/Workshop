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

  const [amount, setAmount] = useState('0.001')
  const [progress, setProgress] = useState(0)


  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo">
          <div className="mark">F</div>
          <div>
            <strong>Fundraise</strong>
            <small>Campaigns</small>
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
          <p className="kicker">Campaigns</p>
          <h1>Share the link. Watch support grow.</h1>
          <p>Raise for campus causes with a transparent tip jar.</p>
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
          <h2>Support this campaign</h2>
          <p className="sub">Every contribution is recorded. Progress updates live.</p>
          <div className="meter"><i style={{ width: `${Math.min(progress, 100)}%` }} /></div>
          <label>Amount (ETH)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Sending support', async () => getContract(saved!, abi, signer!).donate({ value: parseEther(amount) }))}>Contribute</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const i = await getContract(saved!, abi, signer!).getInfo()
              const pct = i.goal > 0n ? Number((i.raised * 100n) / i.goal) : 0
              setProgress(pct)
              setResult(`${i.name}\nRaised ${formatEther(i.raised)} / ${formatEther(i.goal)} ETH\n${i.isClosed ? 'Campaign closed' : 'Campaign open'}`)
            }}>Refresh progress</button>
          </div>
        </section>
        <section className="card">
          <h2>Campaign owner</h2>
          <p className="sub">Withdraw when you're ready to use the funds.</p>
          <div className="row">
            <button type="button" className="btn secondary" disabled={!ready} onClick={() => void run('Withdrawing funds', async () => getContract(saved!, abi, signer!).withdraw())}>Withdraw balance</button>
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
        <span>© Fundraise</span>
        <span>Built for real campus workflows</span>
      </footer>
    </div>
  )
}

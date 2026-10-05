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

  const [question, setQuestion] = useState('When should the fest be?')
  const [options, setOptions] = useState('Friday,Saturday,Sunday')
  const [pollId, setPollId] = useState('0')
  const [optionIndex, setOptionIndex] = useState('0')


  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo">
          <div className="mark">P</div>
          <div>
            <strong>Pulse</strong>
            <small>Polls</small>
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
          <p className="kicker">Polls</p>
          <h1>Ask the campus. See the pulse.</h1>
          <p>Quick campus polls with live results.</p>
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
          <h2>Ask the campus</h2>
          <p className="sub">Create a short poll with 2–5 choices.</p>
          <label>Question</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} />
          <label>Choices (comma separated)</label>
          <input value={options} onChange={(e) => setOptions(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Publishing poll', async () => {
              const opts = options.split(',').map((s) => s.trim()).filter(Boolean)
              return getContract(saved!, abi, signer!).createPoll(question, opts)
            })}>Publish poll</button>
          </div>
        </section>
        <section className="card">
          <h2>Vote</h2>
          <p className="sub">Enter the poll number and the choice index (0 for first option).</p>
          <label>Poll number</label>
          <input value={pollId} onChange={(e) => setPollId(e.target.value)} />
          <label>Your choice index</label>
          <input value={optionIndex} onChange={(e) => setOptionIndex(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Recording vote', async () => getContract(saved!, abi, signer!).vote(BigInt(pollId), BigInt(optionIndex)))}>Submit vote</button>
            <button type="button" className="btn secondary" disabled={!ready} onClick={() => void run('Closing poll', async () => getContract(saved!, abi, signer!).closePoll(BigInt(pollId)))}>Close poll</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const p = await getContract(saved!, abi, signer!).getPoll(BigInt(pollId))
              setResult(`${p.question}\n\n${p.options.map((o, i) => `${o}: ${p.votes[i]}`).join('\n')}`)
            }}>Live results</button>
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
        <span>© Pulse</span>
        <span>Built for real campus workflows</span>
      </footer>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import type { ContractTransactionResponse, JsonRpcSigner } from 'ethers'
import { formatEther, parseEther } from 'ethers'
import {
  SEPOLIA_CHAIN_ID, STORAGE_KEY, assertContractDeployed, connectWallet, explorerAddress,
  explorerTx, getContract, hashText, isAddressLike, reconnectWallet, shortAddress, switchToSepolia,
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
  const setupHint = !saved
    ? 'Paste your Remix contract address below and click Connect contract'
    : !address
      ? 'Sign in with MetaMask to use the app'
      : !isSepolia
        ? 'Switch your wallet to Sepolia, then try again'
        : ''

  useEffect(() => {
    const fromEnv = import.meta.env.VITE_APP_ID as string | undefined
    const fromLs = localStorage.getItem(STORAGE_KEY)
    const s =
      (fromEnv && isAddressLike(fromEnv) && fromEnv) ||
      (fromLs && isAddressLike(fromLs) && fromLs) ||
      ''
    if (s) { setAppId(s); setSaved(s) }
    else if (isAddressLike(DEFAULT_APP_ID)) setAppId(DEFAULT_APP_ID)

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

  async function connectContract(override?: string) {
    const v = (override ?? appId).trim()
    if (!isAddressLike(v)) {
      setStatus('Paste a valid contract address from Remix (starts with 0x)')
      return
    }
    setBusy(true)
    setStatus('Checking contract on-chain…')
    try {
      await assertContractDeployed(v)
      localStorage.setItem(STORAGE_KEY, v)
      setAppId(v)
      setSaved(v)
      setSettingsOpen(false)
      setStatus('Contract connected — you can use the app now')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not connect contract')
    } finally {
      setBusy(false)
    }
  }

  function disconnectContract() {
    localStorage.removeItem(STORAGE_KEY)
    setSaved(null)
    setStatus('Contract disconnected — paste a new Remix address to reconnect')
  }

  const run = useCallback(async (label: string, fn: () => Promise<ContractTransactionResponse>) => {
    if (!signer || !saved) {
      setSettingsOpen(true)
      setStatus('Connect your Remix contract address, then sign in')
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

  const [title, setTitle] = useState('Elect Club President')
  const [proposalId, setProposalId] = useState('0')


  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo">
          <div className="mark">C</div>
          <div>
            <strong>CampusVote</strong>
            <small>Elections</small>
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
          <p className="kicker">Elections</p>
          <h1>Your club. Your vote. Clear results.</h1>
          <p className="hero-lead">Run fair campus elections everyone can trust.</p>
          <div className="feature-row">
            <span className="feature">One vote per person</span>
            <span className="feature">Live tallies</span>
            <span className="feature">Admin-controlled ballots</span>
          </div>
        </div>
        <div className="visual" data-kind="ballot">
          <div className="visual-inner"><div className="orb" /></div>
          <div className="visual-caption">
            <strong>{address ? 'Signed in' : 'Guest mode'}</strong>
            <span>{saved ? (isSepolia || !address ? 'Ready to use' : 'Wrong network — switch to Sepolia') : 'Connect your Remix contract address to get started'}</span>
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
              if (!saved) setSettingsOpen(true)
              else if (!address) void signIn()
              else void switchToSepolia()
            }}
          >
            {!saved ? 'Connect contract' : !address ? 'Sign in' : 'Switch network'}
          </button>
        </div>
      )}

      {!saved ? (
        <section className="card" style={{ marginBottom: '1rem' }}>
          <h2>Connect your contract</h2>
          <p className="sub">1) Deploy the .sol file in Remix on Sepolia · 2) Copy the contract address · 3) Paste it here and connect.</p>
          <div className="field">
            <label>Contract address from Remix</label>
            <input value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="0x…" spellCheck={false} />
          </div>
          <div className="row">
            <button type="button" className="btn" disabled={busy} onClick={() => void connectContract()}>Connect contract</button>
            {isAddressLike(DEFAULT_APP_ID) && (
              <button type="button" className="btn secondary" disabled={busy} onClick={() => void connectContract(DEFAULT_APP_ID)}>Use workshop demo</button>
            )}
          </div>
        </section>
      ) : (
        <div className="setup-banner" style={{ marginBottom: '1rem' }}>
          <div>
            <strong>Contract connected</strong>
            <p>
              <a href={explorerAddress(saved)} target="_blank" rel="noreferrer">{shortAddress(saved)}</a>
              {' '}— change anytime if you redeploy on Remix
            </p>
          </div>
          <button type="button" className="btn secondary" onClick={() => { setSettingsOpen(true) }}>Change</button>
        </div>
      )}

      <div className="tabs">
        <button type="button" className={tab === 'use' ? 'tab active' : 'tab'} onClick={() => setTab('use')}>Use app</button>
        <button type="button" className={tab === 'create' ? 'tab active' : 'tab'} onClick={() => setTab('create')}>Create / manage</button>
      </div>

      <div className="workspace">
        {tab === 'use' ? (
          <section className="card">
            <h2>Cast your vote</h2>
            <p className="sub">Enter the election number shared with you, then choose a side.</p>
            <div className="field">
              <label>Election number</label>
              <input value={proposalId} onChange={(e) => setProposalId(e.target.value)} />
            </div>
            <div className="choice-grid">
              <button type="button" className="choice yes" disabled={!ready} onClick={() => void run('Voting yes', async () => getContract(saved!, abi, signer!).vote(BigInt(proposalId), true))}>
                <b>Yes</b><span>Support this proposal</span>
              </button>
              <button type="button" className="choice no" disabled={!ready} onClick={() => void run('Voting no', async () => getContract(saved!, abi, signer!).vote(BigInt(proposalId), false))}>
                <b>No</b><span>Reject this proposal</span>
              </button>
            </div>
            <div className="row">
              <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
                const p = await getContract(saved!, abi, signer!).getProposal(BigInt(proposalId))
                setResult(`${p.title}\n\nYes  ${p.yesVotes}\nNo   ${p.noVotes}`)
              }}>See live results</button>
            </div>
          </section>
        ) : (
          <section className="card">
            <h2>Create an election</h2>
            <p className="sub">Publish a clear yes/no question for your club or class.</p>
            <div className="field">
              <label>Question</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Elect club president" />
            </div>
            <div className="row">
              <button type="button" className="btn" disabled={!ready} onClick={() => void run('Publishing', async () => getContract(saved!, abi, signer!).createProposal(title))}>Publish election</button>
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
            <h3>Connect contract</h3>
            <p>Paste the address Remix showed after you deployed on Sepolia. The app verifies bytecode, then wires every button to that contract.</p>
            <div className="field">
              <label>Contract address</label>
              <input value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="0x…" spellCheck={false} />
            </div>
            <div className="row">
              <button type="button" className="btn" disabled={busy} onClick={() => void connectContract()}>Connect contract</button>
              {saved && <button type="button" className="btn secondary" onClick={() => { disconnectContract(); setSettingsOpen(false) }}>Disconnect</button>}
              <button type="button" className="btn secondary" onClick={() => setSettingsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>© CampusVote</span>
        <span>Made for real campus workflows</span>
      </footer>
    </div>
  )
}

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
  const [contractAddr, setContractAddr] = useState('')
  const [saved, setSaved] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)

  const [title, setTitle] = useState('My DApp Mini Project')
  const [projectId, setProjectId] = useState('0')
  const [score, setScore] = useState('5')
  const [comment, setComment] = useState('Clear demo')


  const isSepolia = chainId === SEPOLIA_CHAIN_ID

  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s && isAddressLike(s)) {
      setContractAddr(s)
      setSaved(s)
    }
  }, [])

  async function connect() {
    try {
      const w = await connectWallet()
      setAddress(w.address)
      setSigner(w.signer)
      setChainId(w.chainId)
      setStatus('')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Wallet error')
    }
  }

  function saveAddress() {
    const v = contractAddr.trim()
    if (!isAddressLike(v)) {
      setStatus('Enter a valid 0x contract address')
      return
    }
    localStorage.setItem(STORAGE_KEY, v)
    setSaved(v)
    setStatus('Contract address saved')
  }

  const run = useCallback(async (label: string, fn: () => Promise<ContractTransactionResponse>) => {
    setBusy(true)
    setStatus(label)
    setTxHash(null)
    try {
      const tx = await fn()
      setTxHash(tx.hash)
      setStatus(label + ' — confirming…')
      await tx.wait()
      setStatus(label + ' — confirmed')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Tx failed')
    } finally {
      setBusy(false)
    }
  }, [])

  const ready = Boolean(signer && saved && isSepolia && !busy)

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <strong>PeerMark</strong>
          <span>Sepolia · PeerReview</span>
        </div>
        <div className="row" style={{ margin: 0 }}>
          {address && !isSepolia && (
            <button type="button" className="btn ghost" onClick={() => void switchToSepolia().then(connect)}>
              Switch Sepolia
            </button>
          )}
          {address ? <span className="pill">{shortAddress(address)}</span> : (
            <button type="button" className="btn" onClick={() => void connect()}>Connect MetaMask</button>
          )}
        </div>
      </header>

      <section className="hero">
        <span className="chip">MHSSCE · CSE AIML</span>
        <h1>PeerMark</h1>
        <p>Rate classmate projects — 1 to 5, once</p>
      </section>

      <section className="panel">
        <h3>Contract</h3>
        <p className="muted">Deploy <code>PeerReview.sol</code> in Remix on Sepolia, then paste the address.</p>
        <div className="row">
          <input value={contractAddr} onChange={(e) => setContractAddr(e.target.value)} placeholder="0x…" spellCheck={false} />
          <button type="button" className="btn" onClick={saveAddress}>Save</button>
        </div>
      </section>


      <section className="panel">
        <h3>Submit</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Submit', async () => getContract(saved!, abi, signer!).submitProject(title))}>Submit project</button>
        </div>
      </section>
      <section className="panel">
        <h3>Rate <span className="stars">{'★'.repeat(Math.min(5, Math.max(1, Number(score) || 1)))}</span></h3>
        <p className="muted">Use a second MetaMask account — self-rate is blocked.</p>
        <label>Project id</label>
        <input value={projectId} onChange={(e) => setProjectId(e.target.value)} />
        <label>Score 1–5</label>
        <input value={score} onChange={(e) => setScore(e.target.value)} />
        <label>Comment</label>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Rate', async () => getContract(saved!, abi, signer!).rate(BigInt(projectId), Number(score), comment))}>Rate</button>
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const a = await getContract(saved!, abi, signer!).getAverage(BigInt(projectId))
            const p = await getContract(saved!, abi, signer!).getProject(BigInt(projectId))
            setOut(`${p.title}\nAvg ${(Number(a.avgTimes100) / 100).toFixed(2)} (${a.count} ratings)`)
          }}>Average</button>
        </div>
      </section>


      {(status || txHash) && (
        <div className="status">
          {status}
          {txHash && (
            <>
              {'\n'}Tx: <a href={explorerTx(txHash)} target="_blank" rel="noreferrer">{txHash.slice(0, 10)}…</a>
            </>
          )}
        </div>
      )}
      {out && <pre className="out">{out}</pre>}

      <p className="footer">See this folder&apos;s README.md for deep Solidity notes, submission checklist, and viva questions.</p>
    </div>
  )
}

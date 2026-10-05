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

  const [name, setName] = useState('Web3 Lab Hour')
  const [sessionId, setSessionId] = useState('0')


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
          <strong>CheckIn Lab</strong>
          <span>Sepolia · AttendanceCheckIn</span>
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
        <h1>CheckIn Lab</h1>
        <p>Wallet-proven class & event attendance</p>
      </section>

      <section className="panel">
        <h3>Contract</h3>
        <p className="muted">Deploy <code>AttendanceCheckIn.sol</code> in Remix on Sepolia, then paste the address.</p>
        <div className="row">
          <input value={contractAddr} onChange={(e) => setContractAddr(e.target.value)} placeholder="0x…" spellCheck={false} />
          <button type="button" className="btn" onClick={saveAddress}>Save</button>
        </div>
      </section>


      <section className="panel">
        <h3>Session control</h3>
        <label>Session name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Create session', async () => getContract(saved!, abi, signer!).createSession(name))}>Open session</button>
        </div>
        <label>Session id</label>
        <input value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Check in', async () => getContract(saved!, abi, signer!).checkIn(BigInt(sessionId)))}>Check in</button>
          <button type="button" className="btn ghost" disabled={!ready} onClick={() => void run('Close', async () => getContract(saved!, abi, signer!).closeSession(BigInt(sessionId)))}>Close</button>
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const s = await getContract(saved!, abi, signer!).getSession(BigInt(sessionId))
            setOut(`${s.name}\nOpen: ${s.open}\nPresent: ${s.count}`)
          }}>Attendance count</button>
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

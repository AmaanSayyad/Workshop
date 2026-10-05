import { useWallet } from '../context/WalletContext'

export function WalletBar() {
  const { address, short, connecting, isSepolia, error, connect, ensureSepolia } = useWallet()

  return (
    <div className="wallet-bar">
      <div className="wallet-meta">
        <span className="brand-mark">MHSSCE Web3 Lab</span>
        <span className="muted">Sepolia DApp Workshop</span>
      </div>
      <div className="wallet-actions">
        {error && <span className="error-text">{error}</span>}
        {address && !isSepolia && (
          <button type="button" className="btn btn-warn" onClick={() => void ensureSepolia()}>
            Switch to Sepolia
          </button>
        )}
        {address ? (
          <span className="pill">{short}</span>
        ) : (
          <button type="button" className="btn" disabled={connecting} onClick={() => void connect()}>
            {connecting ? 'Connecting…' : 'Connect MetaMask'}
          </button>
        )}
      </div>
    </div>
  )
}

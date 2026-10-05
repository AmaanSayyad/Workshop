import { explorerTx } from '../lib/ethereum'

type Props = {
  status: string
  txHash?: string | null
}

export function StatusBox({ status, txHash }: Props) {
  if (!status && !txHash) return null
  return (
    <div className="status-box">
      {status && <p>{status}</p>}
      {txHash && (
        <p>
          Tx:{' '}
          <a href={explorerTx(txHash)} target="_blank" rel="noreferrer">
            {txHash.slice(0, 10)}…{txHash.slice(-8)}
          </a>
        </p>
      )}
    </div>
  )
}

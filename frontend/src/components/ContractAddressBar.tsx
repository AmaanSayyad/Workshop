import { useEffect, useState } from 'react'
import { isAddressLike, storageKey } from '../lib/ethereum'

type Props = {
  slug: string
  onReady: (address: string) => void
}

export function ContractAddressBar({ slug, onReady }: Props) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(storageKey(slug))
    if (saved && isAddressLike(saved)) {
      setValue(saved)
      onReady(saved)
    }
  }, [slug, onReady])

  function save() {
    const trimmed = value.trim()
    if (!isAddressLike(trimmed)) {
      alert('Enter a valid contract address (0x + 40 hex chars)')
      return
    }
    localStorage.setItem(storageKey(slug), trimmed)
    onReady(trimmed)
  }

  return (
    <div className="panel">
      <h3>1. Paste your Remix-deployed contract address</h3>
      <p className="muted">
        Deploy the matching <code>.sol</code> file on Sepolia, then paste the address here. It is saved in
        this browser.
      </p>
      <div className="row">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0xYourContractAddress..."
          spellCheck={false}
        />
        <button type="button" className="btn" onClick={save}>
          Save & Use
        </button>
      </div>
    </div>
  )
}

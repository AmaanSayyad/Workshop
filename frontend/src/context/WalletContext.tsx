import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  SEPOLIA_CHAIN_ID,
  connectWallet,
  shortAddress,
  switchToSepolia,
} from '../lib/ethereum'
import type { JsonRpcSigner } from 'ethers'

type WalletState = {
  address: string | null
  short: string | null
  chainId: bigint | null
  isSepolia: boolean
  connecting: boolean
  error: string | null
  signer: JsonRpcSigner | null
  connect: () => Promise<void>
  ensureSepolia: () => Promise<void>
}

const WalletContext = createContext<WalletState | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<bigint | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const { address: addr, signer: s, chainId: cid } = await connectWallet()
      setAddress(addr)
      setSigner(s)
      setChainId(cid)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Wallet error')
    }
  }, [])

  const connect = useCallback(async () => {
    setConnecting(true)
    setError(null)
    try {
      await refresh()
    } finally {
      setConnecting(false)
    }
  }, [refresh])

  const ensureSepolia = useCallback(async () => {
    await switchToSepolia()
    await refresh()
  }, [refresh])

  useEffect(() => {
    if (!window.ethereum?.on) return
    const onAccounts = () => {
      void refresh()
    }
    const onChain = () => {
      void refresh()
    }
    window.ethereum.on('accountsChanged', onAccounts)
    window.ethereum.on('chainChanged', onChain)
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', onAccounts)
      window.ethereum?.removeListener?.('chainChanged', onChain)
    }
  }, [refresh])

  const value = useMemo<WalletState>(
    () => ({
      address,
      short: address ? shortAddress(address) : null,
      chainId,
      isSepolia: chainId === SEPOLIA_CHAIN_ID,
      connecting,
      error,
      signer,
      connect,
      ensureSepolia,
    }),
    [address, chainId, connecting, error, signer, connect, ensureSepolia],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}

import { BrowserProvider, Contract, JsonRpcProvider, JsonRpcSigner, keccak256, toUtf8Bytes } from 'ethers'

export const SEPOLIA_CHAIN_ID = 11155111n
export const SEPOLIA_HEX = '0xaa36a7'
export const STORAGE_KEY = 'app-connection-id'
const PUBLIC_SEPOLIA_RPC = 'https://rpc.sepolia.org'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
    }
  }
}

export type WalletSession = {
  address: string
  signer: JsonRpcSigner
  chainId: bigint
}

export function shortAddress(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`
}

export function isAddressLike(v: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(v.trim())
}

async function sessionFromProvider(provider: BrowserProvider): Promise<WalletSession> {
  const signer = await provider.getSigner()
  const network = await provider.getNetwork()
  return { address: await signer.getAddress(), signer, chainId: network.chainId }
}

/** Silent reconnect after refresh — eth_accounts, no popup. */
export async function reconnectWallet(): Promise<WalletSession | null> {
  if (!window.ethereum) return null
  const provider = new BrowserProvider(window.ethereum)
  const accounts = (await provider.send('eth_accounts', [])) as string[]
  if (!accounts.length) return null
  return sessionFromProvider(provider)
}

/** First-time / explicit Sign in — may show MetaMask popup. */
export async function connectWallet(): Promise<WalletSession> {
  if (!window.ethereum) throw new Error('Install a wallet to sign in')
  const provider = new BrowserProvider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  return sessionFromProvider(provider)
}

/**
 * Confirm bytecode exists at address (Remix deploy succeeded).
 * Uses MetaMask if present, otherwise a public Sepolia RPC.
 */
export async function assertContractDeployed(address: string) {
  const provider = window.ethereum
    ? new BrowserProvider(window.ethereum)
    : new JsonRpcProvider(PUBLIC_SEPOLIA_RPC)
  const code = await provider.getCode(address.trim())
  if (!code || code === '0x') {
    throw new Error(
      'No contract found at that address. Deploy on Remix (Injected Provider → Sepolia), then paste the new address.',
    )
  }
}

export async function switchToSepolia() {
  if (!window.ethereum) throw new Error('Wallet not found')
  try {
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: SEPOLIA_HEX }] })
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: SEPOLIA_HEX,
          chainName: 'Sepolia',
          nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://rpc.sepolia.org'],
          blockExplorerUrls: ['https://sepolia.etherscan.io'],
        }],
      })
    } else throw err
  }
}

export function getContract(address: string, abi: readonly string[], signer: JsonRpcSigner) {
  return new Contract(address, abi, signer)
}

export function hashText(text: string) {
  return keccak256(toUtf8Bytes(text))
}

export function explorerTx(hash: string) {
  return `https://sepolia.etherscan.io/tx/${hash}`
}

export function explorerAddress(address: string) {
  return `https://sepolia.etherscan.io/address/${address}`
}

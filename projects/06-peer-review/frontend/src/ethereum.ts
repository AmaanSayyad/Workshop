import { BrowserProvider, Contract, JsonRpcSigner, keccak256, toUtf8Bytes } from 'ethers'

export const SEPOLIA_CHAIN_ID = 11155111n
export const SEPOLIA_HEX = '0xaa36a7'
export const STORAGE_KEY = 'app-connection-id'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
    }
  }
}

export function shortAddress(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`
}

export function isAddressLike(v: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(v.trim())
}

export async function connectWallet() {
  if (!window.ethereum) throw new Error('A wallet extension is required to sign in')
  const provider = new BrowserProvider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()
  const network = await provider.getNetwork()
  return { address: await signer.getAddress(), signer, chainId: network.chainId }
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

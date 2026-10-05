import { BrowserProvider, Contract, JsonRpcSigner, keccak256, toUtf8Bytes } from 'ethers'

export const SEPOLIA_CHAIN_ID = 11155111n
export const SEPOLIA_HEX = '0xaa36a7'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
      isMetaMask?: boolean
    }
  }
}

export function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function isAddressLike(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim())
}

export async function getProvider() {
  if (!window.ethereum) throw new Error('MetaMask not found. Install MetaMask and refresh.')
  return new BrowserProvider(window.ethereum)
}

export async function connectWallet(): Promise<{ address: string; signer: JsonRpcSigner; chainId: bigint }> {
  const provider = await getProvider()
  await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()
  const network = await provider.getNetwork()
  const address = await signer.getAddress()
  return { address, signer, chainId: network.chainId }
}

export async function switchToSepolia() {
  if (!window.ethereum) throw new Error('MetaMask not found')
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_HEX }],
    })
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code
    if (code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: SEPOLIA_HEX,
            chainName: 'Sepolia',
            nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      })
    } else {
      throw err
    }
  }
}

export function getContract(address: string, abi: readonly string[], signerOrProvider: JsonRpcSigner | BrowserProvider) {
  return new Contract(address, abi, signerOrProvider)
}

/** Hash arbitrary text the same way Solidity keccak256(bytes) would for utf8. */
export function hashText(text: string) {
  return keccak256(toUtf8Bytes(text))
}

export function explorerTx(hash: string) {
  return `https://sepolia.etherscan.io/tx/${hash}`
}

export function explorerAddress(address: string) {
  return `https://sepolia.etherscan.io/address/${address}`
}

export function storageKey(slug: string) {
  return `workshop-contract-${slug}`
}

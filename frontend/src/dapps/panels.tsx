import { useCallback, useState, type JSX, type ReactNode } from 'react'
import { formatEther, parseEther, type ContractTransactionResponse } from 'ethers'
import { useWallet } from '../context/WalletContext'
import { ContractAddressBar } from '../components/ContractAddressBar'
import { StatusBox } from '../components/StatusBox'
import { getContract, hashText } from '../lib/ethereum'
import {
  aiModelAbi,
  attendanceAbi,
  certificateAbi,
  complaintAbi,
  crowdfundAbi,
  inventoryAbi,
  peerReviewAbi,
  pollAbi,
  scholarshipAbi,
  votingAbi,
} from '../lib/abis'

const STATUS_LABELS = ['Open', 'InProgress', 'Resolved', 'Closed']

function useTx() {
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const run = useCallback(async (label: string, fn: () => Promise<ContractTransactionResponse>) => {
    setStatus(label)
    setTxHash(null)
    try {
      const tx = await fn()
      setTxHash(tx.hash)
      setStatus(`${label} — waiting for confirmation…`)
      await tx.wait()
      setStatus(`${label} — confirmed`)
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Transaction failed')
    }
  }, [])
  return { status, txHash, run, setStatus }
}

type ShellProps = {
  slug: string
  children: (address: string) => ReactNode
}

function DappShell({ slug, children }: ShellProps) {
  const [address, setAddress] = useState<string | null>(null)
  const onReady = useCallback((a: string) => setAddress(a), [])
  return (
    <div className="dapp-stack">
      <ContractAddressBar slug={slug} onReady={onReady} />
      {address ? children(address) : <p className="muted">Save a contract address to unlock actions.</p>}
    </div>
  )
}

export function VotingPanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [title, setTitle] = useState('Elect Club President')
  const [proposalId, setProposalId] = useState('0')
  const [out, setOut] = useState('')

  return (
    <DappShell slug="voting">
      {(contractAddr) => (
        <>
          <div className="panel">
            <h3>2. Interact</h3>
            {!address && <p className="error-text">Connect MetaMask first.</p>}
            {address && !isSepolia && <p className="error-text">Switch to Sepolia.</p>}
            <label>Proposal title (owner only)</label>
            <div className="row">
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
              <button
                type="button"
                className="btn"
                disabled={!signer || !isSepolia}
                onClick={() =>
                  void run('createProposal', async () => {
                    const c = getContract(contractAddr, votingAbi, signer!)
                    const tx = await c.createProposal(title)
                    return tx
                  })
                }
              >
                Create proposal
              </button>
            </div>
            <label>Proposal id</label>
            <input value={proposalId} onChange={(e) => setProposalId(e.target.value)} />
            <div className="row">
              <button
                type="button"
                className="btn"
                disabled={!signer || !isSepolia}
                onClick={() =>
                  void run('vote YES', async () => {
                    const c = getContract(contractAddr, votingAbi, signer!)
                    return c.vote(BigInt(proposalId), true)
                  })
                }
              >
                Vote YES
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!signer || !isSepolia}
                onClick={() =>
                  void run('vote NO', async () => {
                    const c = getContract(contractAddr, votingAbi, signer!)
                    return c.vote(BigInt(proposalId), false)
                  })
                }
              >
                Vote NO
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!signer}
                onClick={async () => {
                  try {
                    const c = getContract(contractAddr, votingAbi, signer!)
                    const p = await c.getProposal(BigInt(proposalId))
                    setOut(`Title: ${p.title} | Yes: ${p.yesVotes} | No: ${p.noVotes} | Exists: ${p.exists}`)
                    setStatus('Read proposal')
                  } catch (e) {
                    setStatus(e instanceof Error ? e.message : 'Read failed')
                  }
                }}
              >
                Read proposal
              </button>
            </div>
            {out && <pre className="out">{out}</pre>}
            <StatusBox status={status} txHash={txHash} />
          </div>
        </>
      )}
    </DappShell>
  )
}

export function AttendancePanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [name, setName] = useState('Web3 Workshop Session')
  const [sessionId, setSessionId] = useState('0')
  const [out, setOut] = useState('')

  return (
    <DappShell slug="attendance">
      {(contractAddr) => (
        <div className="panel">
          <h3>2. Interact</h3>
          {!address && <p className="error-text">Connect MetaMask first.</p>}
          <label>Session name (owner)</label>
          <div className="row">
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <button
              type="button"
              className="btn"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('createSession', async () => {
                  const c = getContract(contractAddr, attendanceAbi, signer!)
                  return c.createSession(name)
                })
              }
            >
              Create session
            </button>
          </div>
          <label>Session id</label>
          <input value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
          <div className="row">
            <button
              type="button"
              className="btn"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('checkIn', async () => {
                  const c = getContract(contractAddr, attendanceAbi, signer!)
                  return c.checkIn(BigInt(sessionId))
                })
              }
            >
              Check in
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('closeSession', async () => {
                  const c = getContract(contractAddr, attendanceAbi, signer!)
                  return c.closeSession(BigInt(sessionId))
                })
              }
            >
              Close session
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer}
              onClick={async () => {
                const c = getContract(contractAddr, attendanceAbi, signer!)
                const s = await c.getSession(BigInt(sessionId))
                setOut(
                  `Name: ${s.name} | Open: ${s.open} | Count: ${s.count} | Start: ${s.startTime}`,
                )
                setStatus('Read session')
              }}
            >
              Read session
            </button>
          </div>
          {out && <pre className="out">{out}</pre>}
          <StatusBox status={status} txHash={txHash} />
        </div>
      )}
    </DappShell>
  )
}

export function CertificatePanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [student, setStudent] = useState('Amaan Sayyad')
  const [course, setCourse] = useState('Blockchain Technologies Lab')
  const [content, setContent] = useState('Certificate: BE CSE AIML — Web3 Workshop 2026')
  const [out, setOut] = useState('')

  return (
    <DappShell slug="certificate">
      {(contractAddr) => {
        const docHash = hashText(content)
        return (
          <div className="panel">
            <h3>2. Interact</h3>
            {!address && <p className="error-text">Connect MetaMask first.</p>}
            <label>Certificate text (hashed client-side)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
            <p className="muted">
              keccak256 → <code>{docHash}</code>
            </p>
            <label>Student name</label>
            <input value={student} onChange={(e) => setStudent(e.target.value)} />
            <label>Course name</label>
            <input value={course} onChange={(e) => setCourse(e.target.value)} />
            <div className="row">
              <button
                type="button"
                className="btn"
                disabled={!signer || !isSepolia}
                onClick={() =>
                  void run('issueCertificate', async () => {
                    const c = getContract(contractAddr, certificateAbi, signer!)
                    return c.issueCertificate(student, course, docHash)
                  })
                }
              >
                Issue (owner)
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!signer}
                onClick={async () => {
                  const c = getContract(contractAddr, certificateAbi, signer!)
                  const v = await c.verify(docHash)
                  setOut(
                    `Valid: ${v.valid} | Id: ${v.id} | Student: ${v.studentName} | Course: ${v.courseName} | Revoked: ${v.revoked}`,
                  )
                  setStatus('Verified hash')
                }}
              >
                Verify hash
              </button>
            </div>
            {out && <pre className="out">{out}</pre>}
            <StatusBox status={status} txHash={txHash} />
          </div>
        )
      }}
    </DappShell>
  )
}

export function ComplaintPanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [category, setCategory] = useState('Lost')
  const [description, setDescription] = useState('Lost ID card near Seminar Hall')
  const [ticketId, setTicketId] = useState('0')
  const [newStatus, setNewStatus] = useState('1')
  const [out, setOut] = useState('')

  return (
    <DappShell slug="complaints">
      {(contractAddr) => (
        <div className="panel">
          <h3>2. Interact</h3>
          {!address && <p className="error-text">Connect MetaMask first.</p>}
          <label>Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <button
            type="button"
            className="btn"
            disabled={!signer || !isSepolia}
            onClick={() =>
              void run('createTicket', async () => {
                const c = getContract(contractAddr, complaintAbi, signer!)
                return c.createTicket(category, description)
              })
            }
          >
            Create ticket
          </button>
          <label>Ticket id</label>
          <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
          <label>New status (0 Open, 1 InProgress, 2 Resolved, 3 Closed)</label>
          <div className="row">
            <input value={newStatus} onChange={(e) => setNewStatus(e.target.value)} />
            <button
              type="button"
              className="btn"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('updateStatus', async () => {
                  const c = getContract(contractAddr, complaintAbi, signer!)
                  return c.updateStatus(BigInt(ticketId), Number(newStatus))
                })
              }
            >
              Update status (owner)
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer}
              onClick={async () => {
                const c = getContract(contractAddr, complaintAbi, signer!)
                const t = await c.getTicket(BigInt(ticketId))
                setOut(
                  `Reporter: ${t.reporter}\nCategory: ${t.category}\nDesc: ${t.description}\nStatus: ${STATUS_LABELS[Number(t.status)] ?? t.status}`,
                )
                setStatus('Read ticket')
              }}
            >
              Read ticket
            </button>
          </div>
          {out && <pre className="out">{out}</pre>}
          <StatusBox status={status} txHash={txHash} />
        </div>
      )}
    </DappShell>
  )
}

export function CrowdfundPanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [amount, setAmount] = useState('0.001')
  const [out, setOut] = useState('')

  return (
    <DappShell slug="crowdfund">
      {(contractAddr) => (
        <div className="panel">
          <h3>2. Interact</h3>
          <p className="muted">
            Remix constructor example: <code>"Campus Innovation Fund", 1000000000000000</code>
          </p>
          {!address && <p className="error-text">Connect MetaMask first.</p>}
          <label>Donate amount (ETH)</label>
          <div className="row">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button
              type="button"
              className="btn"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('donate', async () => {
                  const c = getContract(contractAddr, crowdfundAbi, signer!)
                  return c.donate({ value: parseEther(amount) })
                })
              }
            >
              Donate
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('withdraw', async () => {
                  const c = getContract(contractAddr, crowdfundAbi, signer!)
                  return c.withdraw()
                })
              }
            >
              Withdraw (owner)
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer}
              onClick={async () => {
                const c = getContract(contractAddr, crowdfundAbi, signer!)
                const info = await c.getInfo()
                setOut(
                  `Name: ${info.name}\nGoal: ${formatEther(info.goal)} ETH\nRaised: ${formatEther(info.raised)} ETH\nBalance: ${formatEther(info.balance)} ETH\nClosed: ${info.isClosed}`,
                )
                setStatus('Read campaign')
              }}
            >
              Read info
            </button>
          </div>
          {out && <pre className="out">{out}</pre>}
          <StatusBox status={status} txHash={txHash} />
        </div>
      )}
    </DappShell>
  )
}

export function PeerReviewPanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [title, setTitle] = useState('My DApp Mini Project')
  const [projectId, setProjectId] = useState('0')
  const [score, setScore] = useState('5')
  const [comment, setComment] = useState('Clear demo and good README')
  const [out, setOut] = useState('')

  return (
    <DappShell slug="peer-review">
      {(contractAddr) => (
        <div className="panel">
          <h3>2. Interact</h3>
          <p className="muted">Use two MetaMask accounts: one submits, another rates.</p>
          {!address && <p className="error-text">Connect MetaMask first.</p>}
          <label>Project title</label>
          <div className="row">
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <button
              type="button"
              className="btn"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('submitProject', async () => {
                  const c = getContract(contractAddr, peerReviewAbi, signer!)
                  return c.submitProject(title)
                })
              }
            >
              Submit project
            </button>
          </div>
          <label>Project id</label>
          <input value={projectId} onChange={(e) => setProjectId(e.target.value)} />
          <label>Score (1–5)</label>
          <input value={score} onChange={(e) => setScore(e.target.value)} />
          <label>Comment</label>
          <input value={comment} onChange={(e) => setComment(e.target.value)} />
          <div className="row">
            <button
              type="button"
              className="btn"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('rate', async () => {
                  const c = getContract(contractAddr, peerReviewAbi, signer!)
                  return c.rate(BigInt(projectId), Number(score), comment)
                })
              }
            >
              Rate
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer}
              onClick={async () => {
                const c = getContract(contractAddr, peerReviewAbi, signer!)
                const avg = await c.getAverage(BigInt(projectId))
                const p = await c.getProject(BigInt(projectId))
                setOut(
                  `Title: ${p.title}\nSubmitter: ${p.submitter}\nAvg: ${(Number(avg.avgTimes100) / 100).toFixed(2)} (${avg.count} ratings)`,
                )
                setStatus('Read project')
              }}
            >
              Read average
            </button>
          </div>
          {out && <pre className="out">{out}</pre>}
          <StatusBox status={status} txHash={txHash} />
        </div>
      )}
    </DappShell>
  )
}

export function ScholarshipPanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [student, setStudent] = useState('Student Name')
  const [purpose, setPurpose] = useState('Tuition')
  const [amountWei, setAmountWei] = useState('1000000000000000')
  const [grantId, setGrantId] = useState('0')
  const [out, setOut] = useState('')

  return (
    <DappShell slug="scholarship">
      {(contractAddr) => (
        <div className="panel">
          <h3>2. Interact</h3>
          {!address && <p className="error-text">Connect MetaMask first.</p>}
          <label>Student name</label>
          <input value={student} onChange={(e) => setStudent(e.target.value)} />
          <label>Purpose</label>
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <label>Amount (wei)</label>
          <input value={amountWei} onChange={(e) => setAmountWei(e.target.value)} />
          <div className="row">
            <button
              type="button"
              className="btn"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('recordGrant', async () => {
                  const c = getContract(contractAddr, scholarshipAbi, signer!)
                  return c.recordGrant(student, purpose, BigInt(amountWei))
                })
              }
            >
              Record grant (owner)
            </button>
          </div>
          <label>Grant id</label>
          <div className="row">
            <input value={grantId} onChange={(e) => setGrantId(e.target.value)} />
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer}
              onClick={async () => {
                const c = getContract(contractAddr, scholarshipAbi, signer!)
                const g = await c.getGrant(BigInt(grantId))
                const total = await c.totalRecorded()
                setOut(
                  `Student: ${g.studentName}\nPurpose: ${g.purpose}\nAmount wei: ${g.amountWei}\nTotal recorded: ${total}`,
                )
                setStatus('Read grant')
              }}
            >
              Read grant
            </button>
          </div>
          {out && <pre className="out">{out}</pre>}
          <StatusBox status={status} txHash={txHash} />
        </div>
      )}
    </DappShell>
  )
}

export function InventoryPanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [name, setName] = useState('Arduino Kit #12')
  const [location, setLocation] = useState('L3 Lab Shelf B')
  const [custodian, setCustodian] = useState('')
  const [itemId, setItemId] = useState('0')
  const [to, setTo] = useState('')
  const [out, setOut] = useState('')

  return (
    <DappShell slug="inventory">
      {(contractAddr) => (
        <div className="panel">
          <h3>2. Interact</h3>
          {!address && <p className="error-text">Connect MetaMask first.</p>}
          <label>Item name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
          <label>Custodian address</label>
          <input
            value={custodian}
            onChange={(e) => setCustodian(e.target.value)}
            placeholder={address ?? '0x...'}
          />
          <button
            type="button"
            className="btn"
            disabled={!signer || !isSepolia}
            onClick={() =>
              void run('addItem', async () => {
                const c = getContract(contractAddr, inventoryAbi, signer!)
                const who = custodian.trim() || address!
                return c.addItem(name, location, who)
              })
            }
          >
            Add item (owner)
          </button>
          <label>Item id</label>
          <input value={itemId} onChange={(e) => setItemId(e.target.value)} />
          <label>Transfer to address</label>
          <div className="row">
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x..." />
            <button
              type="button"
              className="btn"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('transferCustody', async () => {
                  const c = getContract(contractAddr, inventoryAbi, signer!)
                  return c.transferCustody(BigInt(itemId), to.trim())
                })
              }
            >
              Transfer custody
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('updateLocation', async () => {
                  const c = getContract(contractAddr, inventoryAbi, signer!)
                  return c.updateLocation(BigInt(itemId), location)
                })
              }
            >
              Update location
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer}
              onClick={async () => {
                const c = getContract(contractAddr, inventoryAbi, signer!)
                const i = await c.getItem(BigInt(itemId))
                setOut(`Name: ${i.name}\nLocation: ${i.location}\nCustodian: ${i.custodian}`)
                setStatus('Read item')
              }}
            >
              Read item
            </button>
          </div>
          {out && <pre className="out">{out}</pre>}
          <StatusBox status={status} txHash={txHash} />
        </div>
      )}
    </DappShell>
  )
}

export function PollPanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [question, setQuestion] = useState('Best slot for hackathon?')
  const [options, setOptions] = useState('Friday,Saturday,Sunday')
  const [pollId, setPollId] = useState('0')
  const [optionIndex, setOptionIndex] = useState('0')
  const [out, setOut] = useState('')

  return (
    <DappShell slug="poll">
      {(contractAddr) => (
        <div className="panel">
          <h3>2. Interact</h3>
          {!address && <p className="error-text">Connect MetaMask first.</p>}
          <label>Question</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} />
          <label>Options (comma-separated, 2–5)</label>
          <input value={options} onChange={(e) => setOptions(e.target.value)} />
          <button
            type="button"
            className="btn"
            disabled={!signer || !isSepolia}
            onClick={() =>
              void run('createPoll', async () => {
                const c = getContract(contractAddr, pollAbi, signer!)
                const opts = options
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                return c.createPoll(question, opts)
              })
            }
          >
            Create poll (owner)
          </button>
          <label>Poll id</label>
          <input value={pollId} onChange={(e) => setPollId(e.target.value)} />
          <label>Option index</label>
          <div className="row">
            <input value={optionIndex} onChange={(e) => setOptionIndex(e.target.value)} />
            <button
              type="button"
              className="btn"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('vote', async () => {
                  const c = getContract(contractAddr, pollAbi, signer!)
                  return c.vote(BigInt(pollId), BigInt(optionIndex))
                })
              }
            >
              Vote
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer || !isSepolia}
              onClick={() =>
                void run('closePoll', async () => {
                  const c = getContract(contractAddr, pollAbi, signer!)
                  return c.closePoll(BigInt(pollId))
                })
              }
            >
              Close poll
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!signer}
              onClick={async () => {
                const c = getContract(contractAddr, pollAbi, signer!)
                const p = await c.getPoll(BigInt(pollId))
                const lines = p.options.map(
                  (opt: string, i: number) => `${i}. ${opt} → ${p.votes[i]} votes`,
                )
                setOut(`Q: ${p.question}\nOpen: ${p.open}\n${lines.join('\n')}`)
                setStatus('Read poll')
              }}
            >
              Read results
            </button>
          </div>
          {out && <pre className="out">{out}</pre>}
          <StatusBox status={status} txHash={txHash} />
        </div>
      )}
    </DappShell>
  )
}

export function AIModelPanel() {
  const { signer, address, isSepolia } = useWallet()
  const { status, txHash, run, setStatus } = useTx()
  const [name, setName] = useState('CampusSentimentBERT')
  const [version, setVersion] = useState('1.0.0')
  const [framework, setFramework] = useState('PyTorch')
  const [manifest, setManifest] = useState(
    'model=CampusSentimentBERT;dataset=mhssce-reviews-2026;acc=0.91',
  )
  const [out, setOut] = useState('')

  return (
    <DappShell slug="ai-model">
      {(contractAddr) => {
        const contentHash = hashText(manifest)
        return (
          <div className="panel">
            <h3>2. Interact</h3>
            {!address && <p className="error-text">Connect MetaMask first.</p>}
            <label>Model name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <label>Version</label>
            <input value={version} onChange={(e) => setVersion(e.target.value)} />
            <label>Framework</label>
            <input value={framework} onChange={(e) => setFramework(e.target.value)} />
            <label>Manifest / model card text (hashed)</label>
            <textarea value={manifest} onChange={(e) => setManifest(e.target.value)} rows={3} />
            <p className="muted">
              keccak256 → <code>{contentHash}</code>
            </p>
            <div className="row">
              <button
                type="button"
                className="btn"
                disabled={!signer || !isSepolia}
                onClick={() =>
                  void run('registerModel', async () => {
                    const c = getContract(contractAddr, aiModelAbi, signer!)
                    return c.registerModel(name, version, contentHash, framework)
                  })
                }
              >
                Register model
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!signer}
                onClick={async () => {
                  const c = getContract(contractAddr, aiModelAbi, signer!)
                  const v = await c.verifyModel(contentHash)
                  setOut(
                    `Found: ${v.found}\nId: ${v.id}\nName: ${v.name}\nVersion: ${v.version}\nPublisher: ${v.publisher}`,
                  )
                  setStatus('Verified model hash')
                }}
              >
                Verify hash
              </button>
            </div>
            {out && <pre className="out">{out}</pre>}
            <StatusBox status={status} txHash={txHash} />
          </div>
        )
      }}
    </DappShell>
  )
}

export const PANEL_BY_SLUG: Record<string, () => JSX.Element> = {
  voting: VotingPanel,
  attendance: AttendancePanel,
  certificate: CertificatePanel,
  complaints: ComplaintPanel,
  crowdfund: CrowdfundPanel,
  'peer-review': PeerReviewPanel,
  scholarship: ScholarshipPanel,
  inventory: InventoryPanel,
  poll: PollPanel,
  'ai-model': AIModelPanel,
}

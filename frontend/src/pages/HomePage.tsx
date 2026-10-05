import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/projects'
import { WalletBar } from '../components/WalletBar'

export function HomePage() {
  return (
    <div className="page">
      <WalletBar />
      <header className="hero">
        <p className="eyebrow">MHSSCE · CSE (AI & ML) · Blockchain Technologies Lab</p>
        <h1>Web3 DApp Mini-Project Workshop</h1>
        <p className="lede">
          Pick any one mini-project below. Deploy its Solidity contract in Remix on Sepolia, paste the
          address here, connect MetaMask, and finish Exp 9 & 10 in one sitting. Every project is already
          in this codebase with line-by-line explanations.
        </p>
      </header>

      <section className="howto panel">
        <h2>Workshop flow (same for every project)</h2>
        <ol>
          <li>Install MetaMask → switch to <strong>Sepolia</strong> → get test ETH from a faucet.</li>
          <li>
            Open Remix → paste the matching file from `projects/<your-project>/` → Compile → Deploy with Injected Provider.
          </li>
          <li>Copy the contract address → open that project page here → Save & Use.</li>
          <li>Run the UI actions → save Etherscan tx links + screenshots for your lab index.</li>
          <li>Read the line-by-line panel and copy notes into your journal/report.</li>
        </ol>
      </section>

      <section className="grid">
        {PROJECTS.map((p) => (
          <Link key={p.id} to={`/project/${p.slug}`} className="card-link">
            <span className="num">{String(p.id).padStart(2, '0')}</span>
            <h3>{p.title}</h3>
            <p>{p.problem}</p>
            <span className="tag">{p.syllabusFit}</span>
          </Link>
        ))}
      </section>
    </div>
  )
}

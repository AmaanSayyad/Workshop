import { Link, useParams } from 'react-router-dom'
import { WalletBar } from '../components/WalletBar'
import { LineByLine } from '../components/LineByLine'
import { getProject } from '../data/projects'
import { EXPLANATIONS } from '../data/explanations'
import { PANEL_BY_SLUG } from '../dapps/panels'
import { explorerAddress } from '../lib/ethereum'
import { storageKey } from '../lib/ethereum'

export function ProjectPage() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  const Panel = PANEL_BY_SLUG[slug]
  const explain = EXPLANATIONS[slug]

  if (!project || !Panel || !explain) {
    return (
      <div className="page">
        <WalletBar />
        <p>Project not found. <Link to="/">Back home</Link></p>
      </div>
    )
  }

  const saved = localStorage.getItem(storageKey(slug))

  return (
    <div className="page">
      <WalletBar />
      <p className="crumb">
        <Link to="/">All mini-projects</Link> / {project.shortTitle}
      </p>

      <header className="project-head">
        <span className="num">#{project.id}</span>
        <h1>{project.title}</h1>
        <p className="lede">{project.problem}</p>
        <p className="muted">
          Contract file: <code>{project.contractFile}</code> · Remix constructor:{' '}
          <code>{project.remixConstructorArgs}</code>
          {saved && (
            <>
              {' '}
              · Deployed:{' '}
              <a href={explorerAddress(saved)} target="_blank" rel="noreferrer">
                {saved.slice(0, 8)}…{saved.slice(-6)}
              </a>
            </>
          )}
        </p>
      </header>

      <section className="panel">
        <h3>Student checklist</h3>
        <ol>
          {project.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <Panel />

      <LineByLine title="Line-by-line: Smart contract" lines={explain.contract} />
      <LineByLine title="Line-by-line: Frontend wiring" lines={explain.frontend} />
    </div>
  )
}

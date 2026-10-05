type Line = { line: string; explain: string }

type Props = {
  title: string
  lines: Line[]
}

export function LineByLine({ title, lines }: Props) {
  return (
    <section className="explain panel">
      <h3>{title}</h3>
      <p className="muted">Read top → bottom. Each row is one concept you can write in your lab journal.</p>
      <ol className="explain-list">
        {lines.map((item) => (
          <li key={item.line}>
            <code>{item.line}</code>
            <span>{item.explain}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

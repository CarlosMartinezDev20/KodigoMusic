import { useRef } from 'react'

export default function Row({ title, items = [], onPlay = () => {} }){
  const ref = useRef(null)
  const scrollBy = (delta) => ref.current?.scrollBy({ left: delta, behavior: 'smooth' })
  return (
    <section className="row">
      <div className="row-head">
        <h3>{title}</h3>
        <div className="row-nav">
          <button className="nav-btn left" onClick={() => scrollBy(-480)}>‹</button>
          <button className="nav-btn right" onClick={() => scrollBy(480)}>›</button>
        </div>
      </div>
      <div className="row-scroller" ref={ref}>
        {items.map((t) => (
          <div className="card square" key={t.trackId} title={t.trackName}>
            <div className="poster">
              <img src={t.artworkUrl100.replace('100x100', '300x300')} alt={t.trackName} />
              <button className="play-fab" onClick={() => onPlay(t)} title="Reproducir">▶</button>
            </div>
            <div className="meta">
              <strong className="ellipsis">{t.trackName}</strong>
              <span className="muted ellipsis">{t.collectionName}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

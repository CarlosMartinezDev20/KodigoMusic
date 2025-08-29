export default function Sidebar({ albums = [], albumArts = {}, onPickAlbum = () => {} }) {
  return (
    <aside className="sidebar">
      <div className="lib-header">
        <h3>Tu biblioteca</h3>
        <button className="btn subtle small" title="Crear playlist">＋</button>
      </div>

      <div className="lib-list">
        {albums.slice(0, 50).map((name, i) => (
          <button
            key={i}
            className="lib-item"
            onClick={() => onPickAlbum(name)}
            title={name}
          >
            <div
              className="thumb"
              style={{ backgroundImage: `url(${albumArts[name] || ''})` }}
            />
            <span className="text ellipsis">{name}</span>
          </button>
        ))}

        {albums.length === 0 && (
          <p className="muted small">Cargando álbumes…</p>
        )}
      </div>
    </aside>
  );
}

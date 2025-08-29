import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Row from '../components/Row.jsx'

const WOS_ITUNES_ID = 1428259384

export default function Home(){
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [allTracks, setAllTracks] = useState([])
  const [tracks, setTracks] = useState([])
  const [playingIndex, setPlayingIndex] = useState(-1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef(null)

  useEffect(()=>{
    const fetchWos = async () => {
      try {
        const url = `https://itunes.apple.com/lookup?id=${WOS_ITUNES_ID}&entity=song&limit=200`
        const res = await fetch(url)
        const data = await res.json()
        const list = (data.results || []).filter(r => r.wrapperType === 'track' || r.kind === 'song')
        const seen = new Set()
        const unique = list.filter(t => (seen.has(t.trackId) ? false : (seen.add(t.trackId), true)))
        const onlyWos = unique.filter(t => String(t.artistName || '').toLowerCase().includes('wos'))
        setAllTracks(onlyWos)
        setTracks(onlyWos)
      } catch(e){
        console.error(e)
      }
    }
    fetchWos()
  }, [])

  const albums = useMemo(()=>{
    const names = Array.from(new Set(allTracks.map(t=>t.collectionName).filter(Boolean)))
    return names.sort((a,b)=>a.localeCompare(b))
  }, [allTracks])

  const albumArts = useMemo(()=>{
    const m = {}
    for(const t of allTracks){
      if(!m[t.collectionName]) m[t.collectionName] = t.artworkUrl100.replace('100x100','200x200')
    }
    return m
  }, [allTracks])

  const newReleases = useMemo(()=>{
    return [...allTracks].sort((a,b)=> new Date(b.releaseDate||0) - new Date(a.releaseDate||0)).slice(0, 12)
  }, [allTracks])

  const madeForYou = useMemo(()=>{
    const shuffled = [...allTracks].sort(()=>Math.random()-0.5)
    return shuffled.slice(0, 12)
  }, [allTracks])

  const trending = useMemo(()=>{
    const shuffled = [...allTracks].sort(()=>Math.random()-0.5)
    return shuffled.slice(0, 12)
  }, [allTracks])

  useEffect(()=>{
    if (!query.trim()) { setTracks(allTracks); return }
    const q = query.toLowerCase()
    const list = allTracks.filter(t =>
      (t.trackName && t.trackName.toLowerCase().includes(q)) ||
      (t.collectionName && t.collectionName.toLowerCase().includes(q))
    )
    setTracks(list)
  }, [query, allTracks])

  useEffect(()=>{
    const a = audioRef.current
    if(!a) return
    const onTime = () => setCurrentTime(a.currentTime||0)
    const onLoaded = () => setDuration(a.duration||0)
    const onEnd = () => next()
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onLoaded)
    a.addEventListener('ended', onEnd)
    a.volume = volume
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onLoaded)
      a.removeEventListener('ended', onEnd)
    }
  }, [volume])

  const format = (s) => {
    if (!isFinite(s)) return '0:00'
    const m = Math.floor(s / 60); const ss = Math.floor(s % 60).toString().padStart(2,'0')
    return `${m}:${ss}`
  }

  const playTrack = (t) => {
    const idx = allTracks.findIndex(x => x.trackId === t.trackId)
    if (idx === -1) return
    audioRef.current.src = t.previewUrl
    audioRef.current.play()
    setPlayingIndex(idx)
  }

  const playAtIndex = (idx) => {
    if (idx < 0 || idx >= allTracks.length) return
    const t = allTracks[idx]
    if (!t?.previewUrl) return
    audioRef.current.src = t.previewUrl
    audioRef.current.play()
    setPlayingIndex(idx)
  }

  const togglePlayPause = () => {
    if (playingIndex === -1) return
    if (audioRef.current.paused) audioRef.current.play()
    else audioRef.current.pause()
  }

  const prev = () => {
    if (allTracks.length === 0) return
    const idx = playingIndex <= 0 ? allTracks.length - 1 : playingIndex - 1
    playAtIndex(idx)
  }
  const next = () => {
    if (allTracks.length === 0) return
    const idx = playingIndex >= allTracks.length - 1 ? 0 : playingIndex + 1
    playAtIndex(idx)
  }

  const onSeek = (e) => {
    const v = Number(e.target.value)
    audioRef.current.currentTime = v
    setCurrentTime(v)
  }
  const onVolume = (e) => {
    const v = Number(e.target.value)
    audioRef.current.volume = v
    setVolume(v)
    if (v>0 && muted) setMuted(false)
  }
  const toggleMute = () => {
    audioRef.current.muted = !muted
    setMuted(!muted)
  }

  const alias = (user?.email || '').split('@')[0].replace(/[._-]/g,' ') || 'ti'
  const playing = playingIndex !== -1 ? allTracks[playingIndex] : null
  const showSearchResults = Boolean(query.trim())

  const onPickAlbum = (name) => {
    const track = allTracks.find(t => t.collectionName === name && t.previewUrl)
    if (track) playTrack(track)
  }

  return (
    <div className="app-shell home-layout">
      <header className="topbar enhanced solid">
        <div className="logo">
          <img src="/logo.svg" alt="logo" />
          <span>Kodigo Music</span>
        </div>
        <div className="searchbar pill with-icon">
          <span className="mag">🔎</span>
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            onKeyDown={(e)=> e.key === 'Enter' && e.currentTarget.blur()}
            placeholder="¿Qué quieres reproducir?"
          />
          {query && <button className="btn subtle" onClick={()=>setQuery('')}>Limpiar</button>}
        </div>
        <div className="userbox">
          <span className="muted">{user?.email}</span>
          <button className="btn subtle" onClick={logout}>Salir</button>
        </div>
      </header>

      <div className="main-area">
        <Sidebar albums={albums} albumArts={albumArts} onPickAlbum={onPickAlbum} />

        <div className="center-area">
          <div className="hero-strip">
            {(albums.slice(0,8)).map((name,i)=> (
              <div key={i} className="hero-tile" onClick={()=>onPickAlbum(name)} title={name}>
                <div className="blob"></div>
                <span className="ellipsis">{name}</span>
              </div>
            ))}
          </div>

          {!showSearchResults && (
            <>
              <Row title="Lanzamientos recientes" items={newReleases} onPlay={playTrack} />
              <Row title={`Hecho para ${alias}`} items={madeForYou} onPlay={playTrack} />
              <Row title="En tendencia" items={trending} onPlay={playTrack} />
            </>
          )}

          {showSearchResults && (
            <section className="row">
              <div className="row-head">
                <h3>Resultados</h3>
              </div>
              <div className="grid">
                {tracks.map((t) => (
                  <div className="card track fancy" key={t.trackId} title={t.trackName}>
                    <div className="cover-wrap">
                      <img src={t.artworkUrl100.replace('100x100', '300x300')} alt={t.trackName} />
                    </div>
                    <div className="track-info">
                      <h3>{t.trackName}</h3>
                      <p className="muted">{t.collectionName}</p>
                    </div>
                    <div className="track-actions">
                      {t.previewUrl ? (
                        <button className="btn play" onClick={() => playTrack(t)}>
                          Reproducir
                        </button>
                      ) : (
                        <span className="muted">Sin preview</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="right-panel glass">
          {playing ? (
            <div className="now-playing card">
              <img src={playing.artworkUrl100.replace('100x100','300x300')} alt="" />
              <div className="np-info">
                <strong className="ellipsis">{playing.trackName}</strong>
                <span className="muted ellipsis">{playing.collectionName}</span>
              </div>
              <div className="np-controls">
                <button className="btn subtle" onClick={prev}>⏮</button>
                <button className="btn primary" onClick={togglePlayPause}>{audioRef.current?.paused ? '▶' : '⏸'}</button>
                <button className="btn subtle" onClick={next}>⏭</button>
                <div className="np-volume">
                  <button className="btn subtle" onClick={toggleMute}>{muted || volume===0 ? '🔇' : '🔊'}</button>
                  <input type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={onVolume} />
                </div>
              </div>
            </div>
          ) : (
            <div className="card hint">
              <p className="muted">Reproduce una canción para ver detalles aquí.</p>
            </div>
          )}
        </aside>
      </div>

      <footer className={`player full ${playing ? 'visible' : ''}`} aria-live="polite">
        {playing && (
          <div className="player-inner full glass">
            <div className="left">
              <img src={playing.artworkUrl100} alt="" />
              <div className="info">
                <strong className="ellipsis">{playing.trackName}</strong>
                <span className="muted ellipsis">{playing.collectionName}</span>
              </div>
            </div>
            <div className="center">
              <div className="controls">
                <button className="btn subtle" onClick={prev} title="Anterior">⏮</button>
                <button className="btn primary big" onClick={togglePlayPause} title="Play/Pause">
                  {audioRef.current?.paused ? '▶' : '⏸'}
                </button>
                <button className="btn subtle" onClick={next} title="Siguiente">⏭</button>
              </div>
              <div className="timeline">
                <span className="time">{format(currentTime)}</span>
                <input className="range" type="range" min="0" max={isFinite(duration)?duration:0} step="0.01" value={currentTime} onChange={onSeek} />
                <span className="time">{format(duration)}</span>
              </div>
            </div>
            <div className="right">
              <button className="btn subtle" onClick={toggleMute} title="Mute/Unmute">
                {muted || volume === 0 ? '🔇' : '🔊'}
              </button>
              <input className="vol range" type="range" min="0" max="1" step="0.01" value={muted?0:volume} onChange={onVolume} />
            </div>
          </div>
        )}
        <audio ref={audioRef} />
      </footer>
    </div>
  )
}

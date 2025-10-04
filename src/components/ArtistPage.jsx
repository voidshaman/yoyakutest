import './ArtistPage.css';

function ArtistPage({ artist }) {
  return (
    <div className="artistPage">
      <header className="artistHeader">
        <a href="/" className="backLink">INTERWAVE</a>
        <a className="aboutlink" href='/'>ARTISTS</a>
      </header>

      <h1 className="artistTitle">{artist.title.toUpperCase()}</h1>

      <div className="artistMeta">
        {artist.press_kit?.live && <a href={artist.press_kit.live}>↘ PRESS KIT LIVE</a>}
        {artist.press_kit?.dj && <a href={artist.press_kit.dj}>↘ PRESS KIT DJ</a>}
        {artist.tech_rider?.live && <a href={artist.tech_rider.live}>↘ TECH RIDER LIVE</a>}
        <span>⇲ {artist.territory}</span>
        <span>🌪 {artist.act}</span>
      </div>

      <div className="artistBio">
        {artist.bio.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="artistVideos">
        {artist.links.map((url, i) => {
          const videoId = new URL(url).searchParams.get('v');
          return (
            <iframe
              key={i}
              src={`https://www.youtube.com/embed/${videoId}`}
              title={`Video ${i}`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          );
        })}
      </div>
    </div>
  );
}

export default ArtistPage;

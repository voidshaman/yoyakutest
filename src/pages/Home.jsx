import { useEffect, useState } from 'react';
import data from '../../db/data.json';
import '../App.css';

function Home() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    setArtists(data);
  }, []);

  return (
    <div className='bgWrapper'>
      <header className='logo'>INTERWAVE</header>
      <div className='content'>
        <div className='wrap'>
          <div className='nav'>
            <p>ARTISTS</p>
            <a className='aboutlink'>ABOUT</a>
          </div>
          <main className='artistsGrid'>
            {artists.map((artist) => (
              <a key={artist.slug} href={`/artist/${artist.slug}`} className='artistName'>
                {artist.title.toUpperCase()}
              </a>
            ))}
          </main>
        </div>
      </div>
      <footer className='footer'>
        <p className='footer-left'>BOOKING@INTERWAVE.LIVE</p>
        <p className='footer-right'>@INTERWAVE.LIVE</p>
      </footer>
    </div>
  );
}

export default Home;

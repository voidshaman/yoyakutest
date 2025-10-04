// App.jsx
import Home from './pages/Home.jsx';
import ArtistPage from './components/ArtistPage.jsx';
import BackgroundGlyphFX from './components/BackgroundGlyphFX.jsx';
import data from '../db/data.json';

function App() {
  const path = window.location.pathname;
  const m = path.match(/^\/artist\/(.+)/);

  const content = m
    ? (() => {
        const artist = data.find(a => a.slug === m[1]);
        return artist ? <ArtistPage artist={artist} /> : <div>Artist not found</div>;
      })()
    : <Home />;

  return (
    <div className="bgWrapper">
      <BackgroundGlyphFX />
      <div className="siteContent">{content}</div>
    </div>
  );
}

export default App;

import Home from './pages/Home.jsx';
import ArtistPage from './components/ArtistPage.jsx';
import BackgroundFX from './components/BackgroundFX.jsx';
import data from '../db/data.json';

function App() {
  const path = window.location.pathname;
  const slugMatch = path.match(/^\/artist\/(.+)/);

  const content = (() => {
    if (slugMatch) {
      const slug = slugMatch[1];
      const artist = data.find((a) => a.slug === slug);
      if (artist) return <ArtistPage artist={artist} />;
      return <div>Artist not found</div>;
    }

    return <Home />;
  })();

  return (
    <div className="bgWrapper">
      <BackgroundFX />
      {content}
    </div>
  );
}

export default App;

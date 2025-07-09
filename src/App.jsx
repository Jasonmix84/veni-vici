import { useState } from 'react'
import './App.css'
import BanChip from './components/BanChip';
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [count, setCount] = useState(0)
  const [currentImage, setCurrentImage] = useState(null);
  const [currentBreed, setCurrentBreed] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentLifespan, setCurrentLifespan] = useState("");
  const [breedGroup, setBreedGroup] = useState("");
  const [banList, setBanList] = useState({
    breed: [],
    weight: [],
    lifespan: [],
    group: []
  });

  const removeBan = (type, value) => {
  setBanList(prev => ({
    ...prev,
    [type]: prev[type].filter(item => item !== value)
  }));
};

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    if (!json[0] || json[0].url == null || !json[0].breeds || !json[0].breeds[0]) {
      alert("Oops! Something went wrong with that query, let's try again!")
      return null;
    }
    return json[0];
  }

  const isBanned = (breedObj) => {
    return (
      banList.breed.includes(breedObj.name) ||
      banList.weight.includes(breedObj.weight.imperial) ||
      banList.lifespan.includes(breedObj.life_span) ||
      banList.group.includes(breedObj.breed_group)
    );
  };

  const submitRequest = async () => {
    let found = false;
    let tries = 0;
    while (!found && tries < 10) { // avoid infinite loop
      let query = `https://api.thedogapi.com/v1/images/search?api_key=${ACCESS_KEY}&has_breeds=1`;
      const data = await callAPI(query);
      if (!data) return;
      const breedObj = data.breeds[0];
      if (!isBanned(breedObj)) {
        setCurrentImage(data.url);
        setCurrentBreed(breedObj.name || "");
        setCurrentWeight(breedObj.weight.imperial || "");
        setCurrentLifespan(breedObj.life_span || "");
        setBreedGroup(breedObj.breed_group || "");
        found = true;
      }
      tries++;
    }
    if (!found) alert("Couldn't find a dog with allowed attributes!");
  };

  const banAttribute = (type, value) => {
    setBanList(prev => ({
      ...prev,
      [type]: [...prev[type], value]
    }));
  };

  return (
    <div className="whole-page">
      <div className='middle-screen'>
        <h1>Veni Vici!</h1>
        <p>Discover All Types of Dogs</p>
        <div className="attributes">
            <button onClick={() => banAttribute('breed', currentBreed)} disabled={!currentBreed}>
              Breed: {currentBreed || "?"}
            </button>
            <button onClick={() => banAttribute('weight', currentWeight)} disabled={!currentWeight}>
              Weight: {currentWeight || "?"}
            </button>
            <button onClick={() => banAttribute('lifespan', currentLifespan)} disabled={!currentLifespan}>
              lifespan: {currentLifespan || "?"}
            </button>
            <button onClick={() => banAttribute('group', breedGroup)} disabled={!breedGroup}>
              Group: {breedGroup || "?"}
            </button>
        </div>
        <h3>{currentBreed}</h3>
        {currentImage? (
          <img className="dog-image" width="650" height="500" src={currentImage} alt="dog" />
        ) : (<div><p>Nothing Yet</p></div>)
        }
        <div>
          <button className="discover" onClick={submitRequest}>Discover</button>
        </div>
        

      </div>
      

      <div className="ban-list-sidebar">
        <h4>Banned Attributes</h4>
        <div className="ban-group">
          <div className="ban-label">Breeds:</div>
          <div className="ban-chips">
            {banList.breed.length ? banList.breed.map((item, idx) => (
              <BanChip key={item + idx} value={item} onRemove={val => removeBan('breed', val)} />
            )) : <span className="ban-none">None</span>}
          </div>
        </div>
        <div className="ban-group">
          <div className="ban-label">Weights:</div>
          <div className="ban-chips">
            {banList.weight.length ? banList.weight.map((item, idx) => (
              <BanChip key={item + idx} value={item} onRemove={val => removeBan('weight', val)} />
            )) : <span className="ban-none">None</span>}
          </div>
        </div>
        <div className="ban-group">
          <div className="ban-label">Lifespans:</div>
          <div className="ban-chips">
            {banList.lifespan.length ? banList.lifespan.map((item, idx) => (
              <BanChip key={item + idx} value={item} onRemove={val => removeBan('lifespan', val)} />
            )) : <span className="ban-none">None</span>}
          </div>
        </div>
        <div className="ban-group">
          <div className="ban-label">Groups:</div>
          <div className="ban-chips">
            {banList.group.length ? banList.group.map((item, idx) => (
              <BanChip key={item + idx} value={item} onRemove={val => removeBan('group', val)} />
            )) : <span className="ban-none">None</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

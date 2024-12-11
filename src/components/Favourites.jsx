import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Favourites() {
  const [savedBirds, setSavedBirds] = useState(() => {
    const savedFavs = localStorage.getItem("favs");
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  useEffect(() => {
    fetch("https://api.ebird.org/v2/data/obs/geo/recent?lat=49.2827&lng=-123.1207", {
      headers: {
        "X-eBirdApiToken": "ur002gd6aek9",
      },
    })
      .then((response) => response.json())
      .then((sightingsArray) => {
        const filteredFavs = sightingsArray.filter((bird) => {
          return savedBirds.includes(bird.speciesCode);
        });

        setSavedBirds(filteredFavs);
      });
  }, []);

  return (
    <>
      <h1>These are my favourite birds!</h1>
      <ul>
        {savedBirds.map((bird) => {
          return (
            <li key={bird.speciesCode}>
              <Link to={`/bird/${bird.speciesCode}`}>{bird.comName}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default Favourites;
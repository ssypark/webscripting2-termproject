import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare as solidCheck } from "@fortawesome/free-solid-svg-icons";
import { faSquare as regularCheck } from "@fortawesome/free-regular-svg-icons";


function Home() {
    const [sightings, setSightings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [checklist, setChecklist] = useState(() => {
        const savedChecklist = localStorage.getItem("checklist");
        return savedChecklist ? JSON.parse(savedChecklist) : [];
    });
    const [birdOfTheDay, setBirdOfTheDay] = useState(null);
    const [birdImage, setBirdImage] = useState("");

    const searchBirds = () => {
        fetch("https://api.ebird.org/v2/data/obs/geo/recent?lat=49.2827&lng=-123.1207", {
            headers: {
                "X-eBirdApiToken": "ur002gd6aek9",
            },
        })
            .then((response) => response.json())
            .then((sightingsArray) => {
                const filteredSightings = sightingsArray.filter((bird) =>
                    bird.comName.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setSightings(filteredSightings);
            });
    };

    const toggleChecklist = (birdID) => {
        let updatedChecklist;

        if (checklist.includes(birdID)) {
            updatedChecklist = checklist.filter((id) => id !== birdID);
        } else {
            updatedChecklist = [...checklist, birdID];
        }

        localStorage.setItem("checklist", JSON.stringify(updatedChecklist));
        setChecklist(updatedChecklist);
    };

    useEffect(() => {
        fetch("https://api.ebird.org/v2/data/obs/geo/recent?lat=49.2827&lng=-123.1207", {
            headers: {
                "X-eBirdApiToken": "ur002gd6aek9",
            },
        })
            .then((response) => response.json())
            .then((dataObj) => {
                setSightings(dataObj);
                if (dataObj.length > 0) {
                    const randomBird = dataObj[Math.floor(Math.random() * dataObj.length)];
                    setBirdOfTheDay(randomBird);

                    fetch(`https://api.inaturalist.org/v1/search?q=${encodeURIComponent(randomBird.comName)}`)
                        .then((response) => response.json())
                        .then((imageData) => {
                            const photoUrl = imageData.results[0]?.record?.default_photo?.medium_url;
                            setBirdImage(photoUrl || "https://via.placeholder.com/600x400?text=No+Image+Available");
                        })
                        .catch(() => {
                            setBirdImage("https://via.placeholder.com/600x400?text=Error+Fetching+Image");
                        });
                }
            })
            .catch(() => {
                console.log("Error fetching bird sightings");
            });
    }, []);

    return (
        <div className="bg-roof-50 min-h-screen">
  <div className="container mx-auto p-4">
    <div className="flex justify-between items-center mb-6">

      {/* Title */}
      <h1 className="text-3xl font-bold text-roof-900">Birding Buddy</h1>
      
      {/* My Checklist Button */}
      <Link
        to="/checklist"
        className="bg-roof-400 text-roof-50 px-4 py-2 rounded-lg shadow-md hover:bg-roof-500"
      >
        My Checklist
      </Link>
    </div>

    {/* Bird of the Day */}
    {birdOfTheDay && (
      <div className="bg-roof-100 max-w-md mx-auto rounded-lg shadow-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-center text-roof-900">Bird of the Day</h2>
        <img
          src={birdImage}
          alt={`Image of ${birdOfTheDay.comName}`}
          className="mx-auto w-full max-w-xs rounded-lg shadow-md mt-4"
        />
        <div className="flex items-center justify-between mt-4">
          <h3 className="text-lg font-medium text-roof-900">{birdOfTheDay.comName}</h3>
          <Link
            to={`/bird/${birdOfTheDay.speciesCode}`}
            state={birdOfTheDay}
            className="text-sm font-semibold text-roof-600 hover:underline"
          >
            Learn More
          </Link>
        </div>
      </div>
    )}

    {/* Search Bar */}
    <div className="flex items-center mb-4">
      <input
        type="text"
        placeholder="Search for a bird"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="w-full px-4 py-2 border border-roof-400 rounded-lg focus:outline-none focus:ring focus:ring-roof-300"
      />
      <button
        onClick={searchBirds}
        className="ml-2 px-4 py-2 bg-roof-400 text-roof-50 rounded-lg hover:bg-roof-500 focus:ring focus:ring-roof-300"
      >
        Search
      </button>
    </div>

    {/* Table of Birds */}
    <table className="table-auto w-full border-collapse border border-roof-400">
      <thead>
        <tr className="bg-roof-200">
          <th className="border border-roof-400 px-4 py-2 text-left text-roof-900">Bird Name</th>
          <th className="border border-roof-400 px-4 py-2 text-right text-roof-900">Checklist</th>
        </tr>
      </thead>
      <tbody>
        {sightings.map((bird) => (
          <tr key={bird.speciesCode} className="hover:bg-roof-100">
            <td className="border border-roof-400 px-4 py-2">
              <Link
                to={`/bird/${bird.speciesCode}`}
                state={bird}
                className="text-roof-600 hover:underline"
              >
                {bird.comName}
              </Link>
            </td>
            <td className="border border-roof-400 px-4 py-2 text-right">
              <button
                onClick={() => toggleChecklist(bird.speciesCode)}
                className="text-2xl text-roof-400 hover:text-roof-700"
              >
                <FontAwesomeIcon
                  icon={checklist.includes(bird.speciesCode) ? solidCheck : regularCheck}
                />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    );
}

export default Home;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare as solidCheck } from "@fortawesome/free-solid-svg-icons";
import { faSquare as regularCheck } from "@fortawesome/free-regular-svg-icons";


function Home() {
    // This state holds a list of recent bird sightings
    const [sightings, setSightings] = useState([]);
    // This state manages the search terms by the user
    const [searchTerm, setSearchTerm] = useState("");
    // This state holds a list of birds in the user's checklist that is initially loaded from localStorage
    const [checklist, setChecklist] = useState(() => {
        // Load checklist data from localStorage and set it to an empty array if it doesn't exist
        const savedChecklist = localStorage.getItem("checklist");
        return savedChecklist ? JSON.parse(savedChecklist) : [];
    });
    // For fun, this state holds a random bird of the day for a more visually appealing experience
    const [birdOfTheDay, setBirdOfTheDay] = useState(null);
    const [birdImage, setBirdImage] = useState("");

    // This function searches for bird sightings based on the user's search term
    const searchBirds = () => {
        // For this project, I am using the EBird API to fetch bird sightings by location (BC, Canada)
        fetch("https://api.ebird.org/v2/data/obs/geo/recent?lat=49.2827&lng=-123.1207", {
            headers: {
                "X-eBirdApiToken": "ur002gd6aek9",
            },
        })
            // once the data is fetched, filter it based on the search term
            // but first, the response must be converted to JSON because it is initially a string and not an object
            .then((response) => response.json())
            // then, filter the sightings array based on the search term
            .then((sightingsArray) => {
                // Filter sightings to include only those that match the search term
                const filteredSightings = sightingsArray.filter((bird) =>
                    bird.comName.toLowerCase().includes(searchTerm.toLowerCase())
                );
                // set the filtered sightings to the state
                setSightings(filteredSightings);
            });
    };

    // Instead of a favourite function for birds, this function toggles a bird in the user's checklist since it is more appropriate for the subject of bird watching (birding)
    const toggleChecklist = (birdID) => { // This function toggles a bird in the user's checklist
        let updatedChecklist; // first, create a variable to hold the updated checklist

        if (checklist.includes(birdID)) { // if the bird is already in the checklist, remove it
            updatedChecklist = checklist.filter((id) => id !== birdID);
        } else { // if the bird is not in the checklist, add it
            updatedChecklist = [...checklist, birdID];
        }

        localStorage.setItem("checklist", JSON.stringify(updatedChecklist)); // this updates the checklist in localStorage and updates the state
        setChecklist(updatedChecklist); 
    };
// This function fetches bird sightings from the EBird API and sets the Bird of the Day and Bird Image states. Since the Ebird API does not provide images, this function also fetches images from the iNaturalist API
    useEffect(() => {
        fetch("https://api.ebird.org/v2/data/obs/geo/recent?lat=49.2827&lng=-123.1207", {
            headers: {
                "X-eBirdApiToken": "ur002gd6aek9",
            },
        })
            .then((response) => response.json()) // see previous comment for more info
            .then((dataObj) => {
                setSightings(dataObj); // set the sightings state
                if (dataObj.length > 0) { // this randomizes the bird of the day
                    const randomBird = dataObj[Math.floor(Math.random() * dataObj.length)];
                    setBirdOfTheDay(randomBird);
                    // fetches images from the iNaturalist API for the corresponding bird of the day
                    fetch(`https://api.inaturalist.org/v1/search?q=${encodeURIComponent(randomBird.comName)}`)
                        .then((response) => response.json())
                        // this then sets the image state based on the response. If the response is empty, it sets the image to a placeholder
                        .then((imageData) => { 
                            const photoUrl = imageData.results[0]?.record?.default_photo?.medium_url;
                            setBirdImage(photoUrl || "https://via.placeholder.com/600x400?text=No+Image+Available");
                        })
                        // the catch is for any errors and displays an error message image instead
                        .catch(() => {
                            setBirdImage("https://via.placeholder.com/600x400?text=Error+Fetching+Image");
                        });
                }
            });
    }, []);

    return (
        <div className="bg-roof-50 min-h-screen">
  <div className="container mx-auto p-4">
    <div className="flex justify-between items-center mb-6">

      {/* Logo and Title */}
      <div className="flex items-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3440/3440413.png"
                            alt="Bird Logo"
                            className="w-12 h-12 mr-3"
                        />
                        <h1 className="text-3xl font-bold text-roof-900">Birding Buddy</h1>
                    </div>
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
          // this sets the image state to the placeholder if it is empty.
          alt={`Image of ${birdOfTheDay.comName}`}
          className="mx-auto w-full max-w-xs rounded-lg shadow-md mt-4"
        />
        <div className="flex items-center justify-between mt-4">
            {/* thhe bird name is displayed by accessing the birdOfTheDay object and accessing the comName property that is defined in the BirdOfTheDay component */}
          <h3 className="text-lg font-medium text-roof-900">{birdOfTheDay.comName}</h3>
          <Link
            // Similarly, the birdOfTheDay.speciesCode is used to navigate to the BirdDetails component
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
        {/* This loops through the sightings array and displays each bird */}
        {sightings.map((bird) => (
          <tr key={bird.speciesCode} className="hover:bg-roof-100">
            <td className="border border-roof-400 px-4 py-2">
                {/* Users are able to navigate to the BirdDetails component by clicking on the bird name */}
              <Link
                to={`/bird/${bird.speciesCode}`}
                state={bird}
                className="text-roof-600 hover:underline"
              >
                {bird.comName}
              </Link>
            </td>
            <td className="border border-roof-400 px-4 py-2 text-right">
                {/* Similarly, the toggleChecklist function is used to add or remove a bird from the checklist that is stored in localStorage */}
              <button
                onClick={() => toggleChecklist(bird.speciesCode)}
                className="text-2xl text-roof-400 hover:text-roof-700"
              >
                <FontAwesomeIcon
                // If the bird is in the checklist, the regularCheck icon is used, otherwise the solidCheck icon is used via ternary operator
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
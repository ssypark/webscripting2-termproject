import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare as solidCheck } from "@fortawesome/free-solid-svg-icons";

function Checklist() {
  const [savedBirds, setSavedBirds] = useState(() => {
    // Load checklist data from localStorage
    const savedChecklist = localStorage.getItem("checklist");
    return savedChecklist ? JSON.parse(savedChecklist) : [];
  });

  useEffect(() => {
    fetch("https://api.ebird.org/v2/data/obs/geo/recent?lat=49.2827&lng=-123.1207", {
      headers: {
        "X-eBirdApiToken": "ur002gd6aek9",
      },
    })
      .then((response) => response.json())
      .then((sightingsArray) => {
        // Filter sightings to include only those in the checklist
        const filteredChecklist = sightingsArray.filter((bird) =>
          savedBirds.includes(bird.speciesCode)
        );
        setSavedBirds(filteredChecklist);
      })
      .catch((error) => {
        console.error("Error fetching bird sightings:", error);
      });
  }, []);

  const removeFromChecklist = (birdID) => {
    // Remove bird from checklist
    const updatedChecklist = savedBirds.filter((bird) => bird.speciesCode !== birdID);
    setSavedBirds(updatedChecklist);
    // Update checklist in localStorage
    localStorage.setItem("checklist", JSON.stringify(updatedChecklist.map((bird) => bird.speciesCode)));
  };

  return (
    
      <div className="container mx-auto mt-16 p-6 bg-roof-50 rounded-lg shadow-lg relative">
        {/* Return Home CTA */}
        <Link
          to="/"
          className="absolute top-4 left-4 bg-roof-400 text-roof-50 py-2 px-4 rounded-lg shadow-md hover:bg-roof-500"
        >
          Return Home
        </Link>

        <h1 className="text-3xl font-bold text-roof-900 mb-6 text-center">Your Checklist</h1>
        {savedBirds.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-roof-400">
            <thead>
              <tr className="bg-roof-200">
                <th className="border border-roof-400 text-roof-900 px-4 py-2 text-left">Bird Name</th>
                <th className="border border-roof-400 text-roof-900 px-4 py-2 text-right">Seen</th>
              </tr>
            </thead>
            <tbody>
              {savedBirds.map((bird, index) => (
                // React requires a unique key for each list item so that React can efficiently update the list
                // thus the logical OR operator "index" is used as the key here so that React uses a unique key for each list item to avoid rendering bugs
                <tr key={bird.speciesCode || index} className="hover:bg-roof-100">
                  <td className="border text-roof-100 border-roof-400 px-4 py-2">
                    {/* The Link component is used to navigate to the BirdDetails page
                        The state prop is used to pass the bird object to the BirdDetails page */}
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
                      onClick={() => removeFromChecklist(bird.speciesCode)}
                      className="text-2xl text-roof-400 hover:text-roof-700"
                    >
                      <FontAwesomeIcon icon={solidCheck} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-roof-300 text-center">Your checklist is currently empty.</p>
        )}
      </div>

  );
}

export default Checklist;
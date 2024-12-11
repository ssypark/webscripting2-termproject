import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [sightings, setSightings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [favs, setFavs] = useState(() => {
        const savedFavs = localStorage.getItem("favs");
        return savedFavs ? JSON.parse(savedFavs) : [];
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

    const toggleFav = (birdID) => {
        let filteredFavs;

        if (favs.includes(birdID)) {
            filteredFavs = favs.filter((favId) => favId !== birdID);
        } else {
            filteredFavs = [...favs, birdID];
        }

        localStorage.setItem("favs", JSON.stringify(filteredFavs));
        setFavs(filteredFavs);
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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Browse Birds</h1>

            {birdOfTheDay && (
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                    <h2 className="text-xl font-semibold text-center text-red-600">Bird of the Day</h2>
                    <img
                        src={birdImage}
                        alt={`Image of ${birdOfTheDay.comName}`}
                        className="mx-auto w-full max-w-xs rounded-lg shadow-md mt-4"
                    />
                    <div className="flex items-center justify-between mt-4">
                        <h3 className="text-lg font-medium">{birdOfTheDay.comName}</h3>
                        <Link
                            to={`/bird/${birdOfTheDay.speciesCode}`}
                            state={birdOfTheDay}
                            className="text-sm font-semibold text-red-600 hover:text-red-800"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            )}

            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Search for a bird"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-300"
                />
                <button
                    onClick={searchBirds}
                    className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring focus:ring-red-300"
                >
                    Search
                </button>
            </div>

            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2 text-left">Bird Name</th>
                        <th className="border border-gray-200 px-4 py-2 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sightings.map((bird) => (
                        <tr key={bird.speciesCode} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">
                                <Link to={`/bird/${bird.speciesCode}`} state={bird} className="text-blue-600 hover:underline">
                                    {bird.comName}
                                </Link>
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-right">
                                <button
                                    onClick={() => toggleFav(bird.speciesCode)}
                                    className={`px-2 py-1 text-sm rounded-lg ${
                                        favs.includes(bird.speciesCode)
                                            ? "bg-green-600 text-white hover:bg-green-700"
                                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                                >
                                    {favs.includes(bird.speciesCode) ? "Remove Fav" : "Add Fav"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Home;
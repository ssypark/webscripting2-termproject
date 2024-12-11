import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

function BirdDetails() {
    const location = useLocation();
    const bird = location.state;
    const [image, setImage] = useState("");
    const [favs, setFavs] = useState(() => {
        const savedFavs = localStorage.getItem("favs");
        return savedFavs ? JSON.parse(savedFavs) : [];
    });

    useEffect(() => {
        if (!bird) return;

        const fetchImage = async () => {
            try {
                const response = await fetch(
                    `https://api.inaturalist.org/v1/search?q=${encodeURIComponent(
                        bird.comName
                    )}`
                );
                const data = await response.json();
                const photoUrl = data.results[0]?.record?.default_photo?.medium_url;

                if (photoUrl) {
                    setImage(photoUrl);
                } else {
                    setImage(
                        "https://via.placeholder.com/600x400?text=No+Image+Available"
                    );
                }
            } catch (error) {
                console.error("Error fetching image:", error);
                setImage(
                    "https://via.placeholder.com/600x400?text=Error+Fetching+Image"
                );
            }
        };

        fetchImage();
    }, [bird]);

    const toggleFav = () => {
        let updatedFavs;

        if (favs.includes(bird.speciesCode)) {
            updatedFavs = favs.filter((fav) => fav !== bird.speciesCode);
        } else {
            updatedFavs = [...favs, bird.speciesCode];
        }

        setFavs(updatedFavs);
        localStorage.setItem("favs", JSON.stringify(updatedFavs));
    };

    if (!bird) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold text-red-500">
                    No details available for this bird.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-4xl  max-w-4xl mx-auto  mt-8 text-3xl font-bold mb-4">Bird Details</h1>
            <div className="mt-8 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{bird.comName}</h1>
                        <p className="italic text-gray-600">
                            {bird.sciName}
                        </p>
                    </div>
                    <button
                        className="bg-white p-2 hover:bg-red-100"
                        onClick={toggleFav}
                    >
                        <FontAwesomeIcon
                            icon={favs.includes(bird.speciesCode) ? solidHeart : regularHeart}
                            className={`text-2xl ${favs.includes(bird.speciesCode) ? "text-red-500" : "text-gray-500"
                                }`}
                        />
                    </button>
                </div>
                <img
                    src={image || "https://via.placeholder.com/600x400?text=No+Image+Available"}
                    alt={`Image of ${bird.comName}`}
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                />
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-700 mt-4">
                        Latest Observation Details
                    </h2>
                    <p className="text-gray-600 mt-2">
                        <strong>Location:</strong> {bird.locName}
                    </p>
                    <p className="text-gray-600 mt-2">
                        <strong>Observation Date:</strong> {bird.obsDt}
                    </p>

                </div>
            </div>
            <div className="flex justify-center">
                <Link
                    to="/"
                    className=" mt-6 bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600"
                >
                    Return to List
                </Link>
            </div>

        </div>
    );
}

export default BirdDetails;
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare as solidCheck } from "@fortawesome/free-solid-svg-icons";
import { faSquare as regularCheck } from "@fortawesome/free-regular-svg-icons";

function BirdDetails() {
    // this component displays the details of a specific bird and allows the user to add it to their checklist
    // it uses the useLocation hook to get the bird object from the previous page's Link component
    const location = useLocation();
    const bird = location.state;
    // this state holds the image of the bird
    const [image, setImage] = useState("");
    // this state holds the user's checklist
    const [checklist, setChecklist] = useState(() => {
        // Load checklist data from localStorage
        const savedChecklist = localStorage.getItem("checklist");
        return savedChecklist ? JSON.parse(savedChecklist) : [];
    });
    // this effect fetches the image of the bird if it is available
    useEffect(() => {
        // If the bird object is not available, return and do not fetch the image
        if (!bird) return;

        const fetchImage = async () => { // we use async to avoid blocking the UI
            try {
                // Fetch the image of the bird from the iNaturalist API
                const response = await fetch( // await is used to wait for the response to come back
                    `https://api.inaturalist.org/v1/search?q=${encodeURIComponent(
                        bird.comName
                    )}`
                );
                // convert the response to JSON
                const data = await response.json();
                // get the default photo of the bird and set it to the state via setImage
                // data.results[0] is the first result in the results array
                // data.results[0]?.record?.default_photo?.medium_url is the URL of the default photo

                const photoUrl = data.results[0]?.record?.default_photo?.medium_url;

                if (photoUrl) {
                    setImage(photoUrl);
                } else {
                    // if the default photo is not available, use a placeholder image
                    setImage(
                        "https://via.placeholder.com/600x400?text=No+Image+Available"
                    );
                }
            } catch (error) {
                // if there is an error fetching the image, use a placeholder image that says "Error Fetching Image"
                console.error("Error fetching image:", error);
                setImage(
                    "https://via.placeholder.com/600x400?text=Error+Fetching+Image"
                );
            }
        };

        fetchImage(); // call the fetchImage function
    }, [bird]); // the dependency array ensures that the effect runs whenever the 'bird' object changes
    // this function toggles the bird in the user's checklist (see Checklist.jsx for more details)
    const toggleChecklist = () => {
        // Toggle bird in checklist
        let updatedChecklist;

        if (checklist.includes(bird.speciesCode)) {
            updatedChecklist = checklist.filter((item) => item !== bird.speciesCode);
        } else {
            updatedChecklist = [...checklist, bird.speciesCode];
        }

        setChecklist(updatedChecklist);
        localStorage.setItem("checklist", JSON.stringify(updatedChecklist));
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
    useEffect(() => {
        console.log("Bird Details:", bird);
    }, [bird]);
    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto mt-8 p-4">
                {/* Navigation Links */}
                <div className="flex justify-between mb-6">
                    <Link
                        to="/"
                        className="bg-roof-400 text-roof-50 px-4 py-2 rounded-lg shadow-md hover:bg-roof-500"
                    >
                        Return Home
                    </Link>
                    <Link
                        to="/checklist"
                        className="bg-roof-400 text-roof-50 px-4 py-2 rounded-lg shadow-md hover:bg-roof-500"
                    >
                        My Checklist
                    </Link>
                </div>

                {/* Bird Details */}
                <h1 className="text-4xl font-bold text-roof-900 mb-6 text-center">Bird Details</h1>
                <div className="max-w-4xl mx-auto p-6 bg-roof-50 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-roof-900">{bird.comName}</h1>
                            <p className="italic text-gray-600">{bird.sciName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-roof-800 font-semibold text-lg font-medium">Seen:</p>
                            <button
                                className="text-2xl text-roof-400 hover:text-roof-700"
                                onClick={toggleChecklist}
                            >
                                <FontAwesomeIcon
                                    icon={checklist.includes(bird.speciesCode) ? solidCheck : regularCheck}
                                    className={`text-2xl ${checklist.includes(bird.speciesCode)
                                        ? "text-roof-400"
                                        : "text-gray-500"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                    <img
                        src={image || "https://via.placeholder.com/600x400?text=No+Image+Available"}
                        alt={`Image of ${bird.comName}`}
                        className="w-full h-auto object-cover rounded-lg shadow-md"
                    />
                    <div className="mt-6">

                        <h2 className="text-2xl font-semibold text-roof-900 mt-4">Latest Observation Details</h2>
                        <p className="text-roof-700 mt-2">
                            <strong>Observation Date:</strong> {bird.obsDt}
                        </p>
                        <p className="text-roof-700 mt-2">
                            <strong>Number Observed:</strong> {bird.howMany}
                        </p>
                        <p className="text-roof-700 mt-2">
                            <strong>Location:</strong> {bird.locName}
                        </p>
                        <p className="text-roof-700 mt-2">
                            <strong>Coordinates:</strong> {bird.lat.toFixed(3)}, {bird.lng.toFixed(3)}
                        </p>
                        <p className="text-roof-700 mt-2">
                            <strong>Map Location:</strong>{" "}
                            <a  // using the latitude and longitude to create a link to Google Maps
                                href={`https://www.google.com/maps?q=${bird.lat},${bird.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-roof-600 hover:underline"
                            >
                                View on Map
                            </a>
                        </p>
                        <p className="text-roof-700 mt-2">
                            <strong>Observation Valid:</strong> {bird.obsValid ? "Yes" : "No"}
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default BirdDetails;
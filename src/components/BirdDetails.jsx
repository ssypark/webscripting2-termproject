import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare as solidCheck } from "@fortawesome/free-solid-svg-icons";
import { faSquare as regularCheck } from "@fortawesome/free-regular-svg-icons";

function BirdDetails() {
    const location = useLocation();
    const bird = location.state;
    const [image, setImage] = useState("");
    const [checklist, setChecklist] = useState(() => {
        // Load checklist data from localStorage
        const savedChecklist = localStorage.getItem("checklist");
        return savedChecklist ? JSON.parse(savedChecklist) : [];
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

    const toggleChecklist = () => {
        // Toggle bird in checklist
        let updatedChecklist;

        if (checklist.includes(bird.speciesCode)) {
            updatedChecklist = checklist.filter((item) => item !== bird.speciesCode);
        } else {
            updatedChecklist = [...checklist, bird.speciesCode];
        }

        setChecklist(updatedChecklist);
        // Update checklist in localStorage
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
                <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{bird.comName}</h1>
                            <p className="italic text-gray-600">{bird.sciName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-700 font-semibold text-lg font-medium">Seen:</p>
                            <button
                                className="bg-white hover:bg-green-100 p-2 rounded-full"
                                onClick={toggleChecklist}
                            >
                                <FontAwesomeIcon
                                    icon={checklist.includes(bird.speciesCode) ? solidCheck : regularCheck}
                                    className={`text-2xl ${
                                        checklist.includes(bird.speciesCode)
                                            ? "text-green-500"
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
            </div>
        </div>
    );
}

export default BirdDetails;
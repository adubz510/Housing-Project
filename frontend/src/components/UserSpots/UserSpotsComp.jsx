import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserSpotsThunk } from "../../store/currentUser";
import { useNavigate } from "react-router-dom";
import DeleteSpotModal from "./DeleteSpotModal";
import "./UserSpots.css";

function UserSpotsComp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userSpots = useSelector(state => Object.values(state.userSpots));

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);

    useEffect(() => {
        dispatch(UserSpotsThunk());
    }, [dispatch]);

    const handleDeleteClick = (spot) => {
        setSelectedSpot(spot);
        setShowDeleteModal(true);
    };

    return (
        <div className="manage-spots-container">
            <div className="manage-header">
                <h1>Manage Your Spots</h1>
                <button className="create-spot-button" onClick={() => navigate("/spots/new")}>
                    Create a New Spot
                </button>
            </div>
            <div className="spots-list">
                {userSpots.length > 0 ? (
                    userSpots.map((spot) => (
                        <div key={spot.id} className="spot-card">
                            <img src={spot.previewImage || "/placeholder.jpg"} alt={spot.name} />
                            <div className="spot-info">
                                <p>{spot.city}, {spot.state}</p>
                                <p className="spot-price"><strong>${spot.price}</strong> night</p>
                                <div className="spot-buttons">
                                    <button className="update-button" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                                    <button className="delete-button" onClick={() => handleDeleteClick(spot)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have not listed any spots yet.</p>
                )}
            </div>

            {/* Render Delete Modal when needed */}
            {showDeleteModal && selectedSpot && (
                <DeleteSpotModal
                    spot={selectedSpot}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
}

export default UserSpotsComp;

import { useDispatch } from "react-redux";
import { deleteSpotThunk, UserSpotsThunk } from "../../store/currentUser";
import "./DeleteSpot.css";

function DeleteSpotModal({ spot, onClose }) {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await dispatch(deleteSpotThunk(spot.id));
            dispatch(UserSpotsThunk()); // Refresh user spots
            onClose(); // Close modal after deleting
        } catch (error) {
            console.error("Failed to delete spot:", error);
        }
    };

    return (
        <div className="delete-spot-modal">
            <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to remove this spot from the listings?</p>
                <div className="modal-actions">
                    <button className="confirm-delete" onClick={handleDelete}>Yes, Delete</button>
                    <button className="cancel-delete" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteSpotModal;
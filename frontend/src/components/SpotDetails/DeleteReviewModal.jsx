import { useDispatch } from "react-redux";
import { deleteReviewThunk } from "../../store/spot"; 
import { useModal } from "../../context/Modal";
import "./deleteReview.css";

function DeleteReviewModal({ reviewId, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        const success = await dispatch(deleteReviewThunk(spotId, reviewId));

        if (success) {
            closeModal(); // Close only if deletion was successful
        } else {
            console.error("Failed to delete review.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this review?</p>
                <div className="modal-buttons">
                    <button className="delete-review-button" onClick={handleDelete}>
                        Yes (Delete Review)
                    </button>
                    <button className="cancel-button" onClick={closeModal}>
                        No (Keep Review)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteReviewModal;

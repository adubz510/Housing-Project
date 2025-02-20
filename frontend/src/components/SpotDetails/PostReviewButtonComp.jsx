import { useState } from "react";
import { useDispatch } from "react-redux";
import { csrfFetch } from "../../store/csrf";
import { loadReviewsThunk } from "../../store/spot";
import "./PostReviewButton.css";

function PostReviewButtonComp({ spotId }) {
    const [showModal, setShowModal] = useState(false);
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(0);
    const [hoverStars, setHoverStars] = useState(0);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); // Reset errors on new submission attempt

        if (review.length < 10) {
            setErrors(["Review must be at least 10 characters long."]);
            return;
        }
        if (stars === 0) {
            setErrors(["Please provide a star rating."]);
            return;
        }

        const newReview = { review, stars };

        try {
            const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newReview),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch(loadReviewsThunk(spotId));
                setShowModal(false);
                setReview("");
                setStars(0);
                setErrors([]);
                setHasSubmitted(true); // Hide the button after successful submission
            } else {
                // Check for the "existing review" error
                if (data.message === "User already has a review for this spot") {
                    setErrors(["Review already exists for this spot"]);
                } else {
                    setErrors(data.errors || ["Something went wrong."]);
                }
            }
        } catch (error) {
            setErrors(["User already has a review for this spot"]);
        }
    };

    if (hasSubmitted) return null; // Hide the button after successful submission

    const isSubmitDisabled = review.length < 10 || stars === 0; // Disable if review < 10 chars or no stars selected

    return (
        <>
            <button className="post-review-button" onClick={() => setShowModal(true)}>
                Post Your Review
            </button>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button className="close-modal-button" onClick={() => setShowModal(false)}>✖</button>

                        {/* Title */}
                        <h2>How was your stay?</h2>

                        {/* Error Messages (display without blocking submission) */}
                        {errors.length > 0 && (
                            <div className="error-message">
                                {errors.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}

                        {/* Review Input */}
                        <textarea
                            className="review-textarea"
                            placeholder="Just a quick review."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />

                        {/* Star Rating */}
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span
                                    key={num}
                                    className={`star ${num <= (hoverStars || stars) ? "filled" : ""}`}
                                    onClick={() => setStars(num)}
                                    onMouseEnter={() => setHoverStars(num)}
                                    onMouseLeave={() => setHoverStars(0)}
                                >
                                    ★
                                </span>
                            ))}
                            <span className="star-label">Stars</span>
                        </div>

                        {/* Submit Button (No Blocking Click) */}
                        <button
                            className="submit-review-button"
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled} // Disable button if conditions not met
                        >
                            Submit Your Review
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default PostReviewButtonComp;
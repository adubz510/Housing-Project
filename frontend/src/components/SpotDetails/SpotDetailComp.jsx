import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadOneSpotThunk, loadReviewsThunk } from "../../store/spot"; 
import PostReviewButtonComp from "./PostReviewButtonComp";
import DeleteReviewModal from "./DeleteReviewModal";
import { useModal } from "../../context/Modal"; // Modal Context
import "./SpotDetail.css";

function SpotDetailComp() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[id]);
    const sessionUser = useSelector(state => state.session.user);
    const { setModalContent } = useModal(); 

    const [selectedReviewId, setSelectedReviewId] = useState(null); // Track selected review ID for deletion

    useEffect(() => {
        dispatch(loadOneSpotThunk(id)); 
        dispatch(loadReviewsThunk(id));
    }, [dispatch, id]);

    if (!spot) return <p>No Spot Found</p>;

    const handleReserveClick = () => {
        alert("Feature Coming Soon...");
    };

    const avgRating = spot.avgRating;

    // Open Modal for Delete Review
    const openDeleteModal = (reviewId) => {
        setSelectedReviewId(reviewId);  // Update the selected review ID
        setModalContent(<DeleteReviewModal reviewId={reviewId} spotId={id} />);
    };

    // Sort reviews by createdAt in descending order to show most recent first
    const sortedReviews = spot.reviews?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="spot-details-container">
            {/* Spot Name & Location */}
            <h1 className="spot-title">{spot.name}</h1>
            <p className="spot-location">{spot.city}, {spot.state}, {spot.country}</p>

            {/* Images Section */}
            <div className="spot-images">
                <div className="main-image">
                    <img src={spot.SpotImages?.[0]?.url || "/placeholder.jpg"} alt="Main Spot" />
                </div>
                {spot.SpotImages?.length > 1 && (
                    <div className="side-images">
                        {spot.SpotImages.slice(1, 5).map((image, index) => (
                            <img key={index} src={image.url} alt={`Spot Image ${index + 2}`} />
                        ))}
                    </div>
                )}
            </div>

            {/* Host Information */}
            <h2 className="host-info">Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
            <p className="spot-description">{spot.description}</p>

            {/* Pricing & Reservation Section */}
            <div className="spot-reservation-container">
                <div className="spot-reservation">
                    <div className="spot-">
                        <strong>${spot.price}</strong> <span className="night-text">/ night</span>
                    </div>
                    <div className="spot-rating">
                        ★ {typeof avgRating === "number" && !isNaN(avgRating)
                        ? avgRating.toFixed(2) 
                        : "No Rating"} · 
                        {spot.reviews?.length > 0 
                        ? `${spot.reviews.length} ${spot.reviews.length === 1 ? 'review' : 'reviews'}` 
                        : "New"}                   
                    </div>                    
                    <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
                </div>
            </div>

            {/* Reviews Section */}
            <h2 className="reviews-header">
                ★ {typeof avgRating === "number" && !isNaN(avgRating)  
                ? avgRating.toFixed(2)  
                : "No Rating"} ·  
                {spot.reviews?.length > 0  
                    ? `${spot.reviews.length} ${spot.reviews.length === 1 ? 'review' : 'reviews'}`  
                    : "New"}
            </h2>

            {/* "Post Your Review" Button - Visible for logged-in users */}
            {sessionUser && sessionUser.id !== spot.ownerId && <PostReviewButtonComp spotId={spot.id}/>}

            {/* Reviews List */}
            {sortedReviews?.length > 0 ? (
                <div className="reviews">
                    {sortedReviews.map((review, index) => (
                        <div key={index} className="review">
                            <strong>{review.User?.firstName}</strong>
                            <p className="review-date">
                                {new Date(review.createdAt).toLocaleString("default", { month: "long", year: "numeric" })}
                            </p>
                            <p className="review-text">{review.review}</p>

                            {/* Delete Button (Opens Modal) */}
                            {sessionUser && sessionUser.id === review.userId && (
                                <button className="delete-review-button" onClick={() => openDeleteModal(review.id)}>
                                    Delete Review
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-reviews">Be the first to post a review!</p>
            )}
        </div>
    );
}

export default SpotDetailComp;
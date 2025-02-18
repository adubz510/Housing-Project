import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spot/loadSpots";
const LOAD_ONE_SPOT = "spot/loadOneSpot";
const LOAD_REVIEWS = "spot/loadReviews";
const CREATE_SPOT = "spot/createSpot";
const DELETE_REVIEW = "spot/deleteReview";

const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    payload: spots
});

const loadOneSpot = (spot) => ({
    type: LOAD_ONE_SPOT,
    payload: spot
});

const loadReviews = (spotId, reviews) => ({
    type: LOAD_REVIEWS,
    payload: { spotId, reviews }
});

const createSpotAction = (spot) => ({
    type: CREATE_SPOT,
    payload: spot
});

const deleteReviewAction = (spotId, reviewId) => ({
    type: DELETE_REVIEW,
    payload: { spotId, reviewId }
})



export const loadSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots/");

    if (response.ok) {
        const result = await response.json();
        
        const formattedSpots = result.Spots.map(spot => ({
            ...spot,
            previewImage: spot.previewImage || "/placeholder.jpg"
        }));

        dispatch(loadSpots(formattedSpots));
    }
};

export const loadOneSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const result = await response.json();
        
        // Ensure preview images exist
        result.previewImage = result.previewImage || "/placeholder.jpg";
        
        // Calculate avgRating if not provided
        if (!result.avgRating && result.Reviews?.length > 0) {
            const totalRating = result.Reviews.reduce((sum, review) => sum + review.stars, 0);
            result.avgRating = totalRating / result.Reviews.length;
        } else if (!result.avgRating) {
            result.avgRating = 0; // Default to 0 if no reviews
        }

        dispatch(loadOneSpot(result));
    }
};

export const loadReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const result = await response.json();
        dispatch(loadReviews(spotId, result.Reviews || []));
    }
};

export const deleteReviewThunk = (spotId, reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
    });

    if(response.ok) {
        dispatch(deleteReviewAction(spotId, reviewId));
        dispatch(loadOneSpot(spotId));
        return true;
    }
    return false;
}

export const createSpot = (spotData) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spotData),
    });

    if (response.ok) {
        const newSpot = await response.json();
        
        newSpot.previewImage = newSpot.previewImage || "/placeholder.jpg";
        
        dispatch(createSpotAction(newSpot));
        return newSpot;
    } else {
        const errorData = await response.json();
        throw errorData;
    }
};



const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const allSpots = {};
            action.payload.forEach(spot => {
                allSpots[spot.id] = spot;
            });
            return { ...state, ...allSpots };
        }
        case LOAD_ONE_SPOT: {
            return { ...state, [action.payload.id]: action.payload };
        }
        case LOAD_REVIEWS: {
            const { spotId, reviews } = action.payload;
            let avgRating = 0;
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + review.stars, 0);
                avgRating = totalRating / reviews.length;
            }
            return {
                ...state,
                [spotId]: {
                    ...state[spotId],
                    reviews,
                    avgRating
                
                }
            };
        }
        case DELETE_REVIEW: {
            const { spotId, reviewId } = action.payload;
            const updatedReviews = state[spotId]?.reviews.filter(review => review.id !== reviewId) || [];
            
            let avgRating = 0;
            if (updatedReviews.length > 0) {
                const totalRating = updatedReviews.reduce((sum, review) => sum + review.stars, 0);
                avgRating = totalRating / updatedReviews.length;
            }

            return {
                ...state,
                [spotId]: {
                    ...state[spotId],
                    reviews: updatedReviews,
                    avgRating
                }
            };
        }
        case CREATE_SPOT: {
            return { ...state, [action.payload.id]: action.payload };
        }
        default:
            return state;
    }
};

export default spotReducer;
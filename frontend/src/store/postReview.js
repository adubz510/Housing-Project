import { csrfFetch } from "./csrf";
import { loadReviewsThunk } from "./spot"; // To refresh the reviews after submission

const POST_REVIEW = "review/postReview";

const postReviewAction = (spotId, review) => ({
    type: POST_REVIEW,
    payload: { spotId, review },
});

export const postReviewThunk = (spotId, reviewData) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewData),
        });

        if (response.ok) {
            const newReview = await response.json();
            dispatch(postReviewAction(spotId, newReview));
            dispatch(loadReviewsThunk(spotId)); // Refresh reviews after posting
            return newReview;
        } else {
            const errorData = await response.json();
            return Promise.reject(errorData.errors || ["Something went wrong."]);
        }
    } catch (error) {
        return Promise.reject(["Network error. Please try again later."]);
    }
};

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_REVIEW: {
            return {
                ...state,
                [action.payload.spotId]: [
                    action.payload.review,
                    ...(state[action.payload.spotId] || []),
                ],
            };
        }
        default:
            return state;
    }
};

export default reviewReducer;
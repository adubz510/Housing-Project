// frontend/src/store/currentUser.js
import { csrfFetch } from "./csrf";

const LOAD_USER_SPOTS = "userSpots/LOAD_USER_SPOTS";
const UPDATE_SPOT = "userSpots/UPDATE_SPOT";
const DELETE_SPOT = "userSpots/DELETE_SPOT";


const loadUserSpots = (spots) => ({
    type: LOAD_USER_SPOTS,
    spots
});

const updateSpotAction = (spot) => ({
    type: UPDATE_SPOT,
    spot
});

const deleteSpotAction = (spotId) => ({
    type: DELETE_SPOT,
    spotId
});


export const UserSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots/current");
    if (response.ok) {
        const data = await response.json();
        dispatch(loadUserSpots(data.Spots));
        return data.Spots;
    }
};

export const updateSpotThunk = (spotId, updatedData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    });

    if(response.ok) {
        const updatedSpot = await response.json();
        dispatch(updateSpotAction(updatedSpot));
        return updatedSpot;
    } else {
        const errorData = await response.json();
        throw errorData;
    }
};

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        dispatch(deleteSpotAction(spotId));
        return true;
    } else {
        const errorData = await response.json();
        throw errorData;
    }
}


const initialState = {};

const userSpotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_USER_SPOTS: {
            const newState = {};
            action.spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        case UPDATE_SPOT: {
            return {
                ...state,
                [action.spot.id]: action.spot
            };
        }
        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        default:
            return state;
    }
};

export default userSpotsReducer;
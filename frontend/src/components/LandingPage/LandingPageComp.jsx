import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadSpotsThunk } from "../../store/spot";
import './LandingPage.css'

function LandingPageComp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spots = useSelector(state => Object.values(state.spots)); // Convert to array

    useEffect(() => {
        dispatch(loadSpotsThunk());
    }, [dispatch]);

    if (!spots.length) return <p>Loading spots...</p>;

    return (
        <div className="landing-container">
            <div className="spots-grid">
                {spots.map(spot => (
                    <div 
                        key={spot.id} 
                        className="spot-tile" 
                        onClick={() => navigate(`/spots/${spot.id}`)}
                        title={spot.name}
                    >
                        <div className="image-container">
                            <img 
                                src={spot.previewImage || "/placeholder.jpg"} 
                                alt={spot.name} 
                                className="spot-image"
                            />
                            <div className="spot-hover-name">{spot.name}</div>
                        </div>
                        <div className="spot-details">
                            <div className="spot-name">{spot.city}, {spot.state}</div>
                            <div className="spot-rating">
                                ★ {spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : "New"}
                            </div>
                            <div className="spot-price">${spot.price.toFixed(2)}/night</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LandingPageComp;
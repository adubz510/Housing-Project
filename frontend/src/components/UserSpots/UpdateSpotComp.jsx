import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { UserSpotsThunk, updateSpotThunk } from "../../store/currentUser";
import "./UpdateSpot.css";

function UpdateSpotComp() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spot = useSelector(state => state.userSpots[id]);

    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        lat: "",
        lng: "",
        name: "",
        description: "",
        price: "",
        images: ["", "", "", "", ""]
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(UserSpotsThunk());
    }, [dispatch]);

    useEffect(() => {
        if (spot) {
            setFormData({
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat || "",
                lng: spot.lng || "",
                name: spot.name,
                description: spot.description,
                price: spot.price,
                images: spot.images || ["", "", "", "", ""]
            });
        }
    }, [spot]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const latValue = formData.lat ? parseFloat(formData.lat) : null;
        const lngValue = formData.lng ? parseFloat(formData.lng) : null;

        if (latValue !== null && (latValue < -90 || latValue > 90)) {
            setErrors(prev => ({ ...prev, lat: "Latitude must be between -90 and 90" }));
            return;
        }

        if (lngValue !== null && (lngValue < -180 || lngValue > 180)) {
            setErrors(prev => ({ ...prev, lng: "Longitude must be between -180 and 180" }));
            return;
        }

        const updatedSpot = {
            ...formData,
            lat: latValue,
            lng: lngValue,
            price: parseFloat(parseFloat(formData.price)),
            images: formData.images.filter(url => url.trim() !== ""),
        };

        try {
            const updated = await dispatch(updateSpotThunk(id, updatedSpot));
            if (updated.errors) {
                setErrors(updated.errors);
                return;
            }
            navigate(`/spots/${id}`);
        } catch (res) {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        }
    };

    if (!spot) return <p>Loading...</p>;

    return (
        <div className="update-spot-container">
            <h1>Update your Spot</h1>
            <form onSubmit={handleSubmit} className="update-spot-form">
                <label>Street Address
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </label>
                {errors.address && <p className="error">{errors.address}</p>}

                <label>City
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                </label>
                {errors.city && <p className="error">{errors.city}</p>}

                <label>State
                    <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                </label>
                {errors.state && <p className="error">{errors.state}</p>}

                <label>Country
                    <input type="text" name="country" value={formData.country} onChange={handleChange} required />
                </label>
                {errors.country && <p className="error">{errors.country}</p>}

                <label>Latitude (Optional)
                    <input type="text" name="lat" value={formData.lat} onChange={handleChange} />
                </label>
                {errors.lat && <p className="error">{errors.lat}</p>}

                <label>Longitude (Optional)
                    <input type="text" name="lng" value={formData.lng} onChange={handleChange} />
                </label>
                {errors.lng && <p className="error">{errors.lng}</p>}

                <label>Title
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                {errors.name && <p className="error">{errors.name}</p>}

                <label>Description
                    <textarea name="description" value={formData.description} onChange={handleChange} required />
                </label>
                {errors.description && <p className="error">{errors.description}</p>}

                <label>Price per night (USD)
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </label>
                {errors.price && <p className="error">{errors.price}</p>}

                <button type="submit" className="update-button">Update Spot</button>
            </form>
        </div>
    );
}

export default UpdateSpotComp;
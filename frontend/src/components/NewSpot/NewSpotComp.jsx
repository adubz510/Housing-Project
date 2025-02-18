//frontend/src/components/NewSpot/NewSpotComp.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spot';
import './NewSpot.css';

function NewSpotComp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '', '']);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const latValue = lat ? parseFloat(lat) : null;
    const lngValue = lng ? parseFloat(lng) : null;

    if (latValue !== null && (latValue < -90 || latValue > 90)) {
      setErrors((prev) => ({ ...prev, lat: "Latitude must be between -90 and 90" }));
      return;
    }

    if (lngValue !== null && (lngValue < -180 || lngValue > 180)) {
      setErrors((prev) => ({ ...prev, lng: "Longitude must be between -180 and 180" }));
      return;
    }

    const newSpot = {
      country,
      address,
      city,
      state,
      lat: latValue,
      lng: lngValue,
      description,
      name,
      price: parseFloat(parseFloat(price).toFixed(2)),
      images: [previewImage, ...imageUrls.filter(url => url.trim() !== '')],
    };

    try {
      const spot = await dispatch(createSpot(newSpot));
      if (spot.errors) {
        setErrors(spot.errors);
        return;
      }
      navigate(`/spots/${spot.id}`);
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    }
  };

  return (
    <div className="new-spot-container">
      <h1>Create a new Spot</h1>
      <form onSubmit={handleSubmit} className="new-spot-form">
        <label>Country
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </label>
        {errors.country && <p className="error">{errors.country}</p>}

        <label>Street Address
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        {errors.address && <p className="error">{errors.address}</p>}

        <div className="form-row">
          <label>City
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
          </label>
          <label>State
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
          </label>
        </div>
        {errors.city && <p className="error">{errors.city}</p>}
        {errors.state && <p className="error">{errors.state}</p>}

        <div className="form-row">
          <label>Latitude (Optional)
            <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} />
          </label>
          <label>Longitude (Optional)
            <input type="text" value={lng} onChange={(e) => setLng(e.target.value)} />
          </label>
        </div>
        {errors.lat && <p className="error">{errors.lat}</p>}
        {errors.lng && <p className="error">{errors.lng}</p>}

        <label>Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        {errors.description && <p className="error">{errors.description}</p>}

        <label>Name of your spot
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Price per night (USD)
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        {errors.price && <p className="error">{errors.price}</p>}

        <label>Preview Image URL
          <input type="text" value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} required />
        </label>
        {errors.previewImage && <p className="error">{errors.previewImage}</p>}

        {imageUrls.map((url, idx) => (
          <label key={idx}>Image URL
            <input
              type="text"
              value={url}
              onChange={(e) => {
                const newUrls = [...imageUrls];
                newUrls[idx] = e.target.value;
                setImageUrls(newUrls);
              }}
            />
          </label>
        ))}

        <button type="submit" className="create-spot-button">Create Spot</button>
      </form>
    </div>
  );
}

export default NewSpotComp;
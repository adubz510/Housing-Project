// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { TbBrandAirbnb } from "react-icons/tb";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className='navbar'>
    <ul>
      <li>
        <NavLink to="/">
        <div className="logo"><TbBrandAirbnb className="airbnb-logo" />airbnb</div>
        </NavLink>
      </li>
      {isLoaded && (
        <li className="nav-right">
            {sessionUser && (
            <NavLink to="/spots/new" className="create-spot-button">
            Create New Spot
            </NavLink>
            )}
   <div className="menu-container">
              <div className="profile-container">
                <ProfileButton user={sessionUser} />      
                </div>
                </div>
        </li>
      )}
    </ul>
    </nav>
  );
}

export default Navigation;
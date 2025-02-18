// frontend/src/components/Navigation/ProfileButton.jsx
import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import LoginFormModal from '../LoginFormModal/LoginFormMOdal'; //KEEP AN EYE ON THIS IMPORT PATH
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import { GiHamburgerMenu } from "react-icons/gi";
import './ProfileButton.css'


function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
  
    const toggleMenu = (e) => {
      e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
      setShowMenu(!showMenu);
    };
  
    useEffect(() => {
      if (!showMenu) return;
  
      const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };
  
      document.addEventListener('click', closeMenu);
  
      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);
  
    const closeMenu = () => setShowMenu(false);
  
    const logout = (e) => {
      e.preventDefault();
      dispatch(sessionActions.logout());
      closeMenu();
    };
  
    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  
    return (
        <div className="profile-dropdown-container">
          <button onClick={toggleMenu} className="profile-menu-button">
            <GiHamburgerMenu />
            <FaUserCircle />
          </button>
          <ul className={ulClassName} ref={ulRef}>
            {user ? (
              <>
                <li>Hello, {user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                  <NavLink to="/spots/current" className="manage-spots-link" onClick={closeMenu}>
                    Manage Spots
                  </NavLink>
                </li>
                <li>
                    <NavLink to="/reviews/manage" className="manage-reviews-link" onClick={closeMenu}>
                     Manage Reviews
                    </NavLink>
                </li>
                <li>
                  <button onClick={logout} className="logout-button">Log Out</button>
                </li>
              </>
            ) : (
              <>
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </>
            )}
          </ul>
        </div>
      );
    }
    
    export default ProfileButton;
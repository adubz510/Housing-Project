// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import  Navigation  from './components/Navigation/Navigation';
import LandingPageComp from './components/LandingPage/LandingPageComp';
import SpotDetailComp from './components/SpotDetails/SpotDetailComp';
import NewSpotComp from './components/NewSpot/NewSpotComp';
import UserSpotsComp from './components/UserSpots/UserSpotsComp';
import UpdateSpotComp from './components/UserSpots/UpdateSpotComp';
import * as sessionActions from './store/session';
import './index.css';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);
console.log(isLoaded)
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPageComp />
      },
      {
        path: '/spots/new',
        element: <NewSpotComp />
      },
      {
        path: '/spots/:id',
        element: <SpotDetailComp />
      },
      {
        path: '/spots/current',
        element: <UserSpotsComp />
      },
      {
        path: '/spots/:id/edit',
        element: <UpdateSpotComp />
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
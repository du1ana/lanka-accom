import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from '../store/store';
import Map from '../components/Map';
import Filters from '../components/Filters';
import accommodationsData from './../../data.json';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import Title from '../components/icons/Title';
export default function Home() {
  //const [filters, setFilters] = useState({});
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(1000);
  const [sortedAccommodations, setSortedAccommodations] = useState(null);
  const [colorScheme, setColorScheme] = useState("dark");

  const maxMinRadius = 30000;

  // const handleFilterChange = (key, value) => {
  //   setFilters((prev) => ({ ...prev, [key]: value }));
  // };

  const handleLocationUpdate = (newLocation) => {
    setLocation(newLocation);

    const updatedAccommodations = accommodationsData.map((accom) => {
      const distance = calculateDistance(newLocation.lat, newLocation.lng, accom.Latitude, accom.Longitude);
      return { ...accom, distance };
    });

    const sortedAccommodationsTemp = updatedAccommodations.sort((a, b) => a.distance - b.distance);
    const minRadius = sortedAccommodationsTemp[0].distance;
    setSortedAccommodations(sortedAccommodationsTemp);

    if (radius < minRadius) {
      if (minRadius + 100 < maxMinRadius) {
        setRadius(minRadius + 100);
      } else {
        setRadius(maxMinRadius);
      }
    }
  };

  const handleRadiusUpdate = (newRadius) => {
    setRadius(newRadius);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
  }, [location]);

  const ReverseColorScheme = (scheme) => {
    if (scheme === "dark") {
      return "light";
    }
    return "dark";
  };

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkScheme) {
      document.documentElement.classList.add("dark");
      setColorScheme("dark");
    } else {
      setColorScheme("light");
    }
  }, []);


  return (

    <Provider store={store}>
      <div className="app-container">
        <div className="filters-container">
          <div className="title flex items-center justify-between m-4 gap-x-2">
            <Title className="lanka-accom-title" />
            <button
              className="iconContainer"
              onClick={() => {
                const newColorScheme = ReverseColorScheme(colorScheme);
                document.documentElement.style.setProperty("color-scheme", newColorScheme);
                setColorScheme(newColorScheme);

                if (newColorScheme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              }}
            >
              {colorScheme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

          </div>
          <Filters onLocationUpdate={handleLocationUpdate} onRadiusUpdate={handleRadiusUpdate} radius={radius} />

        </div>
        <div className="map-container">
          <Map accommodations={sortedAccommodations} location={location} radius={radius} />
        </div>
      </div>
    </Provider>

  );
}
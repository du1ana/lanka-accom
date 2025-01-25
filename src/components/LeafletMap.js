import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import typeToIcon from '../utils/typeToIcon';
import { updateAccommodations } from './actions/actions';
import { useDispatch } from 'react-redux';
import takeWindowSize from './../utils/takeWindowSize';

// const toSingular = {
//   'Guest Houses': 'Guest House',
//   'Home Stay Units': 'Home Stay Unit',
//   'Hotels': 'Hotel',
//   'Bungalows': 'Bungalow',
//   'Rented Apartments': 'Rented Apartment',
//   'Rented Homes': 'Rented Home',
//   'Heritage Bungalows': 'Heritage Bungalow',
//   'Heritage Homes': 'Heritage Home',
// };

export default function LeafletMap({ accommodations, location, radius }) {
  const dispatch = useDispatch();
  const typeFilter = useSelector(state => state.typeFilter.typeFilter);

  const getZoomLevel = (radius) => {
    const maxRadius = 11750;
    const minRadius = 0;
    let maxZoom = 15;
    let minZoom = 11;

    let windowSize = takeWindowSize();
    let isPortrait = windowSize.width <= windowSize.height;
    if (isPortrait) {
      maxZoom -= 1;
      minZoom -= 1;
    }

    if (radius >= maxRadius) return minZoom;
    if (radius <= minRadius) return maxZoom;

    let zoomLevel = maxZoom - ((radius - minRadius) / (maxRadius - minRadius)) * (maxZoom - minZoom);

    return Math.round(zoomLevel);
  };

  const zoomLevel = getZoomLevel(radius);

  const MapUpdater = ({ location }) => {
    const map = useMap();

    useEffect(() => {
      if (location) {
        map.setView([location.lat, location.lng], zoomLevel);
      }
    }, [location, map]);

    return null;
  };

  const createCustomIcon = (type) => {
    const [iconUrl, bgColor] = typeToIcon[type];

    const svgIcon = `
      <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="15" fill="${bgColor}" />
        <image className="accom-svg-icon" href="${iconUrl}" x="5" y="5" height="20" width="20" fill="#000" />
      </svg>
    `;

    return L.divIcon({
      html: svgIcon,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };



  const nearbyAccommodations = [];
  if (location) {
    const index = accommodations.findIndex(accom => {
      return accom.distance > radius;
    });

    if (index === -1) {
      nearbyAccommodations.push(...accommodations);
    } else {
      nearbyAccommodations.push(...accommodations.slice(0, index));
    }
  }

  function getTitleCase(str) {
    return str.replace(
      /(\w)(\w*)/g,
      (_, firstChar, rest) => firstChar + rest.toLowerCase()
    );
  }

  const getBadgeClass = (grade) => {
    switch (grade) {
      case '★★★★★':
      case '★★★★☆':
      case 'A':
      case 'DELUXE':
        return 'bg-green-100 text-green-800 dark:text-green-100 dark:bg-green-800';
      case '★★★☆☆':
      case 'B':
      case 'SUPERIOR':
        return 'bg-yellow-100 text-yellow-800 dark:text-yellow-100 dark:bg-yellow-800';
      case '★★☆☆☆':
      case '★☆☆☆☆':
      case 'C':
      case 'STANDARD':
        return 'bg-red-100 text-red-800 dark:text-red-100 dark:bg-red-800';
      default:
        return 'bg-indigo-100 text-indigo-800 dark:text-indigo-100 dark:bg-indigo-800';
    }
  };

  useEffect(() =>{
    dispatch(updateAccommodations(nearbyAccommodations));
  })

  return (
    <MapContainer center={location ? [location.lat, location.lng] : [7.8731, 80.7718]} zoom={location ? 13 : 8} style={{ height: "100%", minHeight: "100%" }} attributionControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {location && (
        <div>
          <Circle
            center={[location.lat, location.lng]}
            radius={radius}
            color="#6366f1"
            fillColor="#6366f1"
            fillOpacity={0.2}
          />
          <Circle
            center={[location.lat, location.lng]}
            radius={radius < 10000 ? radius : 10000}
            stroke={false}
            fillColor="#6366f1"
            fillOpacity={0.2}
          />
          <Circle
            center={[location.lat, location.lng]}
            radius={radius < 20000 ? radius : 20000}
            stroke={false}
            fillColor="#6366f1"
            fillOpacity={0.2}
          />
        </div>
      )}

      {location && nearbyAccommodations.filter(accom => typeFilter.includes(accom.Type)).map((accom, index) => (
        <Marker
          key={index}
          position={[accom.Latitude, accom.Longitude]}
          icon={createCustomIcon(accom.Type)}
        >
          <Popup className="leaflet-popup-content-wrapper">

            <svg className="popup-accom-image" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="15" fill={typeToIcon[accom.Type][1]} />
              <image xlinkHref={typeToIcon[accom.Type][0]} x="5" y="5" height="20" width="20" fill="#000" />
            </svg>
            <h5 className="pt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{getTitleCase(accom.Name)}</h5>
            <p className="popup-content-address font-normal text-gray-700 dark:text-gray-400">{getTitleCase(accom.Address)}</p>
            <p className="popup-content font-normal text-gray-700 dark:text-gray-400">Rooms: {accom.Rooms}</p>
            <p className="popup-content font-normal text-gray-700 dark:text-gray-400">Grade: <span className={getBadgeClass(accom.Grade)+" px-1 rounded font-thin"}> <b>{accom.Grade}</b></span></p>
          </Popup>
        </Marker>
      ))}
      <MapUpdater location={location} />
    </MapContainer>
  );
}
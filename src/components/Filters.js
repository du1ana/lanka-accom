import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress, setLocation, updateTypeFilter } from './actions/actions';
import { MagnifyingGlassIcon, ChevronDoubleDownIcon, ChevronDoubleUpIcon, BuildingOffice2Icon, ViewfinderCircleIcon } from '@heroicons/react/24/solid';

const Filters = ({ onLocationUpdate, onRadiusUpdate, radius }) => {
  const dispatch = useDispatch();
  const address = useSelector((state) => state.address.address);
  const location = useSelector((state) => state.address.location);
  const typeFilter = useSelector(state => state.typeFilter);
  const [errorTitle, setErrorTitle] = useState(null);
  const [errorBody, setErrorBody] = useState(null);
  const [disableSearch, setDisableSearch] = useState(false);
  const [currSearch, setCurrSearch] = useState("");
  const [showRadiusSlider, setShowRadiusSlider] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);

  const toggleRadiusSlider = () => setShowRadiusSlider(!showRadiusSlider);
  const toggleTypeFilter = () => setShowTypeFilter(!showTypeFilter);

  const handleRadiusChange = (event) => {
    const newRadius = event.target.value;
    onRadiusUpdate(newRadius);
  };

  const nearbyAccommodations = useSelector((state) => state.nearbyAccommodations);
  let uniqueAccomodationTypes = [];
  if (location && nearbyAccommodations?.nearbyAccommodations) {
    uniqueAccomodationTypes = [...new Set(nearbyAccommodations?.nearbyAccommodations.map(accommodation => accommodation?.Type))]
  }

  const handleCheckboxChange = (type) => {
    dispatch(updateTypeFilter(type));
  };

  const handleAddressChange = (e) => {
    setErrorTitle(null);
    setErrorBody(null);

    dispatch(setAddress(e.target.value));
    if (currSearch.toLowerCase() == e.target.value.toLowerCase()) {
      setDisableSearch(true);
    } else {
      setDisableSearch(false);
    }
  };

  const handleAddressSubmit = async () => {
    setDisableSearch(true);
    setCurrSearch(address);
    if (!address.trim()) return;

    let formattedAddress = address.trim();
    if (!address.trim().toLowerCase().endsWith("sri lanka")) {
      formattedAddress = `${formattedAddress}, Sri Lanka`;
    }

    let s1 = "api.openca"
    let s2 = "gedata.com/geo";
    let s3 = "code/v1/j"

    try {
      const response = await fetch(
        `https://${s1}${s2}${s3}son?q=${encodeURIComponent(
          formattedAddress
        )}&key=185d69e3c2cf4122a9f6aa651f7458be`
      );

      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        if (lat == 7.75 || lng == 80.75) {
          setErrorTitle('Oops!');
          setErrorBody('Could not find the given address.');
          return;
        }
        dispatch(setLocation({ lat, lng }));
        onLocationUpdate({ lat, lng });
        setErrorTitle(null);
        setErrorBody(null);
      } else {
        setErrorTitle('Uh-oh!');
        setErrorBody('Could not find the given address.');
      }
    } catch (error) {
      setErrorTitle('Yikes.');
      setErrorBody('Failed to fetch the address. Please try again.');
      console.log(error);
      setDisableSearch(false);
      setCurrSearch('');
    }
  };

  return (
    <div>
      <div>
        <div className="relative mb-6 flex">
          <div className="relative z-0  w-full">
            <input type="text" id="address_input"
              value={address}
              onChange={handleAddressChange}
              className={errorTitle ? "py-3 px-4 block w-full text-red-900 bg-transparent appearance-none dark:text-red-400 dark:border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" :
                "py-3 px-4 block w-full bg-transparent appearance-none dark:border-gray-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"} placeholder=" " />
            <label htmlFor="address_input" className={errorTitle ? "absolute text-sm text-red-900 dark:text-red-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-red-600 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto" :
              "absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            }
            > Enter an address</label>
          </div>
          <button type="button"
            onClick={handleAddressSubmit}
            className="address-submit-btn py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none"
            disabled={disableSearch || !address.trim()}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
          <button
            onClick={toggleRadiusSlider}
            disabled={!location}
            className="filter-mv py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            <ViewfinderCircleIcon className="h-5 w-5"/>
            {showRadiusSlider ? <ChevronDoubleUpIcon className="h-5 w-5"/> : <ChevronDoubleDownIcon className="h-5 w-5"/>}
          </button>
          <button
            onClick={toggleTypeFilter}
            disabled={!location}
            className="filter-mv py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            <BuildingOffice2Icon className="h-5 w-5"/>
            {showTypeFilter ? <ChevronDoubleUpIcon className="h-5 w-5"/> : <ChevronDoubleDownIcon className="h-5 w-5"/>}
          </button>

        </div>

        <div className="error-message-section">
          <div>
            {location && nearbyAccommodations?.nearbyAccommodations?.length == 0 && (<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <b>Uh-oh!</b> <br />No accommodations nearby. <br />Try increasing the search radius or changing the address.
            </div>)}
            {errorTitle && (<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <b>{errorTitle}</b> <br /> {errorBody}
            </div>)}
          </div>
        </div>

        <div className="radius-slider-section filter-dv">
        <p>Search Radius: {radius<1000?radius+"m":parseFloat(radius/1000).toFixed(2)+"km"}</p>
          <div className="relative mb-6">
            <input id="labels-range-input"
              type="range" min="250" max="30000"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-500 dark:accent-indigo-400"
              value={radius}
              onChange={handleRadiusChange}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">250 m</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">10 km</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">20 km</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">30 km</span>
          </div>
        </div>

        <div className="type-filter-section filter-dv">
          <ul className="flex flex-wrap sm:block items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {uniqueAccomodationTypes && uniqueAccomodationTypes.map(type => (
              <li key={type} className="w-full border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center ps-3">
                  <input
                    id={`${type}-checkbox-list`}
                    type="checkbox"
                    checked={typeFilter && typeFilter.typeFilter.includes(type)}
                    className="w-4 h-4 accent-indigo-600 dark:accent-indigo-400 rounded focus:ring-2 ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500"
                    onChange={() => handleCheckboxChange(type)}
                  />
                  <label
                    htmlFor={`${type}-checkbox-list`}
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {type}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>


        <div className="radius-slider-section filter-mv">
          {showRadiusSlider && (
            <>
              <p>Search Radius: {radius<1000?radius+"m":parseFloat(radius/1000).toFixed(2)+"km"}</p>
              <div className="relative mb-6">
                <input
                  id="labels-range-input"
                  type="range"
                  min="250"
                  max="30000"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  value={radius}
                  onChange={handleRadiusChange}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">250 m</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">10 km</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">20 km</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">30 km</span>
              </div>
            </>
          )}
        </div>

        <div className="type-filter-section filter-mv">
          {showTypeFilter && (
            <ul className="flex flex-wrap sm:block items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {uniqueAccomodationTypes && uniqueAccomodationTypes.map(type => (
                <li key={type} className="w-full border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id={`${type}-checkbox-list`}
                      type="checkbox"
                      checked={typeFilter && typeFilter.typeFilter.includes(type)}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      onChange={() => handleCheckboxChange(type)}
                    />
                    <label
                      htmlFor={`${type}-checkbox-list`}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {type}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>




      </div>




    </div>
  );
};

export default Filters;
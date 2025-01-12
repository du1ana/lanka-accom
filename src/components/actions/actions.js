export const setAddress = (address) => ({
    type: 'SET_ADDRESS',
    payload: address,
  });
  
  export const setLocation = (location) => ({
    type: 'SET_LOCATION',
    payload: location,
  });

  export const setRadius = (radius) => ({
    type: 'SET_RADIUS',
    radius: radius
  });

  export const updateAccommodations = (nearbyAccommodations) => ({
    type: 'UPDATE_ACCOMMODATIONS',
    nearbyAccommodations: nearbyAccommodations
  });

  export const updateTypeFilter = (type) => ({
    type: 'UPDATE_TYPE_FILTER',
    payload: type
  });

  
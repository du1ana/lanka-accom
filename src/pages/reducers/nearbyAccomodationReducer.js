const initialState = {
  nearbyAccommodations: []
};

const nearbyAccommodationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_ACCOMMODATIONS':
      return {
        ...state,
        nearbyAccommodations: action.nearbyAccommodations
      };
    default:
      return state;
  }
};

export default nearbyAccommodationsReducer;
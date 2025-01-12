const initialState = {
    address: '',
    location: null,
  };
  
  const addressReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_ADDRESS':
        return {
          ...state,
          address: action.payload,
        };
      case 'SET_LOCATION':
        return {
          ...state,
          location: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default addressReducer;
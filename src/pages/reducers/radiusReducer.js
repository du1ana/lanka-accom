const initialState = {
    radius: 1000
  };
  
  const radiusReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_RADIUS':
        return {
          ...state,
          radius: action.radius
        };
      default:
        return state;
    }
  };
  
  export default radiusReducer;
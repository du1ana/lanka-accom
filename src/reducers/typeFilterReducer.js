const initialState = {
    typeFilter: ['Guest Houses', 'Home Stay Units', 'Hotels', 'Bungalows', 'Rented Apartments', 'Rented Homes', 'Heritage Bungalows', 'Heritage Homes'],
  };
  
  const typeFilterReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_TYPE_FILTER':
        return {
          ...state,
          typeFilter: state.typeFilter.includes(action.payload)
          ? state.typeFilter.filter(t => t !== action.payload)
          : [...state.typeFilter, action.payload],
        };
      default:
        return state;
    }
  };
  
  export default typeFilterReducer;
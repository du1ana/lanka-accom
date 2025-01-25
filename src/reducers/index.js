import { combineReducers } from 'redux';
import addressReducer from './addressReducer';
import radiusReducer from './radiusReducer';
import nearbyAccommodationsReducer from './nearbyAccomodationReducer';
import typeFilterReducer from './typeFilterReducer';

const rootReducer = combineReducers({
  address: addressReducer,
  radius: radiusReducer,
  nearbyAccommodations: nearbyAccommodationsReducer,
  typeFilter: typeFilterReducer
});

export default rootReducer;
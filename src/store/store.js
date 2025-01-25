import { createStore } from 'redux';
import rootReducer from '../pages/reducers';

const store = createStore(rootReducer);

export default store;
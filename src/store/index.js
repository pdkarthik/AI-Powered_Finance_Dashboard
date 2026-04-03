import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import financeReducer from './reducer';

const rootReducer = combineReducers({
  finance: financeReducer
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);
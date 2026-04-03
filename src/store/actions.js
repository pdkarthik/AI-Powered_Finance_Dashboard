import * as types from './actionTypes';
import { mockApi } from '../api/mockApi';

const showNotification = (dispatch, message, type = 'success') => {
  dispatch({ 
    type: types.SET_NOTIFICATION, 
    payload: { message, type, id: Date.now() } 
  });
  setTimeout(() => dispatch({ type: types.CLEAR_NOTIFICATION }), 3000);
};

export const fetchTransactions = (params) => async (dispatch) => {
  dispatch({ type: types.FETCH_TRANSACTIONS_START });
  try {
    const data = await mockApi.getTransactions(params);
    dispatch({ type: types.FETCH_TRANSACTIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: types.FETCH_TRANSACTIONS_FAILURE, payload: error.message });
    showNotification(dispatch, error.message, 'error');
  }
};

export const addTransaction = (tx) => async (dispatch) => {
  dispatch({ type: types.TRANSACTION_OP_START });
  try {
    const newTx = await mockApi.saveTransaction(tx);
    dispatch({ type: types.ADD_TRANSACTION_SUCCESS, payload: newTx });
    showNotification(dispatch, "Transaction added successfully");
  } catch (error) {
    showNotification(dispatch, error.message, 'error');
  } finally {
    dispatch({ type: types.TRANSACTION_OP_END });
  }
};

export const editTransaction = (tx) => async (dispatch) => {
  dispatch({ type: types.TRANSACTION_OP_START });
  try {
    const updatedTx = await mockApi.updateTransaction(tx);
    dispatch({ type: types.EDIT_TRANSACTION_SUCCESS, payload: updatedTx });
    showNotification(dispatch, "Transaction updated successfully");
  } catch (error) {
    showNotification(dispatch, error.message, 'error');
  } finally {
    dispatch({ type: types.TRANSACTION_OP_END });
  }
};

export const removeTransaction = (id) => async (dispatch) => {
  dispatch({ type: types.TRANSACTION_OP_START });
  try {
    await mockApi.deleteTransaction(id);
    dispatch({ type: types.DELETE_TRANSACTION_SUCCESS, payload: id });
    showNotification(dispatch, "Transaction deleted successfully");
  } catch (error) {
    showNotification(dispatch, error.message, 'error');
  } finally {
    dispatch({ type: types.TRANSACTION_OP_END });
  }
};

export const setRole = (role) => ({ type: types.SET_ROLE, payload: role });
export const toggleTheme = () => ({ type: types.TOGGLE_THEME });
export const setFilters = (filters) => ({ type: types.SET_FILTERS, payload: filters });
export const setGroupBy = (mode) => ({ type: types.SET_GROUP_BY, payload: mode });
export const resetFilters = () => ({ type: types.RESET_FILTERS });
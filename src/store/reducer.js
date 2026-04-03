import * as types from './actionTypes';

const initialState = {
  transactions: [],
  loading: false,
  isProcessing: false, // For individual CRUD ops
  error: null,
  notification: null,
  role: localStorage.getItem('finance_role') || 'viewer',
  isDarkMode: localStorage.getItem('finance_theme') === 'dark',
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' }
  },
  groupBy: 'none'
};

const financeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_TRANSACTIONS_START:
      return { ...state, loading: true, error: null };
    
    case types.FETCH_TRANSACTIONS_SUCCESS:
      return { ...state, loading: false, transactions: action.payload };
    
    case types.FETCH_TRANSACTIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.TRANSACTION_OP_START:
      return { ...state, isProcessing: true };
    
    case types.TRANSACTION_OP_END:
      return { ...state, isProcessing: false };

    case types.ADD_TRANSACTION_SUCCESS:
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case types.EDIT_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };

    case types.DELETE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };

    case types.SET_NOTIFICATION:
      return { ...state, notification: action.payload };
    
    case types.CLEAR_NOTIFICATION:
      return { ...state, notification: null };

    case types.SET_ROLE:
      localStorage.setItem('finance_role', action.payload);
      return { ...state, role: action.payload };

    case types.TOGGLE_THEME:
      const nextTheme = !state.isDarkMode;
      localStorage.setItem('finance_theme', nextTheme ? 'dark' : 'light');
      return { ...state, isDarkMode: nextTheme };

    case types.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case types.SET_GROUP_BY:
      return { ...state, groupBy: action.payload };

    case types.RESET_FILTERS:
      return { ...state, filters: initialState.filters };

    default:
      return state;
  }
};

export default financeReducer;
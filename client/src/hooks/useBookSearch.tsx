import { useReducer } from 'react';
import { Book } from '../types';
import { API_BASE_URL } from '../constants';

enum BookSearchActionType {
  SET_LOADING = 'SET_LOADING',
  SEARCH_BOOKS = 'SEARCH_BOOKS',
  CLEAR_SEARCH = 'CLEAR_SEARCH',
}

export const useBookSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const searchBooks = async (title: string) => {
    try {
      dispatch({ type: BookSearchActionType.SET_LOADING, payload: true });
      const response = await fetch(`${API_BASE_URL}/books?title=${title}`);
      let data: Book[];
      switch (response.status) {
        case 200:
          data = await response.json();
          break;
        case 204: // No Content
          data = [];
          break;
        default:
          throw new Error('There was a server issue.');
      }
      dispatch({ type: BookSearchActionType.SEARCH_BOOKS, payload: data });
    } catch (error) {
      console.error(error);
    }
    dispatch({ type: BookSearchActionType.SET_LOADING, payload: false });
  };

  const clearSearch = () =>
    dispatch({ type: BookSearchActionType.CLEAR_SEARCH });

  return { ...state, searchBooks, clearSearch };
};

interface BookSearchState {
  searchResults: Book[];
  hasSearched: boolean;
  loading: boolean;
}

const initialState = {
  searchResults: [],
  hasSearched: false,
  loading: false,
};

const reducer = (state: BookSearchState, action: BookSearchAction) => {
  switch (action.type) {
    case BookSearchActionType.SET_LOADING:
      return { ...state, loading: action.payload, hasSearched: true };
    case BookSearchActionType.SEARCH_BOOKS:
      return { ...state, searchResults: action.payload };
    case BookSearchActionType.CLEAR_SEARCH:
      return { ...state, searchResults: [], hasSearched: false };
    default:
      return state;
  }
};

type BookSearchAction =
  | ActionSetLoading
  | ActionSearchBooks
  | ActionClearSearch;

interface ActionSetLoading {
  type: BookSearchActionType.SET_LOADING;
  payload: boolean;
}

interface ActionSearchBooks {
  type: BookSearchActionType.SEARCH_BOOKS;
  payload: Book[];
}

interface ActionClearSearch {
  type: BookSearchActionType.CLEAR_SEARCH;
}

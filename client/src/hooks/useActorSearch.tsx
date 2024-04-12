import { useReducer } from 'react';
import { Actor } from '../types';
import { API_BASE_URL } from '../constants';

enum ActorSearchActionType {
  SET_LOADING = 'SET_LOADING',
  SEARCH_ACTORS = 'SEARCH_ACTORS',
  CLEAR_SEARCH = 'CLEAR_SEARCH',
}

export const useActorSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const searchActors = async (name: string) => {
    try {
      dispatch({ type: ActorSearchActionType.SET_LOADING, payload: true });
      const response = await fetch(`${API_BASE_URL}/actors?name=${name}`);
      let data: Actor[];
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
      dispatch({ type: ActorSearchActionType.SEARCH_ACTORS, payload: data });
    } catch (error) {
      console.error(error);
    }
    dispatch({ type: ActorSearchActionType.SET_LOADING, payload: false });
  };

  const clearSearch = () =>
    dispatch({ type: ActorSearchActionType.CLEAR_SEARCH });

  return { ...state, searchActors, clearSearch };
};

interface ActorSearchState {
  searchResults: Actor[];
  hasSearched: boolean;
  loading: boolean;
}

const initialState = {
  searchResults: [],
  hasSearched: false,
  loading: false,
};

const reducer = (state: ActorSearchState, action: ActorSearchAction) => {
  switch (action.type) {
    case ActorSearchActionType.SET_LOADING:
      return { ...state, loading: action.payload, hasSearched: true };
    case ActorSearchActionType.SEARCH_ACTORS:
      return { ...state, searchResults: action.payload };
    case ActorSearchActionType.CLEAR_SEARCH:
      return { ...state, searchResults: [], hasSearched: false };
    default:
      return state;
  }
};

type ActorSearchAction =
  | ActionSetLoading
  | ActionSearchActors
  | ActionClearSearch;

interface ActionSetLoading {
  type: ActorSearchActionType.SET_LOADING;
  payload: boolean;
}

interface ActionSearchActors {
  type: ActorSearchActionType.SEARCH_ACTORS;
  payload: Actor[];
}

interface ActionClearSearch {
  type: ActorSearchActionType.CLEAR_SEARCH;
}

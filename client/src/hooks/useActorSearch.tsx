import { useReducer } from 'react';
import { Actor } from '../types';
import { API_BASE_URL } from '../constants';

enum ActorSearchActionType {
  SEARCH_ACTORS = 'SEARCH_ACTORS',
  CLEAR_SEARCH = 'CLEAR_SEARCH',
}

export const useActorSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const searchActors = async (name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cast/search/${name}`);
      const data = await response.json();
      dispatch({ type: ActorSearchActionType.SEARCH_ACTORS, payload: data });
    } catch (error) {
      console.error(error);
    }
  };

  const clearSearch = () =>
    dispatch({ type: ActorSearchActionType.CLEAR_SEARCH, payload: null });

  return { ...state, searchActors, clearSearch };
};

interface ActorSearchState {
  searchResults: Actor[];
}

const initialState = {
  searchResults: [],
};

const reducer = (state: ActorSearchState, action: ActorSearchAction) => {
  switch (action.type) {
    case ActorSearchActionType.SEARCH_ACTORS:
      return { ...state, searchResults: action.payload };
    case ActorSearchActionType.CLEAR_SEARCH:
      return { ...state, searchResults: [] };
    default:
      return state;
  }
};

type ActorSearchAction = ActionSearchActors | ActionClearSearch;

interface ActionSearchActors {
  type: ActorSearchActionType.SEARCH_ACTORS;
  payload: Actor[];
}

interface ActionClearSearch {
  type: ActorSearchActionType.CLEAR_SEARCH;
  payload: null;
}

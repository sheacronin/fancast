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
      const response = await fetch(`${API_BASE_URL}/actors?name=${name}`);
      console.log(response);
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
  };

  const clearSearch = () =>
    dispatch({ type: ActorSearchActionType.CLEAR_SEARCH, payload: null });

  return { ...state, searchActors, clearSearch };
};

interface ActorSearchState {
  searchResults: Actor[];
  hasSearched: boolean;
}

const initialState = {
  searchResults: [],
  hasSearched: false,
};

const reducer = (state: ActorSearchState, action: ActorSearchAction) => {
  switch (action.type) {
    case ActorSearchActionType.SEARCH_ACTORS:
      return { ...state, searchResults: action.payload, hasSearched: true };
    case ActorSearchActionType.CLEAR_SEARCH:
      return { ...state, searchResults: [], hasSearched: false };
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

import { useCallback, useEffect, useReducer } from 'react';
import { Actor } from '../types';
import { API_BASE_URL } from '../constants';

enum ActorsActionType {
  GET_ACTORS = 'GET_ACTORS',
  SELECT_ACTOR = 'SELECT_ACTOR',
  TOGGLE_ADDING = 'TOGGLE_ADDING',
}

export const useActors = (characterId: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectedActor =
    state.actors.find((actor) => actor.id === state.selectedActorId) ||
    ACTOR_PLACEHOLDER;

  const getActors = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cast/character/${characterId}`
      );
      const data = await response.json();
      dispatch({ type: ActorsActionType.GET_ACTORS, payload: data });
    } catch (error) {
      console.error(error);
    }
  }, [characterId]);

  const selectActor = (actorId: string) =>
    dispatch({ type: ActorsActionType.SELECT_ACTOR, payload: actorId });

  const toggleAddingActor = (value = !state.addingActor) =>
    dispatch({
      type: ActorsActionType.TOGGLE_ADDING,
      payload: value,
    });

  useEffect(() => {
    getActors();
  }, [getActors]);

  return { ...state, selectedActor, selectActor, toggleAddingActor };
};

interface ActorsState {
  actors: Actor[];
  selectedActorId: string | null;
  addingActor: boolean;
}

const initialState = { actors: [], selectedActorId: null, addingActor: false };

const reducer = (state: ActorsState, action: ActorsAction) => {
  switch (action.type) {
    case ActorsActionType.GET_ACTORS:
      return { ...state, actors: action.payload };
    case ActorsActionType.SELECT_ACTOR:
      return { ...state, selectedActorId: action.payload };
    case ActorsActionType.TOGGLE_ADDING:
      return { ...state, addingActor: action.payload };
    default:
      return state;
  }
};

type ActorsAction = ActionGetActor | ActionSelectActor | ActionToggleAdding;

interface ActionGetActor {
  type: ActorsActionType.GET_ACTORS;
  payload: Actor[];
}

interface ActionSelectActor {
  type: ActorsActionType.SELECT_ACTOR;
  payload: string;
}

interface ActionToggleAdding {
  type: ActorsActionType.TOGGLE_ADDING;
  payload: boolean;
}

const ACTOR_PLACEHOLDER: Actor = {
  id: 'PLACEHOLDER',
  name: 'Unknown person',
  gender: 'nonbinary',
  imageLink:
    'https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg',
};

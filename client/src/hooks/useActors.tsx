import { useCallback, useEffect, useReducer } from 'react';
import { Actor } from '../types';
import { API_BASE_URL } from '../constants';

enum ActorsActionType {
  GET_ACTORS = 'GET_ACTORS',
  SELECT_ACTOR = 'SELECT_ACTOR',
  TOGGLE_ADDING = 'TOGGLE_ADDING',
  ADD_ACTOR = 'ADD_ACTOR',
}

export const useActors = (characterId: number) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectedActor =
    state.actors.find((actor) => actor.id === state.selectedActorId) ||
    ACTOR_PLACEHOLDER;

  const getActors = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/characters/${characterId}/actors`
      );
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
      dispatch({ type: ActorsActionType.GET_ACTORS, payload: data });
    } catch (error) {
      console.error(error);
    }
  }, [characterId]);

  const selectActor = (actorId: number) =>
    dispatch({ type: ActorsActionType.SELECT_ACTOR, payload: actorId });

  const toggleAddingActor = (value = !state.addingActor) =>
    dispatch({
      type: ActorsActionType.TOGGLE_ADDING,
      payload: value,
    });

  const addActor = async (actor: Actor) => {
    try {
      await fetch(`${API_BASE_URL}/characters/${characterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actor.id),
      });
      dispatch({
        type: ActorsActionType.ADD_ACTOR,
        // Sort updated actors alphabetically by name
        payload: [...state.actors, actor].sort((actorA, actorB) =>
          actorA.name > actorB.name ? 1 : -1
        ),
      });
      selectActor(actor.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getActors();
  }, [getActors]);

  return {
    ...state,
    selectedActor,
    selectActor,
    toggleAddingActor,
    addActor,
  };
};

interface ActorsState {
  actors: Actor[];
  selectedActorId: number | null;
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
    case ActorsActionType.ADD_ACTOR:
      return { ...state, actors: action.payload };
    default:
      return state;
  }
};

type ActorsAction =
  | ActionGetActor
  | ActionSelectActor
  | ActionToggleAdding
  | ActionAddActor;

interface ActionGetActor {
  type: ActorsActionType.GET_ACTORS;
  payload: Actor[];
}

interface ActionSelectActor {
  type: ActorsActionType.SELECT_ACTOR;
  payload: number;
}

interface ActionToggleAdding {
  type: ActorsActionType.TOGGLE_ADDING;
  payload: boolean;
}

interface ActionAddActor {
  type: ActorsActionType.ADD_ACTOR;
  payload: Actor[];
}

const ACTOR_PLACEHOLDER: Actor = {
  id: -1,
  name: 'Unknown person',
  gender: 'nonbinary',
  imageLink:
    'https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg',
};

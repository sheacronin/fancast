import { useCallback, useEffect, useReducer } from 'react';
import { Casting } from '../types';
import { API_BASE_URL } from '../constants';
import defaultActorImage from '../assets/default_actor.jpg';

enum CastingsActionType {
  SET_LOADING = 'SET_LOADING',
  GET_CASTINGS = 'GET_CASTINGS',
  SELECT_CASTING = 'SELECT_CASTING',
  TOGGLE_ADDING = 'TOGGLE_ADDING',
  ADD_CASTING = 'ADD_CASTING',
}

export const useCastings = (characterId: number, userId: number | null) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectedCasting =
    state.castings.find((casting) => casting.id === state.selectedCastingId) ||
    CASTING_PLACEHOLDER;

  const getCastings = useCallback(async () => {
    try {
      dispatch({ type: CastingsActionType.SET_LOADING, payload: true });
      const response = await fetch(
        `${API_BASE_URL}/characters/${characterId}/castings`
      );
      let data: Casting[];
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

      dispatch({ type: CastingsActionType.GET_CASTINGS, payload: data });

      if (userId) {
        const existingSelectedCasting = data.find(
          (casting) => casting.users?.some((user) => user.id === userId)
        );
        if (existingSelectedCasting) {
          dispatch({
            type: CastingsActionType.SELECT_CASTING,
            payload: existingSelectedCasting.id,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
    dispatch({ type: CastingsActionType.SET_LOADING, payload: false });
  }, [characterId, userId]);

  const selectCasting = async (castingId: number) => {
    try {
      await fetch(`${API_BASE_URL}/castings/${castingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      dispatch({ type: CastingsActionType.SELECT_CASTING, payload: castingId });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAddingCasting = (value = !state.addingCasting) =>
    dispatch({
      type: CastingsActionType.TOGGLE_ADDING,
      payload: value,
    });

  const addCasting = async (actorId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/characters/${characterId}/castings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actorId),
          credentials: 'include',
        }
      );
      const casting: Casting = await response.json();

      dispatch({
        type: CastingsActionType.ADD_CASTING,
        // Sort updated castings alphabetically by name
        payload: [...state.castings, casting].sort((castingA, castingB) =>
          castingA.actor.name > castingB.actor.name ? 1 : -1
        ),
      });
      dispatch({
        type: CastingsActionType.SELECT_CASTING,
        payload: casting.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCastings();
  }, [getCastings]);

  return {
    ...state,
    selectedCasting,
    selectCasting,
    toggleAddingCasting,
    addCasting,
  };
};

interface CastingsState {
  castings: Casting[];
  selectedCastingId: number | null;
  addingCasting: boolean;
  loading: boolean;
}

const initialState = {
  castings: [],
  selectedCastingId: null,
  addingCasting: false,
  loading: false,
};

const reducer = (state: CastingsState, action: CastingsAction) => {
  switch (action.type) {
    case CastingsActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case CastingsActionType.GET_CASTINGS:
      return { ...state, castings: action.payload };
    case CastingsActionType.SELECT_CASTING:
      return { ...state, selectedCastingId: action.payload };
    case CastingsActionType.TOGGLE_ADDING:
      return { ...state, addingCasting: action.payload };
    case CastingsActionType.ADD_CASTING:
      return { ...state, castings: action.payload };
    default:
      return state;
  }
};

type CastingsAction =
  | ActionSetLoading
  | ActionGetCasting
  | ActionSelectCasting
  | ActionToggleAdding
  | ActionAddCasting;

interface ActionSetLoading {
  type: CastingsActionType.SET_LOADING;
  payload: boolean;
}

interface ActionGetCasting {
  type: CastingsActionType.GET_CASTINGS;
  payload: Casting[];
}

interface ActionSelectCasting {
  type: CastingsActionType.SELECT_CASTING;
  payload: number;
}

interface ActionToggleAdding {
  type: CastingsActionType.TOGGLE_ADDING;
  payload: boolean;
}

interface ActionAddCasting {
  type: CastingsActionType.ADD_CASTING;
  payload: Casting[];
}

const CASTING_PLACEHOLDER: Casting = {
  id: -1,
  characterId: -1,
  createdAt: new Date('1/1/2000'),
  actorId: -1,
  actor: {
    id: -1,
    name: 'Unknown person',
    gender: 'nonbinary',
    imageLink: defaultActorImage,
  },
};

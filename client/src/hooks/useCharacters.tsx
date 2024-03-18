import { useReducer, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import type { Character } from '../types';

enum CharactersActionType {
  GET_CHARACTERS = 'GET_CHARACTERS',
  ADD_CHARACTER = 'ADD_CHARACTER',
  TOGGLE_ADDING = 'TOGGLE_ADDING',
}

export const useCharacters = (bookId: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getBookCharacters = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/books/${bookId}/characters`
      );
      const data = await response.json();
      dispatch({ payload: data, type: CharactersActionType.GET_CHARACTERS });
    } catch (error) {
      console.error(error);
    }
  }, [bookId]);

  const addCharacter = async (character: Omit<Character, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
      });
      const newCharacter = await response.json();
      dispatch({
        payload: [...state.characters, newCharacter],
        type: CharactersActionType.ADD_CHARACTER,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAddingCharacter = () =>
    dispatch({
      payload: !state.addingCharacter,
      type: CharactersActionType.TOGGLE_ADDING,
    });

  useEffect(() => {
    getBookCharacters();
  }, [getBookCharacters]);

  return { ...state, addCharacter, toggleAddingCharacter };
};

const reducer = (state: CharactersState, action: CharactersActions) => {
  switch (action.type) {
    case CharactersActionType.GET_CHARACTERS:
      return { ...state, characters: action.payload };
    case CharactersActionType.ADD_CHARACTER:
      return { ...state, characters: action.payload, addingCharacter: false };
    case CharactersActionType.TOGGLE_ADDING:
      return { ...state, addingCharacter: action.payload };
    default:
      return state;
  }
};

const initialState = { characters: [], addingCharacter: false };

interface CharactersState {
  characters: Character[];
  addingCharacter: boolean;
}

type CharactersActions =
  | ActionGetCharacters
  | ActionAddCharacter
  | ActionToggleAdding;

interface ActionGetCharacters {
  type: CharactersActionType.GET_CHARACTERS;
  payload: Character[];
}

interface ActionAddCharacter {
  type: CharactersActionType.ADD_CHARACTER;
  payload: Character[];
}

interface ActionToggleAdding {
  type: CharactersActionType.TOGGLE_ADDING;
  payload: boolean;
}

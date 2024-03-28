import { createContext, useReducer, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import { Outlet, useLocation } from 'react-router-dom';
import type { Dispatch } from 'react';

export const AuthContext = createContext<AuthInfo>({ user: null, error: '' });
export const AuthDispatchContext = createContext<Dispatch<AuthAction>>(
  () => null
);

interface AuthInfo {
  user: User | null;
  error: string;
}

interface User {
  id: number;
  username: string;
}

enum AuthActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ERROR = 'ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
}

type AuthAction = ActionLogin | ActionLogout | ActionError | ActionClearError;

interface ActionLogin {
  type: AuthActionType.LOGIN;
  payload: User;
}

interface ActionLogout {
  type: AuthActionType.LOGOUT;
}

interface ActionError {
  type: AuthActionType.ERROR;
  payload: string;
}

interface ActionClearError {
  type: AuthActionType.CLEAR_ERROR;
}

export function AuthProvider() {
  const [authInfo, dispatch] = useReducer(authReducer, {
    user: null,
    error: '',
  });
  const location = useLocation();

  useEffect(() => {
    fetchCurrentUser().then((user) =>
      dispatch({ type: AuthActionType.LOGIN, payload: user })
    );

    async function fetchCurrentUser() {
      const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        return await response.json();
      }

      // If the response isn't OK, return null user
      return null;
    }
  }, []);

  // Clear errors when user navigates to different page
  useEffect(() => {
    dispatch({ type: AuthActionType.CLEAR_ERROR });
  }, [location]);

  return (
    <AuthContext.Provider value={authInfo}>
      <AuthDispatchContext.Provider value={dispatch}>
        <Outlet />
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthDispatch() {
  const dispatch = useContext(AuthDispatchContext);

  const login = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const user = await response.json();
      dispatch({ type: AuthActionType.LOGIN, payload: user });
      dispatch({ type: AuthActionType.CLEAR_ERROR });
    } else {
      const error = await response.json();
      dispatch({ type: AuthActionType.ERROR, payload: error });
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    dispatch({ type: AuthActionType.LOGOUT });
  };

  const register = async (
    username: string,
    password: string,
    confirmPassword: string
  ) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        confirmPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      dispatch({ type: AuthActionType.ERROR, payload: error });
    } else {
      dispatch({ type: AuthActionType.CLEAR_ERROR });
    }
  };

  return { login, logout, register };
}

function authReducer(authInfo: AuthInfo, action: AuthAction) {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return { ...authInfo, user: action.payload || null };
    case AuthActionType.LOGOUT:
      return { ...authInfo, user: null };
    case AuthActionType.ERROR:
      return { ...authInfo, error: action.payload };
    case AuthActionType.CLEAR_ERROR:
      return { ...authInfo, error: '' };
    default:
      return authInfo;
  }
}

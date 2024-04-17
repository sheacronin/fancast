import { createContext, useReducer, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import {
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
  useLoaderData,
} from 'react-router-dom';
import type { Dispatch } from 'react';
import type { User } from '../types';

export const AuthContext = createContext<AuthInfo>({ user: null, error: '' });
export const AuthDispatchContext = createContext<Dispatch<AuthAction>>(
  () => null
);

interface AuthInfo {
  user: User | null;
  error: string;
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

export const AuthProvider = () => {
  const user = useLoaderData() as User;
  const [authInfo, dispatch] = useReducer(authReducer, {
    user,
    error: '',
  });
  const location = useLocation();

  // Clear errors when user navigates to different page
  useEffect(() => {
    if (authInfo.error) {
      dispatch({ type: AuthActionType.CLEAR_ERROR });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <AuthContext.Provider value={authInfo}>
      <AuthDispatchContext.Provider value={dispatch}>
        <Outlet />
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export const userLoader = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.status === 200) {
      return await response.json();
    }

    // If the response isn't 200 OK, return null user
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const UnauthenticatedRoute = () => {
  const { user } = useAuth();

  // Only allow access to this route if no logged in user
  return user === null ? <Outlet /> : <Navigate to="/" />;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useAuthDispatch = () => {
  const dispatch = useContext(AuthDispatchContext);
  const navigate = useNavigate();

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
      navigate('/', { replace: true });
    } else {
      const error = await response.json();
      dispatch({ type: AuthActionType.ERROR, payload: error });
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    dispatch({ type: AuthActionType.LOGOUT });
    navigate('/');
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

    if (response.ok) {
      navigate('/login');
    } else {
      const error = await response.json();
      dispatch({ type: AuthActionType.ERROR, payload: error });
    }
  };

  return { login, logout, register };
};

const authReducer = (authInfo: AuthInfo, action: AuthAction) => {
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
};

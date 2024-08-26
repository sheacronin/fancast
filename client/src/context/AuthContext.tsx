import { createContext, useReducer, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import {
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
  useLoaderData,
  redirect,
} from 'react-router-dom';
import { useResponseErrors } from '../hooks/useResponseErrors';
import type { Dispatch } from 'react';
import type { User } from '../types';
import type { ResponseErrors } from '../hooks/useResponseErrors';

export const AuthContext = createContext<AuthInfo>({
  user: null,
  loading: false,
  errors: null,
});
export const AuthDispatchContext = createContext<AuthDispatch>({
  dispatch: () => null,
  setResErrors: () => null,
  clearErrors: () => null,
});

interface AuthInfo {
  user: User | null;
  loading: boolean;
  errors: ResponseErrors | null;
}

interface AuthDispatch {
  dispatch: Dispatch<AuthAction>;
  setResErrors: (errors: ResponseErrors) => void;
  clearErrors: () => void;
}

enum AuthActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SET_LOADING = 'SET_LOADING',
}

type AuthAction = ActionLogin | ActionLogout | ActionSetLoading;

interface ActionLogin {
  type: AuthActionType.LOGIN;
  payload: User;
}

interface ActionLogout {
  type: AuthActionType.LOGOUT;
}

interface ActionSetLoading {
  type: AuthActionType.SET_LOADING;
  payload: boolean;
}

export const AuthProvider = () => {
  const user = useLoaderData() as User;
  const { errors, setResErrors, clearErrors } = useResponseErrors();
  const [authInfo, dispatch] = useReducer(authReducer, {
    user,
    loading: false,
  });
  const location = useLocation();

  // Clear errors when user navigates to different page
  useEffect(() => {
    if (errors) {
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <AuthContext.Provider value={{ ...authInfo, errors }}>
      <AuthDispatchContext.Provider
        value={{ dispatch, setResErrors, clearErrors }}
      >
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

export const flyRedirect = () => redirect('https://fancast.fly.dev/', 301);

export const UnauthenticatedRoute = () => {
  const { user } = useAuth();

  // Only allow access to this route if no logged in user
  return user === null ? <Outlet /> : <Navigate to="/" />;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useAuthDispatch = () => {
  const { dispatch, setResErrors, clearErrors } =
    useContext(AuthDispatchContext);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    clearErrors();
    dispatch({ type: AuthActionType.SET_LOADING, payload: true });

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
      const { errors } = await response.json();
      setResErrors(errors);
    }
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  };

  const logout = async () => {
    dispatch({ type: AuthActionType.SET_LOADING, payload: true });
    await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    dispatch({ type: AuthActionType.LOGOUT });
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
    navigate('/');
  };

  const register = async (
    username: string,
    password: string,
    confirmPassword: string
  ) => {
    clearErrors();
    dispatch({ type: AuthActionType.SET_LOADING, payload: true });

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
      const { errors } = await response.json();
      setResErrors(errors);
    }
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  };

  return { login, logout, register, clearErrors };
};

const authReducer = (
  authInfo: Omit<AuthInfo, 'errors'>,
  action: AuthAction
) => {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return { ...authInfo, user: action.payload || null };
    case AuthActionType.LOGOUT:
      return { ...authInfo, user: null };
    case AuthActionType.SET_LOADING:
      return { ...authInfo, loading: action.payload };
    default:
      return authInfo;
  }
};

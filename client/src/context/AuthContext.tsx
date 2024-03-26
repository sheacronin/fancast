import { createContext, useReducer, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import type { ReactNode, Dispatch } from 'react';

export const AuthContext = createContext<AuthInfo>({ user: null });
export const AuthDispatchContext = createContext<Dispatch<AuthDispatchAction>>(
  () => null
);

interface AuthInfo {
  user: User | null;
}

interface User {
  id: number;
  username: string;
}

interface AuthDispatchAction {
  type: 'login' | 'logout';
  payload?: User;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authInfo, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    fetchCurrentUser().then((user) =>
      dispatch({ type: 'login', payload: user })
    );

    async function fetchCurrentUser() {
      const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.status === 200) {
        return await response.json();
      }

      // If the response isn't OK, return null user
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthDispatch() {
  const dispatch = useContext(AuthDispatchContext);

  const login = (user: User) => dispatch({ type: 'login', payload: user });
  const logout = () => dispatch({ type: 'logout' });

  return { login, logout };
}

function authReducer(authInfo: AuthInfo, action: AuthDispatchAction) {
  switch (action.type) {
    case 'login':
      return { user: action.payload || null };
    case 'logout':
      return { user: null };
  }
}

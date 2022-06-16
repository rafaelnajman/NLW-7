import React, { createContext, useContext, useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLIENT_ID = "8f11edc9e6596ea5dfff";
const SCOPE = "read:user";
const USER_STORAGE_KEY = "@app:user";
const TOKEN_STORAGE_KEY = "@app:token";

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
};

type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthResponse = {
  token: string;
  user: User;
};
type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  };
  type?: string;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(true);

  async function signIn() {
    try {
      setIsSigningIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope${SCOPE}`;
      const authSessionResponse = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      //console.log(params);

      if (
        authSessionResponse.type === "success" &&
        authSessionResponse.params.error !== "acess_denied"
      ) {
        const authResponse = await api.post("/authenticate", {
          code: authSessionResponse.params.code,
        });
        const { token, user } = authResponse.data as AuthResponse;

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
        setUser(user);
      }

      setIsSigningIn(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSigningIn(false);
    }
  }
  async function signOut() {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  useEffect(() => {
    async function loadUserStoredData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (userStorage && tokenStorage) {
        const user = JSON.parse(userStorage);
        //const token = JSON.parse(tokenStorage);
        api.defaults.headers.common["Authorization"] = `Bearer ${tokenStorage}`;
        setUser(user);
      }
      setIsSigningIn(false);
    }

    loadUserStoredData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isSigningIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };

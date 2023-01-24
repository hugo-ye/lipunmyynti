import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as authSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthUserContext);

export function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };

  const authStateChanged = async (user) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }
    setAuthUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });
    setIsLoading(false);
  };

  const signIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOut = () =>
    authSignOut(auth).then(() => {
      setAuthUser(null);
      setIsLoading(false);
    });


  return {
    authUser,
    isLoading,
    signIn,
    signOut,
  };
}

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();

  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
}



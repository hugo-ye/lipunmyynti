import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as authSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

export function useFirebaseAuth() {
  // Declares the states with their initial default values
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // UseEffect function that updates the auth state values
  useEffect(() => {
    /* Calls authStateChanged when onAuthStateChanged listener
       detects a change
    */
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    // unsubscribe cleans up the useEffect function
    return () => unsubscribe();
  }, []);

  // AuthStateChanged function updates the value of the states
  const authStateChanged = async (user) => {
    setIsLoading(true);
    // If the user no longer exists, the auth states are emptied
    if (!user) {
      setAuthUser(null);
      setIsLoading(false);
      return;
    }
    // Otherwise, the auth states are set with the new user values
    setAuthUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });
    setIsLoading(false);
  };

  // Sign in with Google function
  const signIn = () => {
    // Defines the authentication provider to be Google
    const provider = new GoogleAuthProvider();
    // Calls a popup with associated authentication parameters
    signInWithPopup(auth, provider);
  };

  // Sign out function clears the states
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

// Creates a context, "state exporter"
const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
});

// A function that imports the context, imported by components that use the context
export const useAuth = () => useContext(AuthUserContext);

// Provider that wraps around components that require the context values
export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();

  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
}

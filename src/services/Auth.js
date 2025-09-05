import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GlobalContext } from "../globalContext";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [, setGlobal] = React.useContext(GlobalContext);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setGlobal({
          type: "setUser",
          payload: {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoUrl: user.photoUrl,
            uid: user.uid,
          },
          isCheckingAuth: false
        });
      } else {
        navigate("/login");
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthContext = React.createContext(null);
export { AuthContext };

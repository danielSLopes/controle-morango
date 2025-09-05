import React, { createContext, useReducer } from "react";

const initialState = {
  loading: false,
  isCheckingAuth: true,
  user: {
    displayName: null,
    emailAuth: null,
    phoneNumber: null,
    photoURL: null,
    uid: null,
    emailVerified: null,
    acceptMsg: false,
    ativo: false,
    cpf: "",
    email: "",
    firstname: "",
    uf: "",
    userType: 0,
  },
  showSnackError: false,
  mensagemSnackError: "Erro genérico",
  codeSnackError: "Code 0",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setUser":
      return { ...state, user: action.payload, isCheckingAuth: false };
    case "isCheckingAuth":
      return { ...state, isCheckingAuth: action.payload };
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setShowSnackError":
      return { ...state, showSnackError: action.payload };
    case "setMensagemSnackError":
      return { ...state, mensagemSnackError: action.payload };
    default:
      return state;
  }
};

const GlobalContext = createContext(initialState);
const GlobalContextProvider = (props) => (
  <GlobalContext.Provider value={useReducer(reducer, initialState)}>
    {props.children}
  </GlobalContext.Provider>
);

export { GlobalContext, GlobalContextProvider };

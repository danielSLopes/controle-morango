import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { GlobalContextProvider } from "./globalContext";
import RoutesList from "./Routes";
import { AuthContext, AuthProvider } from "./services/Auth";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <GlobalContextProvider>
      <AuthProvider>
        <RoutesList props={AuthContext} />
      </AuthProvider>
    </GlobalContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

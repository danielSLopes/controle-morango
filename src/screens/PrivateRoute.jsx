// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React, { useContext } from "react";
import { Route, redirect } from "react-router-dom";
import { GlobalContext } from "../globalContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Add your own authentication on the below line.
  const [global, setGlobal] = useContext(GlobalContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        global.isCheckingAuth ? (
          <Component {...props} />
        ) : (
          <redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;

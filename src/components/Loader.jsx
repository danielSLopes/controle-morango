import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { GlobalContext } from "../globalContext";

export default function Loader() {
  const [global] = React.useContext(GlobalContext);
  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={global.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

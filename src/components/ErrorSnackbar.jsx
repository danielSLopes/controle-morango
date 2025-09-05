import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { GlobalContext } from "../globalContext";
import { Alert } from "@mui/material";

export default function ErrorSnackbar() {
  const [global, setGlobal] = React.useContext(GlobalContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setGlobal({
      type: "setShowSnackError",
      payload: false,
    });
  };

  return (
    <Snackbar
      open={global.showSnackError}
      autoHideDuration={5000}
      severity="success"
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {global.mensagemSnackError}
      </Alert>
    </Snackbar>
  );
}

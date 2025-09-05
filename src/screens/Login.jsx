import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { GlobalContext } from "../globalContext";
import { useNavigate } from "react-router-dom";
import firebaseConfig from "../services/firebase";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseConfig);

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function Login() {
  const [loginError, setLoginError] = React.useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [values, setValues] = React.useState({
    login: "",
    password: "",
  });
  const [, setGlobal] = React.useContext(GlobalContext);
  const navigate = useNavigate();

  const validateInputs = () => {
    const login = document.getElementById("login");
    const password = document.getElementById("password");

    let isValid = true;

    if (!login.value) {
      setLoginError(true);
      setLoginErrorMessage("Login inválido");
      isValid = false;
    } else {
      setLoginError(false);
      setLoginErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const callLogin = () => {
    const valid = validateInputs();

    if (valid) {
      setGlobal({
        type: "setLoading",
        payload: true,
      });
      signInWithEmailAndPassword(auth, values.login, values.password)
        .then((userCredential) => {
          // console.log(userCredential)
          setGlobal({
            type: "setUser",
            payload: {
              email: userCredential.user.email,
              uid: userCredential.user.uid,
            },
          });
          setGlobal({
            type: "setLoading",
            payload: false,
          });
          navigate("/");
        })
        .catch(() => {
          setGlobal({
            type: "setMensagemSnackError",
            payload: "Usuário inválido",
          });
          setGlobal({
            type: "setShowSnackError",
            payload: true,
          });
          setGlobal({
            type: "setLoading",
            payload: false,
          });
        });
    }
  };

  const handleKeyPress = (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      callLogin();
    }
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <ThemeProvider theme={demoTheme}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              textAlign: "center",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
            }}
          >
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Usuário</FormLabel>
              <TextField
                error={loginError}
                helperText={loginErrorMessage}
                id="login"
                type="text"
                name="login"
                placeholder=""
                autoFocus
                required
                fullWidth
                variant="standard"
                color={loginError ? "error" : "primary"}
                onChange={handleChange}
                value={values.login}
                onKeyDown={handleKeyPress}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="standard"
                color={passwordError ? "error" : "primary"}
                onChange={handleChange}
                value={values.senha}
                onKeyDown={handleKeyPress}
              />
            </FormControl>
            <Button fullWidth variant="contained" onClick={callLogin}>
              Entrar
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </ThemeProvider>
  );
}

export default Login;

import React, { Suspense, useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Template from "./components/Template";
import { GlobalContext } from "./globalContext";
import { ThemeProvider } from "styled-components";
import { Backdrop, CircularProgress, createTheme } from "@mui/material";
import Login from "./screens/Login";
import Relatorio from "./screens/Relatorio";
import CadastroProdutor from "./screens/Cadastros/CadastroProdutor";
import CadastroMeeiro from "./screens/Cadastros/CadastroMeeiro";
import CadastroQualidade from "./screens/Cadastros/CadastroQualidade";
import Lancamento from "./screens/Lancamento";
import ErrorSnackbar from "./components/ErrorSnackbar";
import Loader from "./components/Loader";

const theme = createTheme({
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

export default function RoutesList(props) {

  return (
    <ThemeProvider theme={theme}>
      <Template>
        <Suspense
          fallback={
            <Backdrop open={true}>
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        ></Suspense>
        <ErrorSnackbar />
        <Loader />
        <Routes>
          <Route path="/" element={<div>Hello world!</div>} />
          <Route path="/relatorio" element={<Relatorio />} />
          <Route path="/lancamento" element={<Lancamento />} />
          <Route path="/cadastro/produtor" element={<CadastroProdutor />} />
          <Route path="/cadastro/meeiro" element={<CadastroMeeiro />} />
          <Route path="/cadastro/qualidade" element={<CadastroQualidade />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Relatorio to="/" replace />} />
        </Routes>
      </Template>
    </ThemeProvider>
  );
}

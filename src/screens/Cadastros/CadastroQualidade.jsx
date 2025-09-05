import * as React from "react";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import ListaQualidades from "../../components/Listas/ListaQualidades";
import { GlobalContext } from "../../globalContext";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCcfCSB7z-BuipKfrPrSbMx27M1XTTIpKU",
  authDomain: "controle-morango.firebaseapp.com",
  projectId: "controle-morango",
  storageBucket: "controle-morango.firebasestorage.app",
  messagingSenderId: "465016870980",
  appId: "1:465016870980:web:ae64cbf5806fdb161f0411",
});

function CadastroQualidade(props) {
  const [values, setValues] = React.useState({
    nome: "",
    produtor: "",
  });
  const db = getFirestore(firebaseConfig);
  const [editar, setEditar] = React.useState(false);
  const [errorInput, setErrorInput] = React.useState(false);
  const [listaQtd, setListaQtd] = React.useState(0);
  const [load, setLoad] = React.useState(false);
  const [, setGlobal] = React.useContext(GlobalContext);

  const handleChange = (event) => {
    setErrorInput(false);
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  async function cadastrarQualidade() {
    if (values.nome === "") {
      setErrorInput(true);
      return;
    } else {
      setGlobal({
        type: "setLoading",
        payload: true,
      });
      await addDoc(collection(db, "qualidades"), {
        cod: listaQtd + 1,
        nome: values.nome,
        createdAt: Timestamp.now(),
      });
      setErrorInput(false);
      setLoad(true);
      setValues({
        nome: "",
        cod: "",
        createdAt: "",
      });
      setGlobal({
        type: "setLoading",
        payload: false,
      });
    }
  }

  const atualizarQualidade = () => {
    if (values.nome === "") {
      setErrorInput(true);
      return;
    } else {
      setGlobal({
        type: "setLoading",
        payload: true,
      });
      deleteDoc(doc(db, "qualidades", values.id));
      addDoc(collection(db, "qualidades"), {
        cod: values.cod,
        nome: values.nome,
        createdAt: values.createdAt,
      });
      setLoad(true);
      setErrorInput(false);
      setValues({
        nome: "",
        cod: "",
        createdAt: "",
      });
      setEditar(false);
      setGlobal({
        type: "setLoading",
        payload: false,
      });
    }
  };

  return (
    <Box
      component="form"
      sx={{
        py: 4,
        px: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        textAlign: "left",
        "& .MuiFormControl-root": { marginRight: 2, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5" component="h5" marginBottom={3}>
        Cadastro de Qualidade
      </Typography>
      <div>
        <TextField
          id="nome"
          label="Nome"
          variant="standard"
          name="nome"
          onChange={handleChange}
          value={values.nome}
          required
          maxLength={100}
          error={values.nome === "" && errorInput ? true : false}
          style={{
            width: "50ch",
          }}
          size="small"
        />
        <br />
        {editar ? (
          <Button
            style={{
              width: "25ch",
              float: "left",
              marginTop: 30,
              marginBottom: 30,
            }}
            variant="contained"
            color="info"
            onClick={() => atualizarQualidade()}
          >
            Atualizar
          </Button>
        ) : (
          <Button
            style={{
              width: "25ch",
              float: "left",
              marginTop: 30,
              marginBottom: 30,
            }}
            variant="contained"
            color="info"
            onClick={() => cadastrarQualidade()}
          >
            Cadastrar
          </Button>
        )}
      </div>
      <Divider />
      <ListaQualidades
        load={load}
        setLoad={setLoad}
        setValues={setValues}
        setListaQtd={setListaQtd}
        setEditar={setEditar}
      />
    </Box>
  );
}

export default CadastroQualidade;

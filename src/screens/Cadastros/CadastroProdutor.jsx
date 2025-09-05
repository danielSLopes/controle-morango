import * as React from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import ListaProdutores from "../../components/Listas/ListaProdutores";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { GlobalContext } from "../../globalContext";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCcfCSB7z-BuipKfrPrSbMx27M1XTTIpKU",
  authDomain: "controle-morango.firebaseapp.com",
  projectId: "controle-morango",
  storageBucket: "controle-morango.firebasestorage.app",
  messagingSenderId: "465016870980",
  appId: "1:465016870980:web:ae64cbf5806fdb161f0411",
});

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask="(00) 00000-0000"
      definitions={{
        "#": /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite={false}
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function CadastroProdutor(props) {
  const db = getFirestore(firebaseConfig);
  const [errorInput, setErrorInput] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [listaQtd, setListaQtd] = React.useState(0);
  const [editar, setEditar] = React.useState(false);
  const [, setGlobal] = React.useContext(GlobalContext);

  const [values, setValues] = React.useState({
    nome: "",
    cidade: "",
    contato: "",
    porcentagem: "",
    cod: "",
    createdAt: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeNumber = (event) => {
    const regex = /\W|_/;

    if (
      event.target.value <= 100 &&
      event.target.value >= 0 &&
      !regex.test(event.target.value)
    ) {
      setValues({
        ...values,
        [event.target.name]: event.target.value,
      });
    }
  };

  async function criarProdutor() {
    if (values.nome === "") {
      setErrorInput(true);
      return;
    } else {
      setGlobal({
        type: "setLoading",
        payload: true,
      });
      await addDoc(collection(db, "produtores"), {
        nome: values.nome,
        cidade: values.cidade,
        contato: values.contato,
        porcentagem: values.porcentagem,
        createdAt: Timestamp.now(),
        cod: listaQtd + 1,
      });
      setErrorInput(false);
      setLoad(true);
      setValues({
        nome: "",
        cidade: "",
        contato: "",
        porcentagem: "",
        cod: "",
        createdAt: "",
      });
      setGlobal({
        type: "setLoading",
        payload: false,
      });
    }
  }

  async function atualizarProdutor() {
    if (values.nome === "") {
      setErrorInput(true);
      return;
    } else {
      setGlobal({
        type: "setLoading",
        payload: true,
      });
      await deleteDoc(doc(db, "produtores", values.id));
      await addDoc(collection(db, "produtores"), {
        nome: values.nome,
        cidade: values.cidade,
        contato: values.contato,
        porcentagem: values.porcentagem,
        createdAt: values.createdAt,
        cod: values.cod,
      });
      setLoad(true);
      setErrorInput(false);
      setValues({
        nome: "",
        cidade: "",
        contato: "",
        porcentagem: "",
        cod: "",
        createdAt: "",
      });
      setEditar(false);
      setGlobal({
        type: "setLoading",
        payload: false,
      });
    }
  }

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
          "& .MuiFormControl-root": { marginRight: 2, marginBottom: 4, width: "40ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h5" component="h5" marginBottom={3}>
          Cadastro de Produtor
        </Typography>
        <div>
          <TextField
            id="nome"
            error={errorInput}
            label="Nome"
            variant="standard"
            name="nome"
            onChange={handleChange}
            value={values.nome}
            required
            maxLength={100}
            size="small"
          />
          <TextField
            id="cidade"
            label="Cidade"
            name="cidade"
            variant="standard"
            onChange={handleChange}
            value={values.cidade}
            maxLength={50}
            size="small"
          />
          <FormControl variant="standard" size="small">
            <InputLabel htmlFor="formatted-text-mask-input">Contato</InputLabel>
            <Input
              value={values.contato}
              onChange={handleChange}
              name="contato"
              id="formatted-text-mask-input"
              inputComponent={TextMaskCustom}
            />
          </FormControl>
          <TextField
            label="Porcentagem"
            variant="standard"
            id="standard-adornment-weight"
            aria-describedby="standard-weight-helper-text"
            name="porcentagem"
            value={values.porcentagem}
            onChange={handleChangeNumber}
            type="number"
            maxLength={3}
            size="small"
          />
          <br />
          {editar ? (
            <Button
              style={{
                width: "25ch",
                float: "left",
                marginBottom: 30,
              }}
              variant="contained"
              color="info"
              onClick={() => atualizarProdutor()}
            >
              Atualizar
            </Button>
          ) : (
            <Button
              style={{
                width: "25ch",
                float: "left",
                marginBottom: 30,
              }}
              variant="contained"
              color="info"
              onClick={() => criarProdutor()}
            >
              Cadastrar
            </Button>
          )}
        </div>
        <Divider />
        <ListaProdutores
          load={load}
          setLoad={setLoad}
          setValues={setValues}
          setListaQtd={setListaQtd}
          setEditar={setEditar}
        />
      </Box>
  );
}

export default CadastroProdutor;

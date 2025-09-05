import * as React from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import ListaMeeiro from "../../components/Listas/ListaMeeiro";
import { GlobalContext } from "../../globalContext";
import firebaseConfig from "../../services/firebase";

function CadastroMeeiro(props) {
  const [values, setValues] = React.useState({
    nome: "",
    produtor: "",
  });
  const db = getFirestore(firebaseConfig);
  const produtoresCollectionRef = collection(db, "produtores");
  const [produtores, setProdutores] = React.useState([]);
  const [editar, setEditar] = React.useState(false);
  const [errorInput, setErrorInput] = React.useState(false);
  const [listaQtd, setListaQtd] = React.useState(0);
  const [load, setLoad] = React.useState(false);
  const [, setGlobal] = React.useContext(GlobalContext);

  React.useEffect(() => {
    getProdutores();
  }, []);

  const getProdutores = async () => {
    setGlobal({
      type: "setLoading",
      payload: true,
    });
    const data = await query(produtoresCollectionRef, orderBy("cod"));
    const querySnapshot = await getDocs(data);

    const array = [];
    querySnapshot.forEach((doc) => {
      let obj = doc.data();
      array.push({ value: obj.cod, label: obj.nome });
    });
    setGlobal({
      type: "setLoading",
      payload: false,
    });
    setProdutores(array);
  };

  const handleChange = (event) => {
    setErrorInput(false);
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  async function cadastrarMeeiro() {
    if (values.nome === "" || values.produtor === "") {
      setErrorInput(true);
      return;
    } else {
      setGlobal({
        type: "setLoading",
        payload: true,
      });
      await addDoc(collection(db, "meeiro"), {
        cod: listaQtd + 1,
        nome: values.nome,
        cod_produtor: values.produtor,
        createdAt: Timestamp.now(),
      });
      setErrorInput(false);
      setLoad(true);
      setValues({
        nome: "",
        cod: "",
        cod_produtor: "",
        createdAt: "",
      });
      setGlobal({
        type: "setLoading",
        payload: false,
      });
    }
  }

  const atualizarMeeiro = () => {
    if (values.nome === "" || values.produtor === "") {
      setErrorInput(true);
      return;
    } else {
      setGlobal({
        type: "setLoading",
        payload: true,
      });
      deleteDoc(doc(db, "meeiro", values.id));
      addDoc(collection(db, "meeiro"), {
        cod: values.cod,
        nome: values.nome,
        cod_produtor: values.produtor,
        createdAt: values.createdAt,
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
        "& .MuiFormControl-root": { marginRight: 2, marginBottom: 4, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5" component="h5" marginBottom={3}>
        Cadastro de Meeiro
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
        <TextField
          id="outlined-select-currency"
          select
          label="Produtor"
          variant="standard"
          onChange={handleChange}
          value={values.produtor}
          name="produtor"
          required
          error={values.produtor === "" && errorInput ? true : false}
          size="small"
        >
          {produtores.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
            onClick={() => atualizarMeeiro()}
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
            onClick={() => cadastrarMeeiro()}
          >
            Cadastrar
          </Button>
        )}
      </div>
      <Divider />
      <ListaMeeiro
        load={load}
        setLoad={setLoad}
        setValues={setValues}
        setListaQtd={setListaQtd}
        setEditar={setEditar}
      />
    </Box>
  );
}

export default CadastroMeeiro;

import * as React from "react";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import { GlobalContext } from "../globalContext";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCcfCSB7z-BuipKfrPrSbMx27M1XTTIpKU",
  authDomain: "controle-morango.firebaseapp.com",
  projectId: "controle-morango",
  storageBucket: "controle-morango.firebasestorage.app",
  messagingSenderId: "465016870980",
  appId: "1:465016870980:web:ae64cbf5806fdb161f0411",
});

function Lancamento(props) {
  const [values, setValues] = React.useState({
    produtor: "",
    meeiro: "",
    qualidade: "",
    data: dayjs().format(),
    quantidade: "",
    valor: "",
  });
  const db = getFirestore(firebaseConfig);
  const [errorInput, setErrorInput] = React.useState(false);
  const [produtores, setProdutores] = React.useState([]);
  const [meeiros, setMeeiros] = React.useState([]);
  const [qualidades, setQualidades] = React.useState([]);
  const produtoresCollectionRef = collection(db, "produtores");
  const meeirosCollectionRef = collection(db, "meeiro");
  const qualidadesCollectionRef = collection(db, "qualidades");
  const lancamentosCollectionRef = collection(db, "lancamentos");
  const [, setGlobal] = React.useContext(GlobalContext);
  const [lancamentos, setLancamentos] = React.useState([]);

  const handleChange = (event) => {
    setErrorInput(false);
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  React.useEffect(() => {
    setGlobal({
      type: "setLoading",
      payload: true,
    });
    getProdutores();
    getQualidades();
    getLancamentos();
    setGlobal({
      type: "setLoading",
      payload: false,
    });
  }, []);

  const getProdutores = async () => {
    const data = await query(produtoresCollectionRef, orderBy("cod"));
    const querySnapshot = await getDocs(data);
    const array = [];

    querySnapshot.forEach((doc) => {
      let obj = doc.data();
      array.push({ value: obj.cod, label: obj.nome });
    });
    setProdutores(array);
  };

  const getLancamentos = async () => {
    setGlobal({
      type: "setLoading",
      payload: true,
    });
    const data = await query(lancamentosCollectionRef, orderBy("cod"));
    const querySnapshot = await getDocs(data);
    const array = [];

    querySnapshot.forEach((doc) => {
      let obj = doc.data();
      array.push({ cod: obj.cod });
    });
    setLancamentos(array);
    setGlobal({
      type: "setLoading",
      payload: false,
    });
  };

  const getQualidades = async () => {
    const data = await query(qualidadesCollectionRef, orderBy("cod"));
    const querySnapshot = await getDocs(data);
    const array = [];

    querySnapshot.forEach((doc) => {
      let obj = doc.data();
      array.push({ value: obj.cod, label: obj.nome });
    });
    setQualidades(array);
  };

  const getMeeiros = async () => {
    const data = await query(
      meeirosCollectionRef,
      where("cod_produtor", "==", values.produtor)
    );
    const querySnapshot = await getDocs(data);

    const array = [];
    querySnapshot.forEach((doc) => {
      let obj = doc.data();
      array.push({ value: obj.cod, label: obj.nome });
    });
    setMeeiros(array);
  };

  React.useEffect(() => {
    if (values.produtor !== "") {
      getMeeiros();
    }
  }, [values.produtor]);

  const formatarMoeda = () => {
    var elemento = document.getElementById("valor");
    var valor = elemento.value;

    valor = valor + "";
    valor = parseInt(valor.replace(/[\D]+/g, ""));
    valor = valor + "";
    valor = valor.replace(/([0-9]{2})$/g, ",$1");

    if (valor.length > 6) {
      valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }
    elemento.value = valor;

    setValues({
      ...values,
      valor: valor,
    });
  };

  async function cadastrar() {
    if (
      values.produtor === "" ||
      values.meeiro === "" ||
      values.qualidade === "" ||
      values.quantidade === "" ||
      values.valor === ""
    ) {
      setErrorInput(true);
      return;
    } else {
      setGlobal({
        type: "setLoading",
        payload: true,
      });
      let cod = 1;
      if (lancamentos.length > 0) {
        cod = parseInt(lancamentos[lancamentos.length - 1].cod) + 1;
      }
      await addDoc(collection(db, "lancamentos"), {
        produtor: values.produtor,
        meeiro: values.meeiro,
        qualidade: values.qualidade,
        data: values.data,
        quantidade: values.quantidade,
        valor: values.valor,
        cod: cod,
        createdAt: Timestamp.now(),
      });
      setErrorInput(false);
      setValues({
        produtor: "",
        meeiro: "",
        qualidade: "",
        data: "",
        quantidade: "",
        valor: "",
      });
      setGlobal({
        type: "setLoading",
        payload: false,
      });

      var elemento = document.getElementById("valor");
      elemento.value = "";
      getLancamentos();
    }
  }

  const handleDataChange = (date) => {
    const valueOfInput = date.format();
    setValues({
      ...values,
      data: valueOfInput,
    });
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
        "& .MuiFormControl-root": {
          marginRight: 2,
          marginBottom: 4,
          width: "30ch",
        },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5" component="h5" marginBottom={3}>
        Lançamento
      </Typography>
      <div>
        <TextField
          id="outlined-select-currency"
          select
          label="Produtor"
          variant="standard"
          onChange={handleChange}
          value={values.produtor}
          name="produtor"
          required
          size={"small"}
          error={values.produtor === "" && errorInput ? true : false}
        >
          {produtores.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-select-currency"
          select
          label="Meeiro"
          variant="standard"
          onChange={handleChange}
          value={values.meeiro}
          name="meeiro"
          size={"small"}
          required
          error={values.meeiro === "" && errorInput ? true : false}
        >
          {meeiros.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-select-currency"
          select
          size={"small"}
          label="Qualidade"
          variant="standard"
          onChange={handleChange}
          value={values.qualidade}
          name="qualidade"
          required
          error={values.qualidade === "" && errorInput ? true : false}
        >
          {qualidades.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <DatePicker
            name="data"
            label="Data"
            defaultValue={dayjs()}
            slotProps={{ textField: { variant: "standard" } }}
            onChange={handleDataChange}
          />
        </LocalizationProvider>
        <TextField
          id="standard-number"
          label="Quantidade"
          type="number"
          variant="standard"
          name="quantidade"
          required
          value={values.quantidade}
          onChange={handleChange}
          error={values.quantidade === "" && errorInput ? true : false}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          label="Valor"
          id="valor"
          name="valor"
          required
          variant="standard"
          onKeyUp={formatarMoeda}
          error={values.valor === "" && errorInput ? true : false}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ),
            },
          }}
        />
        <br/>
        <Button
          style={{
            width: "25ch",
            float: "left",
          }}
          variant="contained"
          color="info"
          onClick={() => cadastrar()}
        >
          Cadastrar
        </Button>
      </div>
    </Box>
  );
}

export default Lancamento;

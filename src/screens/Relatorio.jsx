import * as React from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { GlobalContext } from "../globalContext";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import ListaLancamentos from "../components/Listas/ListaLancamentos";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
const apiKeyFirebase = process.env.REACT_APP_API_URL;

const firebaseConfig = initializeApp({
  apiKey: apiKeyFirebase,
  authDomain: "controle-morango.firebaseapp.com",
  projectId: "controle-morango",
  storageBucket: "controle-morango.firebasestorage.app",
  messagingSenderId: "465016870980",
  appId: "1:465016870980:web:ae64cbf5806fdb161f0411",
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function Relatorio(props) {
  const db = getFirestore(firebaseConfig);
  const [errorInput, setErrorInput] = React.useState(false);
  const [, setGlobal] = React.useContext(GlobalContext);
  const [produtores, setProdutores] = React.useState([]);
  const [meeiros, setMeeiros] = React.useState([]);
  const [load, setLoad] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [gerar, setGerar] = React.useState(false);

  const produtoresCollectionRef = collection(db, "produtores");
  const meeirosCollectionRef = collection(db, "meeiro");

  const [values, setValues] = React.useState({
    produtor: "0",
    meeiro: "0",
    dataInicial: dayjs().startOf('date').format(),
    dataFinal: dayjs().endOf('date').format(),
  });

  React.useEffect(() => {
    getProdutores();
    getMeeiros();
  }, []);

  React.useEffect(() => {
    if (values.produtor !== "") {
      getMeeirosProdutor();
    }
  }, [values.produtor]);

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

  const getMeeiros = async () => {
    setGlobal({
      type: "setLoading",
      payload: true,
    });
    const data = await query(meeirosCollectionRef, orderBy("cod"));
    const querySnapshot = await getDocs(data);

    const array = [];
    querySnapshot.forEach((doc) => {
      let obj = doc.data();
      array.push({ value: obj.cod, label: obj.nome });
    });
    setMeeiros(array);
  };

  const getMeeirosProdutor = async () => {
    setGlobal({
      type: "setLoading",
      payload: true,
    });
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
    setGlobal({
      type: "setLoading",
      payload: false,
    });
    setMeeiros(array);
  };

  const handleChange = (event) => {
    setErrorInput(false);
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const gerarRelatorio = () => {
    if (values.produtor === "" && values.meeiro === "") {
      setError(true);
    } else {
      setGerar(true);
      setLoad(true);
    }
  };

  const handleClose = () => {
    setError(false);
  };

  const voltar = () => {
    setLoad(false);
    setGerar(false);
    setValues({
      produtor: "0",
      meeiro: "0",
      dataInicial: dayjs().startOf('date').format(),
      dataFinal: dayjs().endOf('date').format(),
    });
  };

  const handleDataChange1 = (date) => {
    let valueOfInput;
    if (date) {
      valueOfInput = date.format();
    }

    setValues({
      ...values,
      dataInicial: valueOfInput,
    });
  };

  const handleDataChange2 = (date) => {
    let valueOfInput;
    if (date) {
      valueOfInput = date.format();
    }

    setValues({
      ...values,
      dataFinal: valueOfInput,
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
        },
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container sx={{ justifyContent: "center" }}>
        <Grid item xs={6}>
          <Typography variant="h5" component="h5" marginBottom={3}>
            Relatório
          </Typography>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" }}>
          {gerar === true && (
            <>
              <IconButton onClick={() => voltar()}>
                <ArrowBackIcon />
              </IconButton>
            </>
          )}
        </Grid>
      </Grid>
      <div>
        {gerar === false ? (
          <>
            <TextField
              id="outlined-select-currency"
              select
              label="Produtor"
              variant="standard"
              onChange={handleChange}
              value={values.produtor}
              name="produtor"
              size="small"
              style={{ width: "30ch" }}
            >
              <MenuItem key={"all"} value={"0"} selected={true}>
                Todos
              </MenuItem>
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
              style={{ width: "30ch" }}
            >
              <MenuItem key={"all"} value={"0"} selected>
                Todos
              </MenuItem>
              {meeiros.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                name="dataInicial"
                label="Data inicial"
                defaultValue={dayjs().startOf('date')}
                slotProps={{ textField: { variant: "standard" } }}
                onChange={handleDataChange1}
              />
            </LocalizationProvider>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                name="dataFinal"
                label="Data final"
                defaultValue={dayjs().endOf('date')}
                slotProps={{ textField: { variant: "standard" } }}
                onChange={handleDataChange2}
              />
            </LocalizationProvider>
            <br></br>
            <Button
              style={{
                width: "25ch",
                float: "left",
                marginBottom: 50,
              }}
              variant="contained"
              color="info"
              onClick={() => gerarRelatorio(true)}
            >
              Gerar Relatório
            </Button>

            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={error}
            >
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Atenção
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: theme.palette.grey[500],
                })}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent dividers>
                <Typography gutterBottom>
                  Selecione pelo menos 1 opção para prosseguir.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose}>
                  Ok
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </>
        ) : (
          <ListaLancamentos load={load} setLoad={setLoad} values={values} />
        )}
      </div>
    </Box>
  );
}

export default Relatorio;

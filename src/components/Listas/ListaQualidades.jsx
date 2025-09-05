import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { GlobalContext } from "../../globalContext";

const columns = [
  { field: "cod", headerName: "ID", width: 25, align: "left",},
  { field: "nome", headerName: "Nome", width: 25, align: "left", },
  {
    field: "acoes",
    headerName: "Ações",
    sortable: false,
    width: 50,
    align: "right",
  },
];

const apiKeyFirebase = process.env.REACT_APP_API_URL;
const firebaseConfig = initializeApp({
  apiKey: apiKeyFirebase,
  authDomain: "controle-morango.firebaseapp.com",
  projectId: "controle-morango",
  storageBucket: "controle-morango.firebasestorage.app",
  messagingSenderId: "465016870980",
  appId: "1:465016870980:web:ae64cbf5806fdb161f0411",
});

export default function ListaQualidades({
  load,
  setLoad,
  setValues,
  setListaQtd,
  setEditar,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const db = getFirestore(firebaseConfig);
  const qualidadesCollectionRef = collection(db, "qualidades");
  const [open, setOpen] = React.useState(false);
  const [idExclusao, setIdExclusao] = React.useState({
    nome: "",
    id: "",
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [, setGlobal] = React.useContext(GlobalContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    getQualidades();
  }, []);

  React.useEffect(() => {
    if (load === true) {
      getQualidades();
      setLoad(false);
    }
  }, [load]);

  const getQualidades = async () => {
    setGlobal({
      type: "setLoading",
      payload: true,
    });

    const data = await query(qualidadesCollectionRef, orderBy("cod"));
    const querySnapshot = await getDocs(data);

    if (querySnapshot.size > 0) {
      const array = [];
      querySnapshot.forEach((doc) => {
        let obj = doc.data();
        Object.assign(obj, { id: doc.id });
        array.push(obj);
      });
      setRows(array);
      setListaQtd(array[array.length - 1].cod);
    } else {
      setRows([]);
    }
    setGlobal({
      type: "setLoading",
      payload: false,
    });
  };

  const excluir = async () => {
    await deleteDoc(doc(db, "qualidades", idExclusao.id));
    getQualidades();
    handleClose();
  };

  const handleClickOpen = (id, nome) => {
    setOpen(true);
    setIdExclusao({
      id: id,
      nome: nome,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editar = (dados) => {
    setValues({
      id: dados.id,
      nome: dados.nome,
      cod: dados.cod,
      createdAt: dados.createdAt,
    });
    setEditar(true);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader size="small"  aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align}>{column.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.field];
                      if (column.field === "acoes") return;
                      return <TableCell key={column.field} align={column.align}>{value}</TableCell>;
                    })}
                    <TableCell key={"acoes"} align="right">
                      <IconButton
                        title="Editar"
                        size="small"
                        onClick={() => editar(row)}
                      >
                        <EditIcon color="info" fontSize="small" />
                      </IconButton>
                      <IconButton
                        title="Excluir"
                        size="small"
                        onClick={() => handleClickOpen(row.id, row.nome)}
                      >
                        <DeleteOutlineIcon color="error" fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" style>
          Deseja excluir Meeiro: {idExclusao.nome} ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Não
          </Button>
          <Button onClick={() => excluir()}>Sim</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

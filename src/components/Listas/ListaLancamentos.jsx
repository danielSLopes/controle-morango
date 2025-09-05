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
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { GlobalContext } from "../../globalContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import RelatorioPdf from "../ReactPdf";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Resolution, Margin, usePDF } from "react-to-pdf";
import dayjs from "dayjs";

const flexContainer = {
  display: "flex",
  flexDirection: "row",
  padding: 0,
  overflowX: "auto",
};

const columns = [
  { field: "cod", headerName: "ID", width: 25, align: "left" },
  { field: "produtor", headerName: "Produtor", width: 25, align: "left" },
  { field: "meeiro", headerName: "Meeiro", width: 25, align: "left" },
  { field: "qualidade", headerName: "Qualidade", width: 25, align: "left" },
  { field: "quantidade", headerName: "Quantidade", width: 25, align: "left" },
  { field: "valor", headerName: "Valor", width: 25, align: "left" },
  { field: "data", headerName: "Data", width: 25, align: "left" },
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

export default function ListaLancamentos({ load, setLoad, values }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [rows, setRows] = React.useState([]);
  const db = getFirestore(firebaseConfig);
  const produtoresCollectionRef = collection(db, "produtores");
  const lancamentosCollectionRef = collection(db, "lancamentos");
  const qualidadesCollectionRef = collection(db, "qualidades");
  const meeiroCollectionRef = collection(db, "meeiro");
  const [produtores, setProdutores] = React.useState([]);
  const [meeiros, setMeeiros] = React.useState([]);
  const [qualidades, setQualidades] = React.useState([]);
  const [, setGlobal] = React.useContext(GlobalContext);
  const [show, setShow] = React.useState(false);

  const { toPDF, targetRef } = usePDF({
    filename: "simple-receipt.pdf",
    method: "open",
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.MEDIUM,
      format: "A4",
      orientation: "portrait",
    },
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    setGlobal({
      type: "setLoading",
      payload: true,
    });
    getProdutores();
    getMeeiros();
    getQualidades();
    setGlobal({
      type: "setLoading",
      payload: false,
    });
  }, []);

  React.useEffect(() => {
    if (load === true) {
      gerarRelatorio();
      setLoad(false);
    }
  }, [load]);

  const getProdutores = async () => {
    const data = await query(produtoresCollectionRef);
    const querySnapshot = await getDocs(data);
    const array = [];
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        let obj = doc.data();
        obj.id = doc.id;
        array.push(obj);
      });
      setProdutores(array);
    }
  };

  const getMeeiros = async () => {
    const data = await query(meeiroCollectionRef);
    const querySnapshot = await getDocs(data);

    if (querySnapshot.size > 0) {
      const array = [];
      querySnapshot.forEach((doc) => {
        let obj = doc.data();
        Object.assign(obj, { id: doc.id });
        array.push(obj);
      });
      setMeeiros(array);
    }
  };

  const getQualidades = async () => {
    const data = await query(qualidadesCollectionRef);
    const querySnapshot = await getDocs(data);

    if (querySnapshot.size > 0) {
      const array = [];
      querySnapshot.forEach((doc) => {
        let obj = doc.data();
        Object.assign(obj, { id: doc.id });
        array.push(obj);
      });
      setQualidades(array);
    }
  };

  const gerarRelatorio = async () => {
    setGlobal({
      type: "setLoading",
      payload: true,
    });

    const conditions = [];
    if (values.produtor !== "0")
      conditions.push(where("produtor", "==", values.produtor));
    if (values.meeiro !== "0")
      conditions.push(where("meeiro", "==", values.meeiro));
    if (values.dataInicial !== "")
      conditions.push(where("data", ">=", values.dataInicial));
    if (values.dataFinal !== "")
      conditions.push(where("data", "<=", values.dataFinal));

    const data = await query(
      lancamentosCollectionRef,
      ...conditions,
      orderBy("cod")
    );
    const querySnapshot = await getDocs(data);
    const array = [];
    querySnapshot.forEach((doc) => {
      let obj = doc.data();
      Object.assign(obj, { id: doc.id });
      array.push(obj);
    });
    setGlobal({
      type: "setLoading",
      payload: false,
    });
    setRows(array);
  };

  const getNomeProdutor = (id) => {
    const found = produtores.find((element) => element.cod === id);
    if (found) {
      return found.nome;
    }
  };

  const getNomeMeeiro = (id) => {
    const found = meeiros.find((element) => element.cod === id);
    if (found) {
      return found.nome;
    }
  };

  const getNomeQualidade = (id) => {
    const found = qualidades.find((element) => element.cod === id);
    if (found) {
      return found.nome;
    }
  };

  const gerarPdf = () => {
    setShow(true);
    toPDF();
  };

  return (
    <>
      <Divider />

      <div style={flexContainer}>
        <p>
          <strong style={{ color: "#228cbd" }}>Produtor:</strong>{" "}
          {values.produtor === "0" ? "Todos" : getNomeProdutor(values.produtor)}
        </p>
        <p style={{ marginLeft: 20 }}>
          <strong style={{ color: "#228cbd" }}>Meeiro:</strong>{" "}
          {values.meeiro === "0" ? "Todos" : getNomeProdutor(values.meeiro)}
        </p>
        <p style={{ marginLeft: 20 }}>
          <strong style={{ color: "#228cbd" }}>Data inicial:</strong>{" "}
          {values.dataInicial === ""
            ? "--"
            : dayjs(values.dataInicial).format("DD/MM/YYYY")}
        </p>
        <p style={{ marginLeft: 20 }}>
          <strong style={{ color: "#228cbd" }}>Data final:</strong>{" "}
          {values.dataFinal === ""
            ? "--"
            : dayjs(values.dataFinal).format("DD/MM/YYYY")}
        </p>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table size="small" aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field} align={column.align}>
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length <= 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Nenhuma informação encontrada.
                  </TableCell>
                </TableRow>
              )}
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.field];
                        if (column.field === "produtor") {
                          const aux = getNomeProdutor(value);
                          return (
                            <TableCell key={column.field}>{aux}</TableCell>
                          );
                        } else if (column.field === "meeiro") {
                          const aux = getNomeMeeiro(value);
                          return (
                            <TableCell key={column.field}>{aux}</TableCell>
                          );
                        } else if (column.field === "qualidade") {
                          const aux = getNomeQualidade(value);
                          return (
                            <TableCell key={column.field}>{aux}</TableCell>
                          );
                        } else if (column.field === "data") {
                          return (
                            <TableCell key={column.field}>
                              {dayjs(value).format("DD/MM/YYYY")}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={column.field}>{value}</TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelRowsPerPage={"Registros por página"}
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Visualização de PDF
        </AccordionSummary>
        <AccordionDetails>
          <Tooltip title="Gerar PDF">
            <IconButton onClick={() => gerarPdf()}>
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
          <RelatorioPdf
            targetRef={targetRef}
            show={show}
            rows={rows}
            columns={columns}
            produtores={produtores}
            meeiros={meeiros}
            qualidades={qualidades}
            values={values}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
}

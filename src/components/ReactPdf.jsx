import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";

const flexContainer = {
  display: "flex",
  flexDirection: "row",
  padding: 0,
  overflowX: "auto",
};

function RelatorioPdf({
  targetRef,
  rows,
  columns,
  produtores,
  meeiros,
  qualidades,
  values,
}) {
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

  return (
    <div
      ref={targetRef}
      style={{
        padding: "20px",
        marginTop: "20px",
        overflow: "",
        backgroundColor: "white",
        width: "1000px",
      }}
    >
      {/* <h2 style={{ color: "black" }}>Receipt</h2> */}
      <div style={flexContainer}>
        <p style={{ color: "#228cbd" }}>
          <strong>Produtor:</strong>{" "}
          {values.produtor === "0" ? "Todos" : getNomeProdutor(values.produtor)}
        </p>
        <p style={{ color: "#228cbd", marginLeft: 20 }}>
          <strong>Meeiro:</strong>{" "}
          {values.meeiro === "0" ? "Todos" : getNomeProdutor(values.meeiro)}
        </p>
      </div>
      <TableContainer>
        <Table size="small" stickyHeader aria-label="sticky table">
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
                <TableCell
                  colSpan={7}
                  align="center"
                  style={{ color: "black" }}
                >
                  Nenhuma informação encontrada.
                </TableCell>
              </TableRow>
            )}

            {rows.map((row) => {
              return (
                <TableRow tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.field];
                    if (column.field === "produtor") {
                      const aux = getNomeProdutor(value);
                      return (
                        <TableCell
                          style={{ color: "black" }}
                          key={column.field}
                        >
                          {aux}
                        </TableCell>
                      );
                    } else if (column.field === "meeiro") {
                      const aux = getNomeMeeiro(value);
                      return (
                        <TableCell
                          style={{ color: "black" }}
                          key={column.field}
                        >
                          {aux}
                        </TableCell>
                      );
                    } else if (column.field === "qualidade") {
                      const aux = getNomeQualidade(value);
                      return (
                        <TableCell
                          style={{ color: "black" }}
                          key={column.field}
                        >
                          {aux}
                        </TableCell>
                      );
                    }
                    if (column.field === "data") {
                      return (
                        <TableCell
                          style={{ color: "black" }}
                          key={column.field}
                        >
                          {dayjs(value).format("DD/MM/YYYY")}
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell
                          style={{ color: "black" }}
                          key={column.field}
                        >
                          {value}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default RelatorioPdf;

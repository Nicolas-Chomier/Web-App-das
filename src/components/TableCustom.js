import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Stack,
  TableRow,
  TableContainer,
  TableCell,
  TableBody,
  Table,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { lime, teal, orange, amber } from "@mui/material/colors";

const masterList = [];
const colorize = ["black", teal[100], lime[300], amber[300], orange[300]];

const TableCustom = ({ item, output }) => {
  const [listToDisplay, setListToDisplay] = useState([]);

  useEffect(() => {
    if (item !== false) {
      console.log("new entry in table custom components", item);
      masterList.push(item);
      let i = 0;
      const displayedTable = [];
      displayedTable.length = 0;
      for (const items of masterList) {
        const uniqueId = `IDN-${i}`;
        displayedTable.push(
          //{title: 'Intrumentations', id: 100, name: 'Pressure transmitter', tag: 'Sensor_0000', group: 1
          <TableRow
            sx={{ bgcolor: colorize[items.group] }}
            key={uniqueId}
            id={uniqueId}
          >
            <TableCell scope="row">{items.title}</TableCell>
            <TableCell align="right">{items.id}</TableCell>
            <TableCell align="right">{items.name}</TableCell>
            <TableCell align="right">{items.tag}</TableCell>
            <TableCell align="right">{items.group}</TableCell>
            <TableCell align="right">
              <Button
                onClick={() => {
                  const top = document.getElementById("table-body-test");
                  const nested = document.getElementById(uniqueId);
                  const garbage = top.removeChild(nested);
                  return garbage;
                }}
              >
                <DeleteIcon sx={{ fill: "black" }} />
              </Button>
            </TableCell>
          </TableRow>
        );
        i += 1;
      }
      console.log("");
      setListToDisplay(displayedTable);
    }
  }, [item]);

  function handleClick() {
    const finalResults = [];
    finalResults.length = 0;
    var rows = document.getElementsByTagName("tbody")[0].rows;
    for (var i = 0; i < rows.length; i++) {
      const results = {};
      results["title"] = rows[i].getElementsByTagName("td")[0].innerText;
      results["id"] = rows[i].getElementsByTagName("td")[1].innerText;
      results["name"] = rows[i].getElementsByTagName("td")[2].innerText;
      results["tag"] = rows[i].getElementsByTagName("td")[3].innerText;
      results["group"] = rows[i].getElementsByTagName("td")[4].innerText;
      finalResults.push(results);
    }
    if (finalResults.length !== 0) {
      console.log(finalResults);
      output(finalResults);
    } else {
      alert("Please choose elements");
    }
  }

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody id="table-body-test">{listToDisplay}</TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="success" onClick={handleClick}>
        Validation des choix
      </Button>
    </Stack>
  );
};

export default TableCustom;

import React, { useState, useEffect } from "react";
import {
  Button,
  Stack,
  TableRow,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Card,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { lime, teal, orange, amber } from "@mui/material/colors";

const masterList = [];
const colorize = ["black", amber[100], teal[100], orange[100], lime[100]];

const TableCustom = ({ item, output }) => {
  const [listToDisplay, setListToDisplay] = useState([]);
  //console.log("item", item);
  useEffect(() => {
    if (item !== false) {
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
            <TableCell
              align="left"
              size="small"
              padding="normal"
              sx={{
                fontWeight: "bold",
                pl: 8,
              }}
            >
              {items.categorie}
            </TableCell>
            <TableCell align="center" size="small" padding="normal">
              {items.name}
            </TableCell>
            <TableCell align="center" size="small" padding="normal">
              {items.id}
            </TableCell>
            <TableCell align="center" size="small" padding="normal">
              {items.tag}
            </TableCell>
            <TableCell align="center" size="small" padding="normal">
              {items.group}
            </TableCell>
            <TableCell align="center" size="small" padding="normal">
              <Button
                onClick={() => {
                  const top = document.getElementById("table-body-test");
                  const nested = document.getElementById(uniqueId);
                  const garbage = top.removeChild(nested);
                  return garbage;
                }}
              >
                <DeleteIcon sx={{ fill: "white" }} />
              </Button>
            </TableCell>
          </TableRow>
        );
        i += 1;
      }
      setListToDisplay(displayedTable);
    }
  }, [item]);

  function handleClick() {
    const finalResults = [];
    finalResults.length = 0;
    var rows = document.getElementsByTagName("tbody")[0].rows;
    for (var i = 0; i < rows.length; i++) {
      const results = {};
      results["categorie"] = rows[i].getElementsByTagName("td")[0].innerText;
      results["name"] = rows[i].getElementsByTagName("td")[1].innerText;
      results["id"] = rows[i].getElementsByTagName("td")[2].innerText;
      results["tag"] = rows[i].getElementsByTagName("td")[3].innerText;
      results["group"] = rows[i].getElementsByTagName("td")[4].innerText;
      finalResults.push(results);
    }
    if (finalResults.length !== 0) {
      output(finalResults);
    } else {
      alert("Please choose elements");
    }
  }

  return (
    <Card className="table-custom" sx={{ width: "100%", mx: "1vw" }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <TableContainer /* component={Paper} */>
          <Table aria-label="simple table">
            <TableBody id="table-body-test">{listToDisplay}</TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" onClick={handleClick}>
          Validation des choix
        </Button>
      </Stack>
    </Card>
  );
};

export default TableCustom;

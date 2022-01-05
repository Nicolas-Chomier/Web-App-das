import React, { useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const SelectCustom = ({ data, output }) => {
  // State used in the component:
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [option, setOption] = useState("");
  // Call one time only and generate list of category inside first select element
  useEffect(() => {
    const cList = [];
    for (const category in data) {
      cList.push(
        <MenuItem defaultValue="" key={category} value={category}>
          {category}
        </MenuItem>
      );
    }
    setCategoryList(cList);
  }, [data]);
  // Call each time selected category change and generate right option list associated
  useEffect(() => {
    if (category !== "") {
      const oList = [];
      for (const option in data[category]) {
        oList.push(
          <MenuItem defaultValue="" key={option} value={option}>
            {option}
          </MenuItem>
        );
      }
      setOptionList(oList);
    }
  }, [data, category]);
  // Call each time selected category change and reset option value displayed
  useEffect(() => {
    setOption("");
  }, [category]);
  return (
    <>
      <div>
        <FormControl sx={{ m: 0, minWidth: 220 }}>
          <InputLabel htmlFor="category-select">Category</InputLabel>
          <Select
            defaultValue=""
            value={category}
            id="category-select"
            label="Category"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            {categoryList}
          </Select>
        </FormControl>
        <div style={{ padding: 6 }}></div>
        <FormControl sx={{ m: 0, minWidth: 220 }}>
          <InputLabel htmlFor="option-select">Option</InputLabel>
          <Select
            defaultValue=""
            value={option}
            id="option-select"
            label="Option"
            onChange={(e) => {
              setOption(e.target.value);
              // give back result to parent component
              output(data[category][e.target.value]);
            }}
          >
            {optionList}
          </Select>
        </FormControl>
      </div>
    </>
  );
};

export default SelectCustom;

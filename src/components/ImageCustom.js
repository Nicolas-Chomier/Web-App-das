import React from "react";
import { CardMedia } from "@mui/material";

const ImageCustom = ({ image }) => {
  const alt = "Image d'ambiance";
  const height = "150";
  const path = `images/${image}`;
  return <CardMedia component="img" height={height} image={path} alt={alt} />;
};

export default ImageCustom;

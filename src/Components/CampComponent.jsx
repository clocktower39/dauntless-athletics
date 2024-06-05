import React from "react";
import { Button, Grid, Typography } from "@mui/material";

export default function CampComponent({ camp, index }) {
  return (
    <Grid xs={12} sm={6} md={4} sx={{ margin: "50px 0" }}>
      <Grid container justifyContent="center">
        {camp?.icon}
      </Grid>
      <Grid container justifyContent="center">
        <Typography
          color="#8e43ba"
          variant="h5"
          textAlign="center"
          sx={{ fontFamily: "montserrat", padding: "15px 0", maxWidth: "250px" }}
        >
          {camp.title}
        </Typography>
      </Grid>
      <Grid container justifyContent="center">
        <Typography color="#99a9b5" textAlign="center" sx={{ fontFamily: "source sans pro" }}>
          Date: {camp?.date}
        </Typography>
      </Grid>
      <Grid container justifyContent="center">
        <Typography color="#99a9b5" textAlign="center" sx={{ fontFamily: "source sans pro" }}>
          Time: {camp.time}
        </Typography>
      </Grid>
      <Grid container justifyContent="center">
        <Typography color="#99a9b5" textAlign="center" sx={{ fontFamily: "source sans pro" }}>
          Place: {camp.place}
        </Typography>
      </Grid>
      <Grid container justifyContent="center">
        <Typography color="#99a9b5" textAlign="center" sx={{ fontFamily: "source sans pro" }}>
          Cost: ${camp.cost} per athlete
        </Typography>
      </Grid>
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          sx={{ backgroundColor: "rgb(58, 58, 58)", margin: "25px 0", borderRadius: "25px" }}
          href={camp.link}
        >
          {camp.buttonText}
        </Button>
      </Grid>
    </Grid>
  );
}

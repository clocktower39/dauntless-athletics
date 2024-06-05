import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Logo470x377 from "../assets/Dauntless-Athletics-Logo-470x377.png";

export default function CaptivateMinds() {
  return (
    <Box sx={{ backgroundColor: "#FFD848", padding: "50px 0" }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid container item justifyContent="center" alignItems="center">
          <img
            src={Logo470x377}
            alt="Dauntless Athletics Logo"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Grid>

        <Grid container item justifyContent="center" alignItems="center">
          <Typography
            textAlign="center"
            sx={{
              padding: "25px",
              fontFamily: "source sans pro",
              fontSize: "24px",
              fontWeight: 200,
            }}
          >
            We will captivate the minds of your children and teach them skills they thought they
            could never learn.
          </Typography>
        </Grid>

        <Grid container item justifyContent="center" alignItems="center">
          <Button
            variant="outlined"
            sx={{
              fontSize: '19px',
              border: "3px solid rgb(57, 61, 80)",
              borderRadius: "25px",
              color: "rgb(57, 61, 80)",
              "&:hover": {
                color: "#fff",
                backgroundColor: "rgb(57, 61, 80)",
                border: "3px solid rgb(57, 61, 80)",
              },
            }}
            href="https://www.iclassprov2.com/parentportal/dauntlessathletics/classes"
          >
            Schedule Now!
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

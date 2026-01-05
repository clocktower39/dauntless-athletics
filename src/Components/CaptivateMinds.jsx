import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Logo470x377 from "../assets/Dauntless-Athletics-Logo-470x377.png";

export default function CaptivateMinds() {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(120deg, rgba(225, 29, 72, 0.95), rgba(10, 10, 14, 0.95))",
        padding: { xs: "50px 0", md: "80px 0" },
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid container justifyContent="center" alignItems="center">
          <img
            src={Logo470x377}
            alt="Dauntless Athletics Logo"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Grid>

        <Grid container justifyContent="center" alignItems="center">
          <Typography
            textAlign="center"
            sx={{
              padding: "25px",
              fontSize: "24px",
              fontWeight: 200,
              color: "var(--color-text)",
            }}
          >
            We will captivate the minds of your children and teach them skills they thought they
            could never learn.
          </Typography>
        </Grid>

        <Grid container justifyContent="center" alignItems="center">
          <Button
            variant="outlined"
            sx={{
              fontSize: "18px",
              border: "2px solid var(--color-text)",
              borderRadius: "999px",
              color: "var(--color-text)",
              padding: "10px 28px",
              "&:hover": {
                color: "var(--color-bg)",
                backgroundColor: "var(--color-text)",
                border: "2px solid var(--color-text)",
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

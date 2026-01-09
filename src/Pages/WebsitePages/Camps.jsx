import React from "react";
import { camps } from "../../states";
import WebsiteNavbar from "./WebsiteNavbar";
import CampComponent from "../../Components/CampComponent";
import Footer from "../../Components/Footer";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Groups as GroupsIcon } from "@mui/icons-material";
import OurProcess from "../../Components/OurProcess";

const classes = {
  mainImgBox: {
    backgroundColor: "var(--color-surface)",
    borderBottom: "1px solid var(--color-border)",
    padding: "18px 0",
  },
  overlayText: {
    width: "100%",
    fontFamily: "var(--font-display)",
    fontSize: "2.2em",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  image: {
    display: "none",
    width: "auto",
    height: "100%",
    maxHeight: "900px",
  },
  PeakPerformanceCamp: {
    backgroundColor: "var(--color-surface-2)",
    padding: "7.5px",
  },
  PeakPerformanceCampText: {
    color: "var(--color-text)",
    width: "100%",
    fontFamily: "var(--font-display)",
    textTransform: "uppercase",
    padding: "3px",
  },
};

export default function Camps() {
  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container size={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                Camps
              </Typography>
            </Grid>
            <Grid container size={4} justifyContent="flex-end" alignItems="center">
              <GroupsIcon sx={{ fontSize: "5em", maxHeight: "5em", maxWidth: "5em" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box>
        <img
          src="/images/camps/Dauntless-Athletics-Camp-Group-Image.jpg"
          alt="Inspiring Mountain"
          style={classes.image}
        />
      </Box>
      <Box sx={{ backgroundColor: "transparent", color: "var(--color-text)", padding: { xs: "30px 0", md: "50px 0" } }}>
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "28px",
            padding: { xs: "20px", md: "32px" },
            boxShadow: "0 28px 50px rgba(0,0,0,0.45)",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: "600",
              textTransform: "uppercase",
              padding: "25px 0",
            }}
          >
            We are offering camps that are first come, first serve. Please see the specific
            guidelines below.{" "}
            <Typography variant="caption">(Please note the guidelines may change):</Typography>
          </Typography>

          <ul style={{ paddingBottom: "50px", color: "var(--color-muted)" }}>
            <li>
              <Typography
                sx={{ fontFamily: "var(--font-display)", textTransform: "uppercase", padding: "5px" }}
              >
                Must pay with credit or debit card only! No bank drafts or checks.
              </Typography>
            </li>
            <li>
              <Typography
                sx={{ fontFamily: "var(--font-display)", textTransform: "uppercase", padding: "5px" }}
              >
                There are no make ups or refunds for these camps.
              </Typography>
            </li>
            <li>
              <Typography
                sx={{ fontFamily: "var(--font-display)", textTransform: "uppercase", padding: "5px" }}
              >
                Make ups are not allowed to be used for these camps.
              </Typography>
            </li>
            <li>
              <Typography
                sx={{ fontFamily: "var(--font-display)", textTransform: "uppercase", padding: "5px" }}
              >
                These camps will not affect your current enrollment.
              </Typography>
            </li>
          </ul>
          <Grid container justifyContent="center">
            {camps.map((camp, index) => (
              <CampComponent key={`${camp.title}-${index}`} camp={camp} index={index} />
            ))}
          </Grid>
        </Container>
      </Box>
      <OurProcess />
      <Footer />
    </>
  );
}

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
    backgroundColor: `#F44336`,
    padding: "7.5px",
  },
  overlayText: {
    width: "100%",
    fontFamily: "montserrat",
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
    backgroundColor: "#3a3a3a",
    padding: "7.5px",
  },
  PeakPerformanceCampText: {
    color: "#FFF",
    width: "100%",
    fontFamily: "montserrat",
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
      <Box sx={{ backgroundColor: "#000", color: "#FFF" }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              fontFamily: "montserrat",
              fontWeight: "600",
              textTransform: "uppercase",
              padding: "25px 0",
            }}
          >
            We are offering camps that are first come, first serve. Please see the specific
            guidelines below.{" "}
            <Typography variant="caption">(Please note the guidelines may change):</Typography>
          </Typography>

          <ul style={{ paddingBottom: "50px" }}>
            <li>
              <Typography
                sx={{ fontFamily: "montserrat", textTransform: "uppercase", padding: "5px" }}
              >
                Must pay with credit or debit card only! No bank drafts or checks.
              </Typography>
            </li>
            <li>
              <Typography
                sx={{ fontFamily: "montserrat", textTransform: "uppercase", padding: "5px" }}
              >
                There are no make ups or refunds for these camps.
              </Typography>
            </li>
            <li>
              <Typography
                sx={{ fontFamily: "montserrat", textTransform: "uppercase", padding: "5px" }}
              >
                Make ups are not allowed to be used for these camps.
              </Typography>
            </li>
            <li>
              <Typography
                sx={{ fontFamily: "montserrat", textTransform: "uppercase", padding: "5px" }}
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

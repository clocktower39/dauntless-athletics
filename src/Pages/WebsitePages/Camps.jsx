import React from "react";
import { camps } from "../../states";
import WebsiteNavbar from "./WebsiteNavbar";
import CampComponent from "../../Components/CampComponent";
import Footer from "../../Components/Footer";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Groups as GroupsIcon } from "@mui/icons-material";
import StepOneImg from "../../assets/Step-1-Evaluate.png";
import StepTwoImg from "../../assets/Step-2-Breakdown.png";
import StepThreeImg from "../../assets/Step-3-Spot-It.png";
import StepFourImg from "../../assets/Step-4-Get-It.png";

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
  stepImgBox: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  stepImage: {
    height: "144px",
    width: "144px",
  },
  stepOverlayText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
    textAlign: "center",
    width: "100%",
    fontFamily: "montserrat",
    fontSize: "1.5em",
    textTransform: "uppercase",
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
            We are offering classes that are first come, first serve. Please see the specific
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
                Make ups are not allowed to be used for these classes.
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
          <Box sx={classes.PeakPerformanceCamp}>
            <Grid container justifyContent="center">
              <Typography
                sx={{ ...classes.PeakPerformanceCampText, padding: "15px" }}
                variant="h4"
                textAlign="center"
              >
                Peak Performance Camp
              </Typography>
              <Typography sx={{ ...classes.PeakPerformanceCampText }} variant="h5" textAlign="center">
                Hosted at Sun Devil Fitness Complex
              </Typography>
              <Typography sx={{ ...classes.PeakPerformanceCampText }} variant="body1" textAlign="center">
                Event Date: June 20th & 21st
              </Typography>
              <Typography
                sx={{ ...classes.PeakPerformanceCampText, fontSize: "1em" }}
                variant="subtitle1"
                textAlign="center"
              >
                <a href="https://sites.google.com/view/peakperformancecampqanda/home">FAQs</a>
              </Typography>
              <Typography
                sx={{ ...classes.PeakPerformanceCampText, fontSize: "1em" }}
                variant="subtitle1"
                textAlign="center"
              >
                See More Information and Enroll{" "}
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSe1V-5ncRhGBZgratsZabDwtlg93Tt1u4yPfpor6JnR9GjImA/viewform?pli=1">
                  Here
                </a>
                !
              </Typography>
            </Grid>
          </Box>
          <Grid container justifyContent="center">
            {camps.map((camp, index) => (
              <CampComponent key={`${camp.title}-${index}`} camp={camp} index={index} />
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "#E9E9E9" }}>
        <Container maxWidth="sm">
          <Typography
            textAlign="center"
            color="rgb(76, 88, 103)"
            variant="h5"
            sx={{ fontFamily: "montserrat", padding: "50px 0" }}
          >
            Our Process
          </Typography>
          <Typography
            textAlign="center"
            color="#4c5867"
            variant="h6"
            sx={{ fontWeight: 200, fontFamily: "source sans pro", paddingBottom: "50px" }}
          >
            Our process incorporates 4 key steps starting from establishing which skills need to be
            worked on, providing body control, and then getting the skill.
          </Typography>
        </Container>
        <Container maxWidth="lg">
          <Grid container spacing={5} sx={{ padding: "25px" }}>
            <Grid container size={{ xs: 12, md: 3 }} justifyContent="center">
              <Box>
                <Box sx={classes.stepImgBox}>
                  <img src={StepOneImg} alt="Step 1" style={classes.stepImage} />
                  <Typography sx={classes.stepOverlayText} variant="h4">
                    Evaluate
                  </Typography>
                </Box>
                <Typography textAlign="center" color="rgb(95, 114, 127)">
                  Evaluate the athlete to determine which skills to focus on and next steps.
                </Typography>
              </Box>
            </Grid>

            <Grid container size={{ xs: 12, md: 3 }} justifyContent="center">
              <Box>
                <Box sx={classes.stepImgBox}>
                  <img src={StepTwoImg} alt="Step 2" style={classes.stepImage} />
                  <Typography sx={classes.stepOverlayText} variant="h4">
                    Breakdown
                  </Typography>
                </Box>
                <Typography textAlign="center" color="rgb(95, 114, 127)">
                  Perform a detailed breakdown and guidance of the skill.
                </Typography>
              </Box>
            </Grid>

            <Grid container size={{ xs: 12, md: 3 }} justifyContent="center">
              <Box>
                <Box sx={classes.stepImgBox}>
                  <img src={StepThreeImg} alt="Step 3" style={classes.stepImage} />
                  <Typography sx={classes.stepOverlayText} variant="h4">
                    Spot It
                  </Typography>
                </Box>
                <Typography textAlign="center" color="rgb(95, 114, 127)">
                  Spot the skill being worked on to help provide control and correct movements.
                </Typography>
              </Box>
            </Grid>

            <Grid container size={{ xs: 12, md: 3 }} justifyContent="center">
              <Box>
                <Box sx={classes.stepImgBox}>
                  <img src={StepFourImg} alt="Step 4" style={classes.stepImage} />
                  <Typography sx={classes.stepOverlayText} variant="h4">
                    Get It
                  </Typography>
                </Box>
                <Typography textAlign="center" color="rgb(95, 114, 127)">
                  Get the skill minimizing the spot and correction needed.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

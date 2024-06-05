import React from "react";
import { camps } from "../../states";
import WebsiteNavbar from "./WebsiteNavbar";
import CampComponent from "../../Components/CampComponent";
import Footer from "../../Components/Footer";
import { Box, Container, Grid, Typography } from "@mui/material";
import DauntlessPeakYourPerformanceImg from "../../assets/Dauntless-Peak-Your-Performance.png";
import StepOneImg from "../../assets/Step-1-Evaluate.png";
import StepTwoImg from "../../assets/Step-2-Breakdown.png";
import StepThreeImg from "../../assets/Step-3-Spot-It.png";
import StepFourImg from "../../assets/Step-4-Get-It.png";

const classes = {
  mainImgBox: {
    position: "relative", // Essential for absolute positioning of children
    width: "100%",
    height: "55vh", // Matching the image height
    backgroundColor: "black",
  },
  overlayText: {
    position: "absolute", // Absolutely position within the relative container
    top: "50%", // Center vertically
    left: "50%", // Center horizontally
    transform: "translate(-50%, -50%)", // Adjust the exact centering
    color: "white", // Text color
    zIndex: 2, // Ensure it's above the image
    textAlign: "center", // Center the text horizontally
    width: "100%", // Ensure it can be centered properly
    fontFamily: "montserrat",
    fontSize: {
      xs: "2em",
      sm: "2em",
      md: "3em",
      lg: "4em",
      xl: "5em",
    },
    textTransform: "uppercase",
  },
  image: {
    position: "absolute", // Position relative to the container
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", // Maintain aspect ratio while covering the area
  },
  stepImgBox: {
    position: "relative", // This is crucial for correct positioning
    display: "flex",
    justifyContent: "center",
  },
  stepImage: {
    height: "144px",
    width: "144px",
  },
  stepOverlayText: {
    position: "absolute", // Absolutely position within the relative container
    top: "50%", // Center vertically
    left: "50%", // Center horizontally
    transform: "translate(-50%, -50%)", // Adjust the exact centering
    zIndex: 2, // Ensure it's above the image
    textAlign: "center", // Center the text horizontally
    width: "100%", // Ensure it can be centered properly
    fontFamily: "montserrat",
    fontSize: "1.5em",
    textTransform: "uppercase",
  },
};

export default function Camps() {
  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <img src={DauntlessPeakYourPerformanceImg} alt="Inspiring Mountain" style={classes.image} />
        <Typography sx={classes.overlayText} variant="h4">
          Camps
          <br /> That Peak Your Skills
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: "#FFFFFF" }}>
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
                Sign ups will occur weekly.
              </Typography>
            </li>
            <li>
              <Typography
                sx={{ fontFamily: "montserrat", textTransform: "uppercase", padding: "5px" }}
              >
                These camps will not affect your current enrollment.
              </Typography>
            </li>
            <li>
              <Typography
                sx={{ fontFamily: "montserrat", textTransform: "uppercase", padding: "5px" }}
              >
                Nothing will be charged unless enrolling in the new classes.
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
            <Grid container item xs={12} md={3} justifyContent="center">
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

            <Grid container item xs={12} md={3} justifyContent="center">
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

            <Grid container item xs={12} md={3} justifyContent="center">
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

            <Grid container item xs={12} md={3} justifyContent="center">
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

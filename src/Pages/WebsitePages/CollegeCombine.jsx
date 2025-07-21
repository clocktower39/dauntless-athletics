import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { HashLink as Link } from "react-router-hash-link";
import { Button, Box, Container, Divider, Paper, Grid, Typography } from "@mui/material";
import CaptivateMinds from "../../Components/CaptivateMinds";
import Footer from "../../Components/Footer";
import {
  Policy as PolicyIcon,
  Hub as HubIcon,
  School as SchoolIcon,
  Diversity2 as Diversity2Icon,
  MiscellaneousServices as MiscellaneousServicesIcon,
  Fireplace as FireplaceIcon,
  Class as ClassIcon,
  Gavel as GavelIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import ReactPlayer from "react-player";

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
  policyAndProcedureDescriptionText: {
    color: "#FFF",
    fontFamily: "source sans pro",
    fontSize: "16px",
    padding: "7.5px 0",
  },
};

export default function CollegeCombine() {
  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container size={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                College Combine
              </Typography>
            </Grid>
            <Grid container size={4} justifyContent="flex-end" alignItems="center">
              <MiscellaneousServicesIcon
                sx={{ fontSize: "5em", maxHeight: "5em", maxWidth: "5em" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Divider />

      <Box sx={{ backgroundColor: "#000" }}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  color: "#fff",
                  border: "3px solid rgb(36, 36, 36)",
                  margin: "35px 0",
                  width: "100%",
                }}
              >
                <ReactPlayer
                  src="https://www.youtube.com/shorts/taGzf--q0Hc?feature=share"
                  width="100%"
                  height="80vh"
                  muted
                  loop
                />
              </Box>
            </Grid>

            <Grid container size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  color: "#fff",
                  border: "3px solid rgb(36, 36, 36)",
                  margin: "35px",
                  padding: "35px",
                }}
              >
                <Grid container size={12} justifyContent="center" sx={{ color: "#fff" }}>
                  <Typography
                    textAlign="center"
                    sx={{
                      fontFamily: "montserrat",
                      fontSize: "24px",
                      padding: "15px",
                      textTransform: "uppercase",
                    }}
                  >
                    <FireplaceIcon sx={{ color: "inherit", fontSize: "inherit" }} /> Cheer College
                    Combine
                  </Typography>
                  <Typography
                    textAlign="center"
                    sx={{
                      fontFamily: "source sans pro",
                      fontSize: "16px",
                      lineHeight: "25px",
                      padding: "15px",
                    }}
                  >
                    Don’t miss out on a great opportunity to get recruited, meet, and show off your
                    skills to colleges and universities from all over! Open to high schoolers and
                    college students.
                  </Typography>
                  <Typography
                    textAlign="center"
                    sx={{
                      fontFamily: "source sans pro",
                      fontSize: "16px",
                      lineHeight: "25px",
                      padding: "15px",
                    }}
                  >
                    **After sign-up, you will receive an email with a google form that must be
                    filled out! IT WILL BE SENT TO THE EMAIL ON FILE.**
                  </Typography>
                </Grid>
                <Grid container size={12} justifyContent="center" sx={{ padding: "25px" }}>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "rgb(221, 153, 51)",
                      borderColor: "rgb(221, 153, 51)",
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "rgb(221, 51, 51)",
                        borderColor: "rgb(221, 51, 51)",
                      },
                    }}
                    component={Link}
                    to={
                      "https://app.iclasspro.com/portal/dauntlessathletics/camp-details/509?typeId=22&filters=%7B%7D"
                    }
                  >
                    <KeyboardArrowRightIcon /> See Available Openings
                  </Button>
                </Grid>
              </Box>
              <Box
                sx={{
                  color: "#fff",
                  border: "3px solid rgb(36, 36, 36)",
                  margin: "35px",
                  padding: "35px",
                }}
              >
                <Grid container size={12} justifyContent="center" sx={{ color: "#fff" }}>
                  <Typography
                    textAlign="center"
                    sx={{
                      fontFamily: "montserrat",
                      fontSize: "24px",
                      padding: "15px",
                      textTransform: "uppercase",
                    }}
                  >
                    <GavelIcon sx={{ fontSize: "inherit" }} /> TUMBLING CONTRACTING SERVICES
                  </Typography>
                  <Typography
                    textAlign="center"
                    sx={{
                      fontFamily: "source sans pro",
                      fontSize: "16px",
                      lineHeight: "25px",
                      padding: "15px",
                    }}
                  >
                    We will contract with your gym or school to provide single or re-occuring
                    clinics.
                  </Typography>
                </Grid>
                <Grid container size={12} justifyContent="center" sx={{ padding: "25px" }}>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "rgb(221, 153, 51)",
                      borderColor: "rgb(221, 153, 51)",
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "rgb(221, 51, 51)",
                        borderColor: "rgb(221, 51, 51)",
                      },
                    }}
                    component={Link}
                    to={"/contact-us/#"}
                  >
                    <KeyboardArrowRightIcon /> Contact Us
                  </Button>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <CaptivateMinds />
      </Box>
      <Footer />
    </>
  );
}

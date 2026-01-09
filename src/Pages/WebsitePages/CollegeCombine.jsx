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
  policyAndProcedureDescriptionText: {
    color: "var(--color-text)",
    fontFamily: "var(--font-body)",
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
      <Divider sx={{ borderColor: "var(--color-border)" }} />

      <Box sx={{ backgroundColor: "transparent", padding: { xs: "30px 0", md: "50px 0" } }}>
        <Container
          maxWidth="lg"
          sx={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "28px",
            padding: { xs: "20px", md: "32px" },
            boxShadow: "0 28px 50px rgba(0,0,0,0.45)",
          }}
        >
          <Grid container>
            <Grid container size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "20px",
                  margin: { xs: "20px 0", md: "35px 0" },
                  width: "100%",
                  overflow: "hidden",
                  boxShadow: "0 24px 40px rgba(0,0,0,0.35)",
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
                  color: "var(--color-text)",
                  backgroundColor: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "20px",
                  margin: { xs: "20px 0", md: "35px" },
                  padding: "35px",
                  boxShadow: "0 24px 40px rgba(0,0,0,0.35)",
                }}
              >
                <Grid container size={12} justifyContent="center" sx={{ color: "var(--color-text)" }}>
                  <Typography
                    textAlign="center"
                    sx={{
                      fontFamily: "var(--font-display)",
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
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      lineHeight: "25px",
                      padding: "15px",
                      color: "var(--color-muted)",
                    }}
                  >
                    Don’t miss out on a great opportunity to get recruited, meet, and show off your
                    skills to colleges and universities from all over! Open to high schoolers and
                    college students.
                  </Typography>
                  <Typography
                    textAlign="center"
                    sx={{
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      lineHeight: "25px",
                      padding: "15px",
                      color: "var(--color-muted)",
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
                      color: "var(--color-text)",
                      borderColor: "var(--color-border)",
                      borderRadius: "999px",
                      "&:hover": {
                        color: "var(--color-text)",
                        backgroundColor: "rgba(215, 38, 56, 0.12)",
                        borderColor: "var(--color-accent)",
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
            </Grid>
          </Grid>
        </Container>

        <CaptivateMinds />
      </Box>
      <Footer />
    </>
  );
}

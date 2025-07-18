import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { HashLink as Link } from "react-router-hash-link";
import { Button, Box, Container, Paper, Grid, Typography } from "@mui/material";
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

export default function Services() {
  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container size={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                Our Services
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

      <Box sx={{ backgroundColor: "#000" }}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  color: "#fff",
                  border: "3px solid rgb(36, 36, 36)",
                  margin: "35px",
                  padding: "35px",
                }}
              >
                <Typography
                  textAlign="center"
                  sx={{
                    fontFamily: "montserrat",
                    fontSize: "24px",
                    padding: "15px",
                  }}
                >
                  <ClassIcon sx={{ color: "inherit", fontSize: "inherit" }} /> CLASSES
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
                  We will captivate the minds of your children and teach them skills they thought
                  they could never learn.
                </Typography>
                <ul
                  style={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                    lineHeight: "30px",
                    padding: "15px",
                    marginLeft: "15%",
                  }}
                >
                  <li>Private Lessons</li>
                  <li>High School Onsite Training</li>
                  <li>Strength, Conditioning, and Flexibility</li>
                  <li>Stunting/Flier Class</li>
                  <li>Tumbling</li>
                  <li>Tumbling Camp</li>
                  <li>Twisting</li>
                </ul>

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
                    to={"/#dauntless-classes-section"}
                  >
                    <KeyboardArrowRightIcon /> See Classes
                  </Button>
                </Grid>
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
                    }}
                  >
                    <FireplaceIcon sx={{ color: "inherit", fontSize: "inherit" }} /> EVENTS & CAMPS
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
                    Tumbling Camps and other events that will tune your skills and prepare you for
                    your next competition. Camps when help athletes learn and improve their tumbling
                    skills.
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
                    to={"/camps/#"}
                  >
                    <KeyboardArrowRightIcon /> See Events & Camps
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
                    We contract with schools, gyms, and programs to provide tumbling and stunting
                    instruction — either on-site at your gym, school, or practice facility, or
                    in-house at our own training center. Whether you need a one-time session, or
                    ongoing support, our experienced instructors work alongside your staff to help
                    athletes improve their technique, form, and confidence.
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

          <Grid container justifyContent="center">
            <Typography
              variant="h3"
              textAlign="center"
              sx={{
                color: "#fff",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
                padding: "50px 0",
              }}
            >
              Our{" "}
              <Typography variant="span" sx={{ fontFamily: "Montserrat", fontWeight: 200 }}>
                Services
              </Typography>
            </Typography>
          </Grid>
          <Grid container spacing={2} justifyContent="space-around" sx={{ paddingBottom: "75px" }}>
            <Grid
              container
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{ color: "#fff" }}
              direction="column"
              alignItems="center"
            >
              <HubIcon sx={{ fontSize: "5em", padding: "10px", color: "#ffba43" }} />
              <Typography
                textAlign="center"
                sx={{ fontFamily: "montserrat", fontSize: "24px", padding: "15px" }}
              >
                Gyms
              </Typography>
              <Typography textAlign="center" sx={{ fontFamily: "source sans pro", color: "#FFF" }}>
                We visit gyms that are working to build a strong tumbling program and need help
                coaching their recreational tumbling. Note we do NOT coach cheer teams. If your
                cheer leaders take one of our recreational classes then we will help them improve
                their skills. Dauntless has no desire to start a cheer team but to help all cheer
                leaders and tumblers alike. The goal of Dauntless contracting service is to reach
                out and help as many athletes build their confidence and obtain the skills that they
                desire.
              </Typography>
            </Grid>
            <Grid
              container
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{ color: "#fff" }}
              direction="column"
              alignItems="center"
            >
              <SchoolIcon sx={{ fontSize: "5em", padding: "10px", color: "#bfd382" }} />
              <Typography
                textAlign="center"
                sx={{ fontFamily: "montserrat", fontSize: "24px", padding: "15px" }}
              >
                High School/ Jr. High Tumbling
              </Typography>
              <Typography textAlign="center" sx={{ fontFamily: "source sans pro", color: "#FFF" }}>
                We visit both High Schools and Jr. Highs to work with the athletes on their tumbling
                skills. We make sure that they are able to perform and execute the skills that their
                coach wants them to do in their routine with good form and position.
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <CaptivateMinds />
        <Typography
          textAlign="center"
          variant="h2"
          sx={{
            color: "#FFF",
            fontFamily: "montserrat",
            textTransform: "uppercase",
            fontSize: {
              xs: "1.5em",
              sm: "2.2em",
              md: "3em",
            },
            padding: "1em 0",
            display: "flex", // Ensures the icon and text are flex items
            justifyContent: "center", // Centers the items horizontally
            alignItems: "center",
          }}
        >
          <PolicyIcon sx={{ fontSize: "inherit", verticalAlign: "middle" }} />
          POLICY AND PROCEDURES
        </Typography>
        <Container maxWidth="lg" sx={{ paddingBottom: "75px" }}>
          <Typography variant="body1" sx={{ ...classes.policyAndProcedureDescriptionText }}>
            Each class will be called in at its appropriate scheduled time by Dauntless Athletics
            staff. Students are to remain in the observation area until called in by our staff. No
            students are permitted in the gym or waiting area, before or after class. Without a
            staff member present.
          </Typography>
          <Typography variant="body1" sx={{ ...classes.policyAndProcedureDescriptionText }}>
            Parents are responsible for their children before and after class and must supervise all
            children in the lobby areas at all times.{" "}
          </Typography>
          <Typography variant="body1" sx={{ ...classes.policyAndProcedureDescriptionText }}>
            Dauntless Athletics does have scheduled closures. Please refer to the closure calendar
            on the contact us page on the website. Because some months we have 5 weeks of
            instruction, there will be NO prorated tuition for gym closures.
          </Typography>
          <Typography variant="body1" sx={{ ...classes.policyAndProcedureDescriptionText }}>
            Withdrawal Policy: if you decided to withdraw, you must notify the office in writing, 30
            days prior to withdrawal. An email must be sent to info@dauntlessathletics.com If notice
            is not received, you will continue to be charged.
          </Typography>
          <Typography variant="body1" sx={{ ...classes.policyAndProcedureDescriptionText }}>
            If payment for tuition is overdue your student will not be able to attend class until we
            have received tuition payment.
          </Typography>
          <Typography variant="body1" sx={{ ...classes.policyAndProcedureDescriptionText }}>
            If you encounter a problem or concern at the facility, please bring the problem to our
            attention. If you’d like to make an appointment with a manager, they can be arranged at
            our front office for privacy and to prevent the disruption of classes.
          </Typography>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

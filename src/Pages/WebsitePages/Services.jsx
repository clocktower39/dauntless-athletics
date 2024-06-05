import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
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
import ServicesBannerImg from "../../assets/ServicesBannerImg.jpg";

const classes = {
  mainImgBox: {
    backgroundImage: `url(${ServicesBannerImg})`,
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    backgroundPositionY: "top",
    backgroundSize: "cover",
    padding: "7.5px",
  },
  overlayText: {
    color: "#3c3950", // Text color
    width: "100%", // Ensure it can be centered properly
    fontFamily: "montserrat",
    fontSize: "3em",
    textTransform: "uppercase",
  },
  policyAndProcedureDescriptionText: {
    color: "rgb(95, 114, 127)",
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
            <Grid container item xs={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                Our Services
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent="flex-end" alignItems="center">
              <MiscellaneousServicesIcon sx={{ fontSize: "8em", color: "#fff" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "#000" }}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container item xs={12} md={6}>
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
                    color: "rgb(60, 57, 80)",
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
                  <li>Girls Private Lessons</li>
                  <li>High School Onsite Training</li>
                  <li>Strength, Conditioning, and Flexibility</li>
                  <li>Stunting/Flier Class</li>
                  <li>Tumbling</li>
                  <li>Tumbling Camp</li>
                  <li>Twisting</li>
                </ul>

                <Grid container item xs={12} justifyContent="center" sx={{ padding: '25px', }}>
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
                  >
                    <KeyboardArrowRightIcon /> See Classes
                  </Button>
                </Grid>

              </Box>
            </Grid>

            <Grid container item xs={12} md={6}>
              <Box
                sx={{
                  color: "#fff",
                  border: "3px solid rgb(36, 36, 36)",
                  margin: "35px",
                  padding: "35px",
                }}
              >
                <Grid container item xs={12} justifyContent="center" sx={{ color: "#fff" }}>
                  <Typography
                    textAlign="center"
                    sx={{
                      fontFamily: "montserrat",
                      color: "rgb(60, 57, 80)",
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
                <Grid container item xs={12} justifyContent="center" sx={{ padding: '25px', }}>
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
                <Grid container item xs={12} justifyContent="center" sx={{ color: "#fff" }}>
                  <Typography
                    textAlign="center"
                    sx={{
                      fontFamily: "montserrat",
                      color: "rgb(60, 57, 80)",
                      fontSize: "24px",
                      padding: "15px",
                    }}
                  >
                    <GavelIcon sx={{ color: "inherit", fontSize: "inherit" }} /> TUMBLING
                    CONTRACTING SERVICES
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
                <Grid container item xs={12} justifyContent="center" sx={{ padding: '25px', }}>
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
                Documents
              </Typography>
            </Typography>
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
          <Grid container spacing={2} sx={{ paddingBottom: "75px" }}>
            <Grid
              container
              item
              xs={12}
              sm={6}
              md={4}
              sx={{ color: "#fff" }}
              direction="column"
              alignItems="center"
            >
              <HubIcon sx={{ fontSize: "5em", padding: "10px", color: '#ffba43',  }} />
              <Typography
                textAlign="center"
                sx={{ fontFamily: "montserrat", fontSize: "24px", padding: "15px" }}
              >
                Gyms
              </Typography>
              <Typography
                textAlign="center"
                sx={{ fontFamily: "source sans pro", color: "rgb(188, 198, 205)" }}
              >
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
              item
              xs={12}
              sm={6}
              md={4}
              sx={{ color: "#fff" }}
              direction="column"
              alignItems="center"
            >
              <SchoolIcon sx={{ fontSize: "5em", padding: "10px", color: '#bfd382', }} />
              <Typography
                textAlign="center"
                sx={{ fontFamily: "montserrat", fontSize: "24px", padding: "15px" }}
              >
                High School/ Jr. High Tumbling
              </Typography>
              <Typography
                textAlign="center"
                sx={{ fontFamily: "source sans pro", color: "rgb(188, 198, 205)" }}
              >
                We visit both High Schools and Jr. Highs to work with the athletes on their tumbling
                skills. We make sure that they are able to perform and execute the skills that their
                coach wants them to do in their routine with good form and position.
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sm={6}
              md={4}
              sx={{ color: "#fff" }}
              direction="column"
              alignItems="center"
            >
              <Diversity2Icon sx={{ fontSize: "5em", padding: "10px", color: '#afe0ff', }} />
              <Typography
                textAlign="center"
                sx={{ fontFamily: "montserrat", fontSize: "24px", padding: "15px" }}
              >
                Dance Studio Tumbling
              </Typography>
              <Typography
                textAlign="center"
                sx={{ fontFamily: "source sans pro", color: "rgb(188, 198, 205)" }}
              >
                We visit Dance Studios and work with the dancers on their tumbling skills and
                position. The goal is to help them perform the skills that they put into their
                dances.
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <CaptivateMinds />
        <Typography
          textAlign="center"
          variant="h2"
          sx={{
            color: "rgb(60, 57, 80)",
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
            students are permitted in gym or waiting area, before or after class. Without a staff
            member present.
          </Typography>
          <Typography variant="body1" sx={{ ...classes.policyAndProcedureDescriptionText }}>
            Parents are responsible for their children before and after class and must supervise all
            children in the lobby areas at all times.{" "}
          </Typography>
          <Typography variant="body1" sx={{ ...classes.policyAndProcedureDescriptionText }}>
            Dauntless Athletics does have scheduled closures. Please refer to the annual calendar on
            the back of our welcome letter for the complete listing. Because some months we have 5
            weeks of instruction, there will be NO pro-rated tuition for gym closures. We allow a
            vacation pro-rate in the months of June and July only (2 weeks maximum). Vacation
            pro-rate forms must be turned in by the beginning of the month in which the pro-rate
            occurs.
          </Typography>
          <Typography variant="body1" sx={{ ...classes.policyAndProcedureDescriptionText }}>
            Withdrawal Policy: if you decided to withdrawal, you must notify the office in writing,
            30 days prior to withdrawal. Withdrawal slips are available at the front office for your
            convenience. If notice is not received, you will continue to be charged.
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

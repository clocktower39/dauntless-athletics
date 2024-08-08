import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import Footer from "../../Components/Footer";
import ContactBannerImg from "../../assets/ContactBannerImg.jpg";
import {
  ContactPhoneOutlined as ContactPhoneOutlinedIcon,
  Phone as PhoneIcon,
  EventAvailableOutlined as EventAvailableOutlinedIcon,
  EventBusyOutlined as EventBusyOutlinedIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";

const classes = {
  mainImgBox: {
    backgroundImage: `url(${ContactBannerImg})`,
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
};

export default function Contact() {
  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container item xs={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                Contact Us
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent="flex-end" alignItems="center">
              <ContactPhoneOutlinedIcon sx={{ fontSize: "8em", color: "rgb(145, 160, 172)" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          backgroundColor: "#000",
          fontFamily: "source sans pro",
          fontSize: "24px",
          color: "#fff",
        }}
      >
        <Container maxWidth="lg">
          <Grid container sx={{ padding: "50px 0" }}>
            <Grid container item xs={12} md={3}>
              <Grid container item xs={12} justifyContent="center">
                <PhoneIcon
                  sx={{ fontSize: "64px", padding: "25px 0" }}
                />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Typography
                  textAlign="center"
                  sx={{ fontFamily: "montserrat", fontSize: "36px" }}
                >
                  CONTACT
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{
                  padding: "15px 0",
                  flexGrow: 1,
                  minHeight: "150px",
                  alignContent: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                  }}
                >
                  (480) 214-3908
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                  }}
                >
                  {" "}
                  info@dauntlessathletics.com
                </Typography>
              </Grid>
            </Grid>

            <Grid container item xs={12} md={3}>
              <Grid container item xs={12} justifyContent="center">
                <EventAvailableOutlinedIcon
                  sx={{ color: "rgb(76, 173, 201)", fontSize: "64px", padding: "25px 0" }}
                />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Typography
                  textAlign="center"
                  sx={{ fontFamily: "montserrat", fontSize: "36px" }}
                >
                  CLASS SCHEDULE
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{ padding: "15px 0", flexGrow: 1, minHeight: "150px" }}
              >
                <Typography
                  sx={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                  }}
                >
                  See Class Schedule
                </Typography>
              </Grid>
            </Grid>

            <Grid container item xs={12} md={3}>
              <Grid container item xs={12} justifyContent="center">
                <EventBusyOutlinedIcon
                  sx={{ color: "rgb(117, 214, 156)", fontSize: "64px", padding: "25px 0" }}
                />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Typography
                  textAlign="center"
                  sx={{ fontFamily: "montserrat", fontSize: "36px" }}
                >
                  HOLIDAY SCHEDULE
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{ padding: "15px 0", flexGrow: 1, minHeight: "150px" }}
              >
                <ul
                  style={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                  }}
                >
                  <li>Mar 29th – Mar 31st: Closed</li>
                  <li>May 27th: Closed</li>
                  <li>Jul 1st – Jul 7th: Closed</li>
                  <li>Sept 2nd: Closed</li>
                  <li>Oct 31st: Closed</li>
                  <li>Nov 27th – Dec 1st: Closed</li>
                  <li>Dec 22nd – Jan 1st: Closed</li>
                </ul>
              </Grid>
            </Grid>

            <Grid container item xs={12} md={3}>
              <Grid container item xs={12} justifyContent="center">
                <LocationOnIcon
                  sx={{ color: "rgb(244, 82, 77)", fontSize: "64px", padding: "25px 0" }}
                />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Typography
                  textAlign="center"
                  sx={{ fontFamily: "montserrat", fontSize: "36px" }}
                >
                  ADDRESS
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{ padding: "15px 0", flexGrow: 1, minHeight: "150px" }}
              >
                <Typography
                  textAlign="center"
                  sx={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                  }}
                >
                  1501 E. Baseline Rd., Building 5, Suite 106 Gilbert, AZ 85233
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

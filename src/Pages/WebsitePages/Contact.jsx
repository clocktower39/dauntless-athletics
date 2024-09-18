import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Button, Container, Divider, Grid, TextField, Typography } from "@mui/material";
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
  contactFormTextField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgb(57, 64, 80)", // Outline color
      },
      "&:hover fieldset": {
        borderColor: "rgb(57, 64, 80)", // Outline color on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgb(57, 64, 80)", // Outline color when focused
      },
      backgroundColor: "rgb(24, 24, 40)", // Background color
      color: "white", // Font color
    },
    "& .MuiInputLabel-root": {
      color: "white", // Label color
    },
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
          <Grid container sx={{ padding: "25px 0" }}>
            <Grid container item xs={12} md={3}>
              <Grid container item xs={12} justifyContent="center">
                <PhoneIcon sx={{ fontSize: "64px", padding: "25px 0" }} />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Typography textAlign="center" sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
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
                <Typography textAlign="center" sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
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
                <Typography textAlign="center" sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
                  HOLIDAY SCHEDULE
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{ padding: "15px 0", flexGrow: 1, flexShrink: 0, minHeight: "150px" }}
              >
                <ul
                  style={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                    paddingLeft: "0", // Remove default padding of the ul
                  }}
                >
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Mar 29th – Mar 31st:</span>
                    <span style={{ paddingLeft: "25px" }}>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>May 27th:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Jul 1st – Jul 7th:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Sept 2nd:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Oct 31st:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Nov 27th – Dec 1st:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Dec 22nd – Jan 1st:</span>
                    <span>Closed</span>
                  </li>
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
                <Typography textAlign="center" sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
                  ADDRESS
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{ padding: "15px", flexGrow: 1, minHeight: "150px" }}
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
          <Grid container item justifyContent="center" >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3331.796753358821!2d-111.80131568449212!3d33.376371860489485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872ba8fa94329e07%3A0xf92b7042f9fabc0d!2sDauntless%20Athletics!5e0!3m2!1sen!2sus!4v1607308532613!5m2!1sen!2sus"
              width="100%"
              height="450"
              frameborder="0"
              style={{ border: 0 }}
              allowfullscreen=""
              aria-hidden="false"
              tabindex="0"
            ></iframe>
          </Grid>
          <Grid container spacing={3} sx={{ padding: "25px 0" }}>
            <Grid container item xs={12}>
              <Typography sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
                CONTACT OUR TEAM
              </Typography>
            </Grid>
            <Grid container item xs={12}>
              <TextField label="Name" fullWidth required sx={{ ...classes.contactFormTextField }} />
            </Grid>
            <Grid container item xs={12}>
              <TextField
                label="Email"
                fullWidth
                required
                sx={{ ...classes.contactFormTextField }}
              />
            </Grid>
            <Grid container item xs={12}>
              <TextField label="Phone Number" fullWidth sx={{ ...classes.contactFormTextField }} />
            </Grid>
            <Grid container item xs={12}>
              <TextField
                label="Subject"
                fullWidth
                required
                sx={{ ...classes.contactFormTextField }}
              />
            </Grid>
            <Grid container item xs={12}>
              <TextField
                label="Message"
                multiline
                minRows={4}
                fullWidth
                required
                sx={{ ...classes.contactFormTextField }}
              />
            </Grid>
            <Grid container item xs={12}>
              <Button variant="contained">Submit Message</Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import Footer from "../../Components/Footer";
import FacilityBannerImg from "../../assets/FacilityBannerImg.jpg";
import BuildingOutsideImg from "../../assets/dauntless_athletics_front_of_building.png";
import BuildingWholeSclaeImg from "../../assets/dauntless_athletics_view_of_whole_gym-scaled.jpeg";
import BuildingFrontViewImg from "../../assets/dauntless_athletics_front_view_gym-scaled.jpg";
import BuildingSideViewImg from "../../assets/dauntless_athletics_side_view_gym-scaled.jpeg";
import { HomeOutlined as HomeOutlinedIcon } from "@mui/icons-material";

const classes = {
  mainImgBox: {
    backgroundImage: `url(${FacilityBannerImg})`,
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
    fontSize: "2.2em",
    textTransform: "uppercase",
  },
};``

export default function Facility() {
  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container item xs={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                The Facility
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent="flex-end" alignItems="center">
              <HomeOutlinedIcon sx={{ fontSize: "5em", maxHeight: "5em", maxWidth: "5em", color: "#fff" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          backgroundColor: "#000",
          fontFamily: "source sans pro",
          fontSize: "24px",
          color: "rgb(207,46,46)",
        }}
      >
        <Container maxWidth="lg">
          <img
            src={BuildingOutsideImg}
            style={{ width: "calc(100% - 40px)", height: "auto", padding: "20px" }}
          />
          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />
          <Typography sx={{ padding: "25px" }}>
            We are located at 1501 East Baseline Road Bldg 5, Suite #106, Gilbert, AZ 85233.
          </Typography>

          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />

          <img
            src={BuildingWholeSclaeImg}
            style={{ width: "calc(100% - 40px)", height: "auto", padding: "20px" }}
          />

          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />

          <Typography sx={{ padding: "25px" }}>
            Dauntless Athletics has plenty of space for tumbling, cheer stunts, conditioning, and
            more!
          </Typography>

          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />

          <img
            src={BuildingFrontViewImg}
            style={{ width: "calc(50% - 20px)", height: "auto", padding: "10px" }}
          />
          <img
            src={BuildingSideViewImg}
            style={{ width: "calc(50% - 20px)", height: "auto", padding: "10px" }}
          />

          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />

          <Typography sx={{ padding: "25px" }}>
            Dauntless Athletics has a variety of different equipment that will help your child learn
            that difficult trick.
          </Typography>

          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />
        </Container>
      </Box>
      <Footer />
    </>
  );
}

import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import Footer from "../../Components/Footer";
import { HomeOutlined as HomeOutlinedIcon } from "@mui/icons-material";
import ImageWithSkeleton from "../../Components/ImageWithSkeleton"

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
};``

export default function Facility() {
  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container size={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                The Facility
              </Typography>
            </Grid>
            <Grid container size={4} justifyContent="flex-end" alignItems="center">
              <HomeOutlinedIcon sx={{ fontSize: "5em", maxHeight: "5em", maxWidth: "5em", }} />
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
          <ImageWithSkeleton
            src={'/images/facility/dauntless_athletics_front_of_building.png'}
            style={{ width: "calc(100% - 40px)", height: "auto", padding: "20px" }}
          />
          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />
          <Typography sx={{ padding: "25px" }}>
            We are located at 1501 East Baseline Road Bldg 5, Suite #106, Gilbert, AZ 85233.
          </Typography>

          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />

          <ImageWithSkeleton
            src={'/images/facility/dauntless_athletics_view_of_whole_gym-scaled.jpeg'}
            style={{ width: "calc(100% - 40px)", height: "auto", padding: "20px" }}
          />

          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />

          <Typography sx={{ padding: "25px" }}>
            Dauntless Athletics has plenty of space for tumbling, cheer stunts, conditioning, and
            more!
          </Typography>

          <Divider sx={{ backgroundColor: "rgb(207,46,46)" }} />

          <ImageWithSkeleton
            src={'/images/facility/dauntless_athletics_front_view_gym-scaled.jpg'}
            style={{ width: "calc(50% - 20px)", height: "auto", padding: "10px" }}
          />
          <ImageWithSkeleton
            src={'/images/facility/dauntless_athletics_side_view_gym-scaled.jpeg'}
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

import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { Avatar, Box, Button, Divider, Grid, IconButton, Typography } from "@mui/material";
import {
  Email as EmailIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
  Phone as PhoneIcon,
  Facebook,
  Instagram,
  YouTube,
} from "@mui/icons-material";
import DauntlessAthleticsLogoDesktopCircleImg from '../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png';

const TopFooter = () => {
  return (
    <Grid container sx={{ backgroundColor: "#242424", padding: "75px" }}>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        xs={12}
        sm={6}
        sx={{ padding: "50px 0" }}
      >
        <Avatar
          src={DauntlessAthleticsLogoDesktopCircleImg}
          sx={{ width: "75%", height: "auto", maxWidth: "210px" }}
        />
      </Grid>
      <Grid container xs={12} sm={6}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            color="white"
            sx={{
              fontFamily: "montserrat",
              padding: "15px 0",
              textTransform: "uppercase",
              fontSize: "18px",
            }}
          >
            Dauntless Athletics
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ color: "rgb(153, 169, 181)", fontFamily: "source sans pro" }}>
          <Typography variant="body1" sx={{ fontFamily: "inherit", fontSize: "16px" }}>
            <LocationOnOutlinedIcon sx={{ fontFamily: "inherit", fontSize: "inherit" }} /> Address:
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "inherit", fontSize: "16px" }}>
            1501 E. Baseline Rd., Building 5, Suite 106, Gilbert, AZ 85233
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ bgcolor: "white", margin: "1.1em 0" }} />
        </Grid>
        <Grid item xs={12} sx={{ color: "rgb(153, 169, 181)", fontFamily: "source sans pro" }}>
          {/* Phone Number */}
          <Typography variant="body1" sx={{ fontFamily: "inherit", fontSize: "16px" }}>
            <a href="tel:+14802143908" style={{ textDecoration: "none", color: "inherit" }}>
              <PhoneIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
              Phone: (480) 214-3908
            </a>
          </Typography>

          {/* Email Address */}
          <Typography variant="body1" sx={{ fontFamily: "inherit", fontSize: "16px" }}>
            <a
              href="mailto:info@dauntlessathletics.com"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <EmailIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
              Email: info@dauntlessathletics.com
            </a>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

const BottomFooter = () => {
  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        backgroundColor: "#5C110C",
        alignItems: "center",
        padding: 2, // Add padding for visual separation
      }}
    >
      {/* Social Media Icons Row */}
      <Grid item container justifyContent="center" sx={{ marginBottom: 2 }}>
        <IconButton component={Link} to="https://www.facebook.com/dauntlessathletics" sx={{ color: "rgb(78, 100, 181)" }}>
          <Facebook />
        </IconButton>
        <IconButton component={Link} to="https://www.instagram.com/dauntless_athletics" sx={{ color: "rgb(154, 143, 98)" }}>
          <Instagram />
        </IconButton>
        <IconButton component={Link} to="https://www.youtube.com/channel/UCyH9jh0OGP1pV2T7jyfBb2g" sx={{ color: "rgb(200, 41, 41)" }}>
          <YouTube />
        </IconButton>
      </Grid>

      {/* Navigation Buttons Row */}
      <Grid item>
        <Button component={Link} to="/#" sx={{ color: "rgb(153, 169, 181)" }}>Home</Button>
      </Grid>
      <Grid item>
        <Divider sx={{ bgcolor: "rgb(153, 169, 181)", height: "1em" }} orientation="vertical" />
      </Grid>
      <Grid item>
        <Button component={Link} to="/class-schedule/#" sx={{ color: "rgb(153, 169, 181)" }}>Class Schedule</Button>
      </Grid>
      <Grid item>
        <Divider sx={{ bgcolor: "rgb(153, 169, 181)", height: "1em" }} orientation="vertical" />
      </Grid>
      <Grid item>
        <Button component={Link} to="/services/#" sx={{ color: "rgb(153, 169, 181)" }}>Services</Button>
      </Grid>
      <Grid item>
        <Divider sx={{ bgcolor: "rgb(153, 169, 181)", height: "1em" }} orientation="vertical" />
      </Grid>
      <Grid item>
        <Button component={Link} to="/contact-us/#" sx={{ color: "rgb(153, 169, 181)" }}>Contact Us</Button>
      </Grid>

      {/* Copyright Component */}
      <Grid container item xs={12} sx={{ marginTop: 2, justifyContent: "center" }}>
        <Copyright />
      </Grid>
    </Grid>
  );
};

const Copyright = () => {
  return (
    <Grid item>
      <Typography variant="body2" color="rgb(153, 169, 181)">
        {"© "}
        {new Date().getFullYear()} Dauntless Athletics
      </Typography>
      <Typography variant="body2" color="rgb(153, 169, 181)" textAlign="center">
        All Rights Reserved.
      </Typography>
    </Grid>
  );
};

export default function Footer() {
  return (
    <>
      <footer>
        <TopFooter />
        <BottomFooter />
      </footer>
    </>
  );
}

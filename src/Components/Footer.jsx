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
    <Grid
      container
      sx={{
        backgroundColor: "var(--color-surface)",
        padding: { xs: "50px 24px", md: "80px" },
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        size={{ xs: 12, sm: 6, }}
        sx={{ padding: "50px 0" }}
      >
        <Avatar
          alt="Dauntless Athletics Logo"
          src={DauntlessAthleticsLogoDesktopCircleImg}
          sx={{ width: "75%", height: "auto", maxWidth: "210px" }}
        />
      </Grid>
      <Grid container size={{ xs: 12, sm: 6, }} >
        <Grid size={12}>
          <Typography
            variant="h5"
            sx={{
              padding: "15px 0",
              textTransform: "uppercase",
              fontSize: "18px",
            }}
          >
            Dauntless Athletics
          </Typography>
        </Grid>
        <Grid size={12} sx={{ color: "var(--color-muted)" }}>
          <Typography variant="body1" sx={{ fontSize: "16px" }}>
            <LocationOnOutlinedIcon sx={{ fontFamily: "inherit", fontSize: "inherit" }} /> Address:
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "16px" }}>
            1501 E. Baseline Rd., Building 5, Suite 106, Gilbert, AZ 85233
          </Typography>
        </Grid>
        <Grid size={12}>
          <Divider sx={{ bgcolor: "var(--color-border)", margin: "1.1em 0" }} />
        </Grid>
        <Grid size={12} sx={{ color: "var(--color-muted)" }}>
          {/* Phone Number */}
          <Typography variant="body1" sx={{ fontSize: "16px" }}>
            <a href="tel:+14802143908" style={{ textDecoration: "none", color: "inherit" }}>
              <PhoneIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
              Phone: (480) 214-3908
            </a>
          </Typography>

          {/* Email Address */}
          <Typography variant="body1" sx={{ fontSize: "16px" }}>
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
        background:
          "linear-gradient(120deg, rgba(18, 19, 26, 1), rgba(225, 29, 72, 0.45))",
        alignItems: "center",
        padding: 2,
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Social Media Icons Row */}
      <Grid container size={12} justifyContent="center" sx={{ marginBottom: 2 }}>
        <IconButton
          component={Link}
          to="https://www.facebook.com/dauntlessathletics"
          sx={{
            color: "var(--color-text)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            margin: "0 6px",
          }}
        >
          <Facebook />
        </IconButton>
        <IconButton
          component={Link}
          to="https://www.instagram.com/dauntless_athletics"
          sx={{
            color: "var(--color-text)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            margin: "0 6px",
          }}
        >
          <Instagram />
        </IconButton>
        <IconButton
          component={Link}
          to="https://www.youtube.com/channel/UCyH9jh0OGP1pV2T7jyfBb2g"
          sx={{
            color: "var(--color-text)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            margin: "0 6px",
          }}
        >
          <YouTube />
        </IconButton>
      </Grid>

      {/* Navigation Buttons Row */}
      <Grid>
        <Button component={Link} to="/#" sx={{ color: "var(--color-text)" }}>Home</Button>
      </Grid>
      <Grid>
        <Divider sx={{ bgcolor: "var(--color-border)", height: "1em" }} orientation="vertical" />
      </Grid>
      <Grid>
        <Button component={Link} to="/class-schedule/#" sx={{ color: "var(--color-text)" }}>
          Class Schedule
        </Button>
      </Grid>
      <Grid>
        <Divider sx={{ bgcolor: "var(--color-border)", height: "1em" }} orientation="vertical" />
      </Grid>
      <Grid>
        <Button component={Link} to="/services/#" sx={{ color: "var(--color-text)" }}>
          Services
        </Button>
      </Grid>
      <Grid>
        <Divider sx={{ bgcolor: "var(--color-border)", height: "1em" }} orientation="vertical" />
      </Grid>
      <Grid>
        <Button component={Link} to="/contact-us/#" sx={{ color: "var(--color-text)" }}>
          Contact Us
        </Button>
      </Grid>

      {/* Copyright Component */}
      <Grid container size={12} sx={{ marginTop: 2, justifyContent: "center" }}>
        <Copyright />
      </Grid>
    </Grid>
  );
};

const Copyright = () => {
  return (
    <Grid>
      <Typography variant="body2" color="var(--color-muted)">
        {"© "}
        {new Date().getFullYear()} Dauntless Athletics
      </Typography>
      <Typography variant="body2" color="var(--color-muted)" textAlign="center">
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

import React, { useState, useRef } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { useLocation } from "react-router";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  IconButton,
  Stack,
  Toolbar,
  Menu,
  MenuItem,
  Dialog,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Facebook,
  Instagram,
  YouTube,
} from "@mui/icons-material";
import useWindowWidth from "../../Hooks/WindowWidth";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";

const classes = {
  TopDivider: {
    backgroundColor: "#F44336",
    borderBottomWidth: 5,
  },
  BottomDivider: {
    backgroundColor: "#494c64",
    borderBottomWidth: 1,
  },
  Toolbar: {
    backgroundColor: "#0C0D0D",
    justifyContent: "center", // Center children
  },
  ToolbarContent: {
    // Used for content inside Toolbar
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "lg", // Adjust this value as needed
    padding: "0 16px", // Add padding if necessary
  },
  ToolbarButtonHover: {
    "&:hover": {
      backgroundColor: "rgb(244, 67, 54)",
    },
  },
  ToolbarIcon: {
    fontSize: "1.5rem",
    maxWidth: "1.5rem",
    maxHeight: "1.5rem",
  },
  MenuPaper: {
    backgroundColor: "rgb(33, 35, 49)", // Menu background color
    border: "1px solid rgb(73, 76, 100)",
  },
  MenuItem: {
    color: "rgb(153, 169, 181)", // Menu item font color
    borderBottom: "1px solid rgb(73, 76, 100)",
    padding: "12.5px",
  },
};

export default function WebsiteNavbar() {
  const wide = useWindowWidth(1045);
  const [menuOpen, setMenuOpen] = useState(false);
  const toolbarRef = useRef(null); // Reference for the second Toolbar
  const location = useLocation(); // Get the current location
  const hasAnnouncement = false;

  const handleMenuClick = () => {
    setMenuOpen(true); // Open the menu
  };

  const handleMenuClose = () => {
    setMenuOpen(false); // Close the menu
  };

  const isActive = (path) => {
    // Exact match for the home path without a hash
    if (path === "/#" && location.pathname === "/" && !location.hash) {
      return true;
    }

    // Exact match for hash-based paths (like Classes or Tuition sections)
    if (path.startsWith("/#")) {
      const [pathname, hash] = path.split("#");
      return location.pathname === pathname && location.hash === `#${hash}`;
    }

    // Handle non-hash paths that might end with "/#"
    if (!path.includes("#") || path.endsWith("/#")) {
      const normalizedPath = path.endsWith("/#") ? path.slice(0, -1) : path; // Remove "/#" from the end
      return location.pathname === normalizedPath;
    }

    return false; // Default return false if none of the conditions match
  };

  const navItems = [
    { name: "Home", link: "/#" },
    { name: "Classes", link: "/#dauntless-classes-section" },
    { name: "Tuition", link: "/#tuition-section" },
    { name: "Camps", link: "/camps/#" },
    { name: "Combine", link: "/college-combine/#" },
    { name: "Schedule", link: "/class-schedule/#" },
    { name: "Services", link: "/services/#" },
    { name: "Staff", link: "/staff/#" },
    { name: "Facility", link: "/facility/#" },
    { name: "Contact Us", link: "/contact-us/#" },
    {
      name: "Login",
      link: "https://app.iclasspro.com/portal/dauntlessathletics/login?showLogin=1",
      textColor: "rgb(255, 150, 34)",
    },
  ];

  return (
    <AppBar position="sticky">
      <Divider sx={classes.TopDivider} />
      {hasAnnouncement && (
        <>
          <Toolbar variant="dense" sx={{ ...classes.TopToolbar, ...classes.Toolbar }}>
            <Grid container size={12} justifyContent="center">
              <Typography
                sx={{
                  fontFamily: "montserrat",
                  fontSize: "16px",
                  color: "#ff0000",
                  textAlign: "center",
                  padding: "7.5px 0px",
                }}
              >
                We will be closed from {dayjs.utc(new Date("2024-12-22")).format("dddd, MMMM Do")}{" "}
                through {dayjs.utc(new Date("2025-01-01")).format("dddd, MMMM Do")}. <br />
                Classes will resume on {dayjs
                  .utc(new Date("2025-01-02"))
                  .format("dddd, MMMM Do")}. <br /> Thank you and Happy Holidays!
              </Typography>
            </Grid>
          </Toolbar>
          <Divider sx={classes.BottomDivider} />
        </>
      )}
      <Toolbar variant="dense" sx={{ ...classes.TopToolbar, ...classes.Toolbar }}>
        <Box sx={{ ...classes.ToolbarContent, justifyContent: "flex-end" }}>
          <IconButton
            color="inherit"
            sx={{ ...classes.ToolbarButtonHover }}
            component={Link}
            to={"https://www.facebook.com/dauntlessathletics"}
          >
            <Facebook sx={{ ...classes.ToolbarIcon }} />
          </IconButton>
          <IconButton
            color="inherit"
            sx={{ ...classes.ToolbarButtonHover }}
            component={Link}
            to={"https://www.instagram.com/dauntless_athletics"}
          >
            <Instagram sx={{ ...classes.ToolbarIcon }} />
          </IconButton>
          <IconButton
            color="inherit"
            sx={{ ...classes.ToolbarButtonHover }}
            component={Link}
            to={"https://www.youtube.com/channel/UCyH9jh0OGP1pV2T7jyfBb2g"}
          >
            <YouTube sx={{ ...classes.ToolbarIcon }} />
          </IconButton>
          <Button
            variant="contained"
            size="small"
            sx={{
              fontSize: ".7em",
              backgroundColor: "rgb(153, 169, 181)",
              margin: "0 5px",
              textTransform: "none",
              ...classes.ToolbarButtonHover,
            }}
            component={Link}
            to={"https://stores.inksoft.com/dauntless_apparel/shop/home"}
          >
            <ShoppingCartIcon sx={{ fontSize: "1.3em" }} /> Merch
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              fontSize: ".7em",
              backgroundColor: "rgb(153, 169, 181)",
              margin: "0 2.5px",
              textTransform: "none",
              whiteSpace: "nowrap",
              minWidth: "100px",
              ...classes.ToolbarButtonHover,
            }}
            component={Link}
            to={"https://portal.iclasspro.com/dauntlessathletics/create-account-01-verify-email"}
          >
            Create Account
          </Button>
        </Box>
      </Toolbar>
      <Divider sx={classes.BottomDivider} />
      <Toolbar ref={toolbarRef} sx={classes.Toolbar}>
        <Box sx={{ ...classes.ToolbarContent }}>
          <IconButton
            component={Link}
            to={"/#"}
            sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}
          >
            <Avatar
              src={DauntlessAthleticsLogoDesktopCircleImg}
              alt="Dauntless Athletics Logo"
              sx={wide ? { width: 99, height: 99 } : { width: 56, height: 56 }}
            />
          </IconButton>
          {wide ? (
            <Stack direction="row" spacing={1} sx={{ marginLeft: "auto" }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  sx={{
                    textTransform: "none",
                    color: item.textColor || "#fff",
                    backgroundColor: "#000",
                    fontSize: {
                      xs: "9px",
                      md: "13px",
                    },
                    border: isActive(item.link) ? "2px solid #FFF" : "none",
                  }}
                  component={Link}
                  to={item.link}
                  variant="contained"
                  size="small"
                >
                  {item.name}
                </Button>
              ))}
            </Stack>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="end"
              onClick={handleMenuClick}
              sx={{ marginLeft: "auto" }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
      <Menu
        anchorEl={toolbarRef.current}
        open={!wide && menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: classes.MenuPaper,
        }}
        MenuListProps={{
          style: {
            padding: 0, // Remove default padding for full width effect
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: "90%", // Make Menu full width
            maxWidth: "100%", // Ensure it doesn't exceed the viewport width
            left: 0,
            right: 0,
            top: "auto",
            transform: "none", // Overrides default positioning to remove offset
          },
        }}
      >
        {navItems.map((item) => (
          <MenuItem
            key={item.name}
            onClick={handleMenuClose}
            component={Link}
            to={item.link}
            sx={{
              ...classes.MenuItem,
              color: isActive(item.link) ? "#FFF" : item.textColor || "rgb(153, 169, 181)",
              backgroundColor: isActive(item.link) ? "#181828" : "inherit",
              borderLeft: isActive(item.link) && "3px solid #F44336",
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}

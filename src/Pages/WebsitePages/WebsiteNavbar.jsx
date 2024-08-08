import React, { useState, useRef } from "react";
import { HashLink as Link } from "react-router-hash-link";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, Facebook, Instagram, YouTube } from "@mui/icons-material";
import useWindowWidth from "../../Hooks/WindowWidth";
import DauntlessAthleticsLogoDesktopCircleImg from '../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png';

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

  const handleMenuClick = (event) => {
    setMenuOpen(true); // Open the menu
  };

  const handleMenuClose = () => {
    setMenuOpen(false); // Close the menu
  };

  const navItems = [
    { name: "Home", link: "/#" },
    { name: "Classes", link: "/#dauntless-classes-section" },
    { name: "Tuition", link: "/#tuition-section" },
    { name: "Camps", link: "/camps/#" },
    { name: "Merch", link: "https://stores.inksoft.com/dauntless_apparel/shop/home" },
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
      <Toolbar variant="dense" sx={{ ...classes.TopToolbar, ...classes.Toolbar }}>
        <Box sx={{ ...classes.ToolbarContent, justifyContent: "flex-end" }}>
          <IconButton color="inherit">
            <Facebook />
          </IconButton>
          <IconButton color="inherit">
            <Instagram />
          </IconButton>
          <IconButton color="inherit">
            <YouTube />
          </IconButton>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "rgb(153, 169, 181)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgb(244, 67, 54)",
              },
            }}
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
            to={"/"}
            sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}
          >
            <Avatar
              src={DauntlessAthleticsLogoDesktopCircleImg}
              alt="Logo"
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
                    color: item.textColor || '#fff',
                    backgroundColor: "#000",
                    fontSize: {
                      xs: "9px",
                      md: "13px",
                    }
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
            sx={{ ...classes.MenuItem, color: item.textColor || "rgb(153, 169, 181)" }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}

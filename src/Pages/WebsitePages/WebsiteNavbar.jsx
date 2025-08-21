import React, { useState, useEffect, useRef } from "react";
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
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
} from "@mui/material";
import {
  Close as CloseIcon,
  Notifications,
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Facebook,
  Instagram,
  YouTube,
} from "@mui/icons-material";
import useWindowWidth from "../../Hooks/WindowWidth";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";
import dayjs from "dayjs";

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
  },
  ToolbarContent: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0 16px",
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
    backgroundColor: "rgb(33, 35, 49)",
    border: "1px solid rgb(73, 76, 100)",
  },
  MenuItem: {
    color: "rgb(153, 169, 181)",
    borderBottom: "1px solid rgb(73, 76, 100)",
    padding: "12.5px",
  },
};

export default function WebsiteNavbar() {
  const wide = useWindowWidth(850);
  const [menuOpen, setMenuOpen] = useState(false);
  const toolbarRef = useRef(null);
  const location = useLocation();

  const hasAnnouncement = true;

  const announcementMessage = `We will be closed for all classes on
  ${dayjs
    .utc(new Date("2025-09-01"))
    .format("dddd, MMMM Do")} .
  Have a great Labor Day!`;

  const announcementKey = `announcementDismissed_${btoa(announcementMessage)}`;
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem(announcementKey) === "true";
  });

  const handleDismiss = () => {
    localStorage.setItem(announcementKey, "true");
    setDismissed(true);
  };

  const handleRestoreAnnouncement = () => {
    localStorage.removeItem(announcementKey);
    setDismissed(false);
  };

  // Cleanup old keys
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("announcementDismissed_") && key !== announcementKey) {
      localStorage.removeItem(key);
    }
  });

  const handleMenuClick = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isActive = (path) => {
    if (!path) return false;

    // Exact match for the home path without a hash
    if (path === "/#" && location.pathname === "/") {
      return true;
    }

    if (path.startsWith("/#")) {
      const [pathname, hash] = path.split("#");
      return location.pathname === pathname && location.hash === `#${hash}`;
    }

    if (!path.includes("#") || path.endsWith("/#")) {
      const normalizedPath = path.endsWith("/#") ? path.slice(0, -1) : path;
      return location.pathname === normalizedPath;
    }

    return false;
  };

  const navItems = [
    {
      name: "Home",
      link: "/#",
      submenu: [
        { name: "Classes", link: "/#dauntless-classes-section" },
        { name: "Tuition", link: "/#tuition-section" },
      ],
    },
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
    <AppBar position="sticky" sx={{ zIndex: '1000'}}>
      <Divider sx={classes.TopDivider} />
      {hasAnnouncement && !dismissed && (
        <>
          <Toolbar variant="dense" sx={{ ...classes.Toolbar, display: "block" }}>
            <Grid container size={12}>
              <Grid container size={11} justifyContent="center">
                <Typography
                  sx={{
                    fontFamily: "montserrat",
                    fontSize: "16px",
                    color: "#ff0000",
                    textAlign: "center",
                    padding: "7.5px 0px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {announcementMessage}
                </Typography>
              </Grid>
              <Grid container size={1} alignItems="center" justifyContent="center">
                <IconButton onClick={handleDismiss}>
                  <CloseIcon sx={{ color: "#FFF" }} />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
          <Divider sx={classes.BottomDivider} />
        </>
      )}
      <Toolbar variant="dense" sx={{ ...classes.Toolbar }}>
        {hasAnnouncement && dismissed && (
          <Box sx={{ ...classes.ToolbarContent, justifyContent: "flex-start" }}>
            <IconButton
              onClick={handleRestoreAnnouncement}
              color="inherit"
              sx={{ ...classes.ToolbarButtonHover }}
            >
              <Notifications sx={{ ...classes.ToolbarIcon }} />
            </IconButton>
          </Box>
        )}
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
              {navItems.map((item) => {
                if (item.submenu) {
                  return (
                    <SubMenuItem
                      key={item.name}
                      item={item}
                      isActive={isActive}
                      isTouchDevice={isTouchDevice}
                      hasAnnouncement={hasAnnouncement}
                      dismissed={dismissed}
                    />
                  );
                }

                return (
                  <Button
                    key={item.name}
                    sx={{
                      textTransform: "none",
                      color: item.textColor || "#fff",
                      backgroundColor: "#000",
                      fontSize: { xs: "9px", md: "13px" },
                      border: isActive(item.link) ? "2px solid #FFF" : "none",
                    }}
                    component={Link}
                    to={item.link}
                    variant="contained"
                    size="small"
                  >
                    {item.name}
                  </Button>
                );
              })}
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
        {navItems.flatMap((item) => {
          const baseItem = (
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
          );

          const subItems =
            item.submenu?.map((sub) => (
              <MenuItem
                key={`${item.name}-${sub.name}`}
                onClick={handleMenuClose}
                component={Link}
                to={sub.link}
                sx={{
                  ...classes.MenuItem,
                  paddingLeft: "32px", // Indent for subitems
                  color: isActive(sub.link) ? "#FFF" : sub.textColor || "rgb(153, 169, 181)",
                  backgroundColor: isActive(sub.link) ? "#181828" : "inherit",
                  borderLeft: isActive(sub.link) && "3px solid #F44336",
                }}
              >
                {sub.name}
              </MenuItem>
            )) || [];

          return [baseItem, ...subItems];
        })}
      </Menu>
    </AppBar>
  );
}

const SubMenuItem = ({ item, isActive, isTouchDevice, hasAnnouncement, dismissed, }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const closeTimer = useRef(null);

  const handleOpen = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleClose = () => {
    hasOpenedOnceRef.current = false;
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  const cancelClose = () => clearTimeout(closeTimer.current);

  const hasOpenedOnceRef = useRef(false);

  const handleClick = (e) => {
    if (isTouchDevice) {
      if (!hasOpenedOnceRef.current) {
        e.preventDefault();
        hasOpenedOnceRef.current = true;
        setOpen(true);
      } else {
        hasOpenedOnceRef.current = false; // reset on second tap
        setOpen(false); // optional: close dropdown
      }
    }
  };

  return (
    <>
      <Button
        component={Link}
        to={item.link}
        onClick={handleClick}
        onMouseEnter={!isTouchDevice ? handleOpen : undefined}
        onMouseLeave={!isTouchDevice ? handleClose : undefined}
        ref={anchorRef}
        sx={{
          textTransform: "none",
          color: item.textColor || "#fff",
          backgroundColor: "#000",
          fontSize: { xs: "9px", md: "13px" },
          border: isActive(item.link) ? "2px solid #FFF" : "none",
        }}
        variant="contained"
        size="small"
      >
        {item.name} ▾
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
            <Paper
              onMouseEnter={!isTouchDevice ? cancelClose : undefined}
              onMouseLeave={!isTouchDevice ? handleClose : undefined}
              sx={{
                backgroundColor: "rgb(33, 35, 49)",
                border: "1px solid rgb(73, 76, 100)",
              }}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList disablePadding>
                  {item.submenu.map((sub) => (
                    <MenuItem
                      key={sub.name}
                      component={Link}
                      to={sub.link}
                      scroll={(el) => {
                        const yOffset = (hasAnnouncement && !dismissed) ? -100 : 0; // scroll 100px more (move element down) 
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }}
                      onClick={() => setOpen(false)}
                      sx={{
                        color: isActive(sub.link) ? "#FFF" : sub.textColor || "rgb(153, 169, 181)",
                        backgroundColor: isActive(sub.link) ? "#181828" : "inherit",
                        borderBottom: "1px solid rgb(73, 76, 100)",
                        borderLeft: isActive(sub.link) && "3px solid #F44336",
                        padding: "12.5px",
                      }}
                    >
                      {sub.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

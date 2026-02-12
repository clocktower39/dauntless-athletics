import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
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
import { holidayScheduleEvents } from "./ClassSchedule";
import useWindowWidth from "../../Hooks/WindowWidth";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";
import dayjs from "dayjs";

type HolidayEvent = {
  Id: number;
  StartTime: Date;
  EndTime: Date;
  description?: string;
};

type NavSubItem = { name: string; link: string; textColor?: string };
type NavItem = { name: string; link: string; textColor?: string; submenu?: NavSubItem[] };

const classes = {
  TopDivider: {
    backgroundColor: "var(--color-accent)",
    height: "3px",
  },
  BottomDivider: {
    backgroundColor: "var(--color-border)",
    borderBottomWidth: 1,
  },
  Toolbar: {
    backgroundColor: "rgba(11, 13, 16, 0.9)",
    backdropFilter: "blur(12px)",
    color: "var(--color-text)",
  },
  ToolbarContent: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0 16px",
  },
  ToolbarButtonHover: {
    "&:hover": {
      backgroundColor: "rgba(215, 38, 56, 0.18)",
    },
  },
  ToolbarIcon: {
    fontSize: "1.5rem",
    maxWidth: "1.5rem",
    maxHeight: "1.5rem",
  },
  MenuPaper: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
  },
  MenuItem: {
    color: "var(--color-muted)",
    borderBottom: "1px solid var(--color-border)",
    padding: "12.5px",
  },
};

export default function WebsiteNavbar() {
  const wide = useWindowWidth(850);
  const [menuOpen, setMenuOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const getNextHoliday = (events: HolidayEvent[]) => {
    const today = dayjs();
    const upcoming = events.filter((e) => dayjs(e.EndTime).isAfter(today, "day"));

    if (upcoming.length === 0) return null;
    upcoming.sort((a, b) => dayjs(a.StartTime).diff(dayjs(b.StartTime)));
    return upcoming[0];
  };

  const nextHoliday = getNextHoliday(holidayScheduleEvents);

  const today = dayjs();
  const daysUntilHoliday = nextHoliday
    ? dayjs(nextHoliday.StartTime).diff(today, "day")
    : Infinity;

  const hasAnnouncement = !!nextHoliday && daysUntilHoliday <= 10;
  const announcementMessage = nextHoliday?.description;

  const announcementKey = nextHoliday
    ? `announcementDismissed_${nextHoliday.Id}`
    : null;
  const [dismissed, setDismissed] = useState(() => {
    if (!announcementKey) return false;
    return localStorage.getItem(announcementKey) === "true";
  });

  const handleDismiss = () => {
    if (!announcementKey) return;
    localStorage.setItem(announcementKey, "true");
    setDismissed(true);
  };

  const handleRestoreAnnouncement = () => {
    if (!announcementKey) return;
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

  const isActive = (path: string) => {
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

  const navItems: NavItem[] = [
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
    <AppBar position="sticky" sx={{ zIndex: 1000, backgroundColor: "transparent", boxShadow: "none" }}>
      <Divider sx={classes.TopDivider} />
      {hasAnnouncement && !dismissed && (
        <>
          <Toolbar variant="dense" sx={{ ...classes.Toolbar, display: "block" }}>
            <Grid container size={12}>
              <Grid container size={11} justifyContent="center">
                <Typography
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    color: "var(--color-accent)",
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
                  <CloseIcon sx={{ color: "var(--color-text)" }} />
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
        <Box sx={{ ...classes.ToolbarContent, justifyContent: "flex-end", gap: "6px" }}>
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
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid var(--color-border)",
              margin: "0 5px",
              textTransform: "none",
              color: "var(--color-text)",
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
              backgroundColor: "var(--color-accent)",
              margin: "0 2.5px",
              textTransform: "none",
              whiteSpace: "nowrap",
              minWidth: "100px",
              color: "var(--color-text)",
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
      <Toolbar ref={toolbarRef} sx={{ ...classes.Toolbar, borderBottom: "1px solid var(--color-border)" }}>
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
                      color: item.textColor || "var(--color-text)",
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "999px",
                      fontSize: { xs: "9px", md: "13px" },
                      borderColor: isActive(item.link) ? "var(--color-accent)" : "var(--color-border)",
                      boxShadow: isActive(item.link) ? "0 0 18px var(--color-glow)" : "none",
                      "&:hover": {
                        backgroundColor: "rgba(215, 38, 56, 0.18)",
                      },
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
                color: isActive(item.link) ? "var(--color-text)" : item.textColor || "var(--color-muted)",
                backgroundColor: isActive(item.link) ? "var(--color-surface-2)" : "inherit",
                borderLeft: isActive(item.link) && "3px solid var(--color-accent)",
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
                  color: isActive(sub.link) ? "var(--color-text)" : sub.textColor || "var(--color-muted)",
                  backgroundColor: isActive(sub.link) ? "var(--color-surface-2)" : "inherit",
                  borderLeft: isActive(sub.link) && "3px solid var(--color-accent)",
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

type SubMenuItemProps = {
  item: NavItem & { submenu: NavSubItem[] };
  isActive: (path: string) => boolean;
  isTouchDevice: boolean;
  hasAnnouncement: boolean;
  dismissed: boolean;
};

const SubMenuItem = ({ item, isActive, isTouchDevice, hasAnnouncement, dismissed }: SubMenuItemProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<number | null>(null);

  const handleOpen = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
    }
    setOpen(true);
  };

  const handleClose = () => {
    hasOpenedOnceRef.current = false;
    closeTimer.current = window.setTimeout(() => setOpen(false), 200);
  };

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
    }
  };

  const hasOpenedOnceRef = useRef(false);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
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
          color: item.textColor || "var(--color-text)",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          border: "1px solid var(--color-border)",
          borderRadius: "999px",
          fontSize: { xs: "9px", md: "13px" },
          borderColor: isActive(item.link) ? "var(--color-accent)" : "var(--color-border)",
          boxShadow: isActive(item.link) ? "0 0 18px var(--color-glow)" : "none",
          "&:hover": {
            backgroundColor: "rgba(215, 38, 56, 0.18)",
          },
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
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
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
                        color: isActive(sub.link) ? "var(--color-text)" : sub.textColor || "var(--color-muted)",
                        backgroundColor: isActive(sub.link) ? "var(--color-surface-2)" : "inherit",
                        borderBottom: "1px solid var(--color-border)",
                        borderLeft: isActive(sub.link) && "3px solid var(--color-accent)",
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

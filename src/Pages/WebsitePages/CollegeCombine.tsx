import WebsiteNavbar from "./WebsiteNavbar";
import { Button, Box, Container, Grid, Stack, Typography } from "@mui/material";
import CaptivateMinds from "../../Components/CaptivateMinds";
import Footer from "../../Components/Footer";
import SEO from "../../Components/SEO";
import ReactPlayer from "../../Components/YouTubeOnlyPlayer";
import {
  MiscellaneousServices as MiscellaneousServicesIcon,
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarMonthIcon,
  Email as EmailIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  LocationOn as LocationOnIcon,
  Payments as PaymentsIcon,
  PeopleAlt as PeopleAltIcon,
} from "@mui/icons-material";

const classes = {
  mainImgBox: {
    backgroundColor: "var(--color-surface)",
    borderBottom: "1px solid var(--color-border)",
    padding: "18px 0",
  },
  overlayText: {
    width: "100%",
    fontFamily: "var(--font-display)",
    fontSize: "2.2em",
    fontWeight: 500,
    textTransform: "uppercase",
  },
};

const eventLink =
  "https://cusd80.ce.eleyo.com/course/4676/cct-26-27/chs-dauntless-college-combine#26-27-chs-dauntless-college-combine";

const detailCards = [
  {
    icon: <PeopleAltIcon sx={{ color: "var(--color-accent)" }} />,
    label: "Who",
    value: "9th-12th grades",
    detail: "Students from any school can join the combine.",
  },
  {
    icon: <CalendarMonthIcon sx={{ color: "var(--color-accent)" }} />,
    label: "When",
    value: "Saturday, July 25, 2026",
    detail: "Athlete check-in starts at 2:00 PM.",
  },
  {
    icon: <LocationOnIcon sx={{ color: "var(--color-accent)" }} />,
    label: "Where",
    value: "Chandler High Payne Gym",
    detail: "Hosted at Chandler High School.",
  },
  {
    icon: <AccessTimeIcon sx={{ color: "var(--color-accent)" }} />,
    label: "Time",
    value: "2:30 PM - 6:30 PM",
    detail: "Athletes check in at 2:00 PM.",
  },
  {
    icon: <PaymentsIcon sx={{ color: "var(--color-accent)" }} />,
    label: "Cost",
    value: "$150.00",
    detail: "Includes event shirt.",
  },
  {
    icon: <EmailIcon sx={{ color: "var(--color-accent)" }} />,
    label: "Questions",
    value: "info@dauntlessathletics.com",
    detail: "Also: chandlercheerteam@gmail.com",
  },
];

export default function CollegeCombine() {
  return (
    <>
      <SEO
        title="College Combine"
        description="Register for the 2026 CHS Dauntless College Combine on July 25, 2026 at Chandler High Payne Gym for high school athletes pursuing cheer in college."
        path="/college-combine"
      />
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container size={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                College Combine
              </Typography>
            </Grid>
            <Grid container size={4} justifyContent="flex-end" alignItems="center">
              <MiscellaneousServicesIcon
                sx={{ fontSize: "5em", maxHeight: "5em", maxWidth: "5em" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "transparent", padding: { xs: "30px 0", md: "50px 0" } }}>
        <Container
          maxWidth="lg"
          sx={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "28px",
            padding: { xs: "20px", md: "32px" },
            boxShadow: "0 28px 50px rgba(0,0,0,0.45)",
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  background:
                    "linear-gradient(160deg, rgba(215,38,56,0.18), rgba(6,94,153,0.12) 70%, rgba(255,255,255,0.02))",
                  border: "1px solid var(--color-border)",
                  borderRadius: "24px",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography
                    sx={{
                      color: "var(--color-accent)",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.78rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      mb: 1.5,
                    }}
                  >
                    CHS - Dauntless College Combine
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-text)",
                      textTransform: "uppercase",
                      lineHeight: 1.02,
                      fontSize: { xs: "2rem", md: "3rem" },
                      mb: 2,
                    }}
                  >
                    2026 College Combine
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--color-muted)",
                      fontSize: { xs: "1rem", md: "1.05rem" },
                      lineHeight: 1.7,
                      maxWidth: "60ch",
                      mb: 3,
                    }}
                  >
                    Our college combine is for high school athletes looking to pursue cheer in
                    college. At the combine, athletes will showcase their tumbling, stunting, and
                    jumps in front of college coaches.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button
                      variant="contained"
                      href={eventLink}
                      target="_blank"
                      rel="noreferrer"
                      sx={{
                        backgroundColor: "var(--color-accent)",
                        borderRadius: "999px",
                        px: 3,
                        py: 1.2,
                        "&:hover": {
                          backgroundColor: "var(--color-accent-2)",
                        },
                      }}
                    >
                      <KeyboardArrowRightIcon /> Register And View Details
                    </Button>
                    <Button
                      variant="outlined"
                      href="mailto:info@dauntlessathletics.com"
                      sx={{
                        color: "var(--color-text)",
                        borderColor: "var(--color-border)",
                        borderRadius: "999px",
                        px: 3,
                        py: 1.2,
                        "&:hover": {
                          backgroundColor: "rgba(215, 38, 56, 0.12)",
                          borderColor: "var(--color-accent)",
                        },
                      }}
                    >
                      <EmailIcon sx={{ mr: 1 }} /> Contact Us
                    </Button>
                  </Stack>
                </Box>
                <Box
                  component="img"
                  src="https://pictures.ce.eleyo.com/1000010/large/17448283619191158.png"
                  alt="CHS Dauntless College Combine flyer"
                  sx={{
                    display: "block",
                    width: "100%",
                    objectFit: "cover",
                    borderTop: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface-2)",
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  backgroundColor: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "24px",
                  p: { xs: 2, md: 3 },
                  boxShadow: "0 24px 40px rgba(0,0,0,0.35)",
                  height: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-text)",
                    textTransform: "uppercase",
                    fontSize: "1.2rem",
                    mb: 2,
                  }}
                >
                  Event Snapshot
                </Typography>
                <Grid container spacing={1.5}>
                  {detailCards.map((item) => (
                    <Grid key={item.label} size={12}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          alignItems: "flex-start",
                          p: 1.5,
                          borderRadius: "18px",
                          border: "1px solid rgba(255,255,255,0.06)",
                          backgroundColor: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <Box sx={{ mt: 0.35 }}>{item.icon}</Box>
                        <Box>
                          <Typography
                            sx={{
                              color: "var(--color-muted)",
                              fontSize: "0.78rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              mb: 0.25,
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography sx={{ color: "var(--color-text)", fontWeight: 700 }}>
                            {item.value}
                          </Typography>
                          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.92rem" }}>
                            {item.detail}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid size={12}>
              <Box
                sx={{
                  backgroundColor: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 24px 40px rgba(0,0,0,0.35)",
                }}
              >
                <Box sx={{ p: { xs: 2, md: 3 }, pb: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-text)",
                      textTransform: "uppercase",
                      fontSize: "1.15rem",
                      mb: 1,
                    }}
                  >
                    Combine Preview
                  </Typography>
                  <Typography sx={{ color: "var(--color-muted)", mb: 2 }}>
                    A quick look at the energy and skill focus behind the Dauntless college combine.
                  </Typography>
                </Box>
                <ReactPlayer
                  src="https://www.youtube.com/shorts/taGzf--q0Hc?feature=share"
                  width="100%"
                  height="70vh"
                  muted
                  loop
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Box
                sx={{
                  backgroundColor: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "24px",
                  p: { xs: 2, md: 3 },
                  boxShadow: "0 24px 40px rgba(0,0,0,0.35)",
                }}
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-text)",
                        textTransform: "uppercase",
                        fontSize: "1.15rem",
                        mb: 1.5,
                      }}
                    >
                      Important Details
                    </Typography>
                    <Stack spacing={1.25}>
                      <Typography sx={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
                        <strong style={{ color: "var(--color-text)" }}>Wear:</strong> Please wear
                        athletic attire.
                      </Typography>
                      <Typography sx={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
                        <strong style={{ color: "var(--color-text)" }}>Refund policy:</strong> No
                        refunds after 5:00 PM on July 17, 2026.
                      </Typography>
                      <Typography sx={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
                        <strong style={{ color: "var(--color-text)" }}>ACH note:</strong> A $25.00
                        returned check fee will apply with any ACH payments that are returned.
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Box
                      sx={{
                        borderRadius: "20px",
                        border: "1px solid rgba(255,255,255,0.06)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        p: 2.5,
                        height: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "var(--font-display)",
                          color: "var(--color-text)",
                          textTransform: "uppercase",
                          fontSize: "1rem",
                          mb: 1,
                        }}
                      >
                        Registration Link
                      </Typography>
                      <Typography sx={{ color: "var(--color-muted)", mb: 2, lineHeight: 1.7 }}>
                        View the official course listing for registration details and current event
                        information.
                      </Typography>
                      <Button
                        fullWidth
                        variant="outlined"
                        href={eventLink}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          color: "var(--color-text)",
                          borderColor: "var(--color-accent)",
                          borderRadius: "999px",
                          "&:hover": {
                            backgroundColor: "rgba(215, 38, 56, 0.12)",
                            borderColor: "var(--color-accent-2)",
                          },
                        }}
                      >
                        Open Official Listing
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <CaptivateMinds />
        </Box>
      </Box>
      <Footer />
    </>
  );
}

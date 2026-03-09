import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import {
  AutoGraph as AutoGraphIcon,
  Groups as GroupsIcon,
  SportsGymnastics as SportsGymnasticsIcon,
} from "@mui/icons-material";
import { HashLink as Link } from "react-router-hash-link";
import WebsiteNavbar from "./WebsiteNavbar";
import Footer from "../../Components/Footer";

const formLink =
  "https://docs.google.com/forms/d/e/1FAIpQLScfWJL6iHzEE8zzi5oFcEH3-Jr41YkYj4tE9OQuDXE_1JvjjQ/viewform";

const heroImage = {
  src: "/images/camps/peak_performance_2026.png",
  alt: "Peak Performance Camp spotlight",
};

const galleryImages = [
  {
    src: "/images/camps/peak_performance_sundevil_2026.png",
    alt: "Peak Performance Camp special guest poster",
  },
  {
    src: "/images/camps/peak_performance_info_2026.png",
    alt: "Peak Performance Camp details",
  },
];

const classes = {
  heroShell: {
    backgroundColor: "var(--color-surface)",
    borderBottom: "1px solid var(--color-border)",
    padding: { xs: "22px 0", md: "30px 0" },
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontSize: { xs: "2.2rem", md: "3.2rem" },
    textTransform: "uppercase",
    color: "var(--color-text)",
    letterSpacing: "0.04em",
  },
  heroSubtitle: {
    fontFamily: "var(--font-body)",
    color: "var(--color-muted)",
    fontSize: "1rem",
    lineHeight: 1.7,
  },
  heroCard: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "22px",
    padding: { xs: "20px", md: "28px" },
    boxShadow: "0 28px 50px rgba(0,0,0,0.45)",
    display: "grid",
    gap: "16px",
  },
  featureCard: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "18px",
    padding: "18px",
    display: "grid",
    gap: "8px",
    height: "100%",
  },
  detailTable: {
    backgroundColor: "var(--color-surface-3)",
    border: "1px solid var(--color-border)",
    borderRadius: "16px",
    overflow: "hidden",
  },
  detailLabel: {
    color: "var(--color-muted)",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    width: { xs: "110px", md: "150px" },
    borderBottom: "1px solid var(--color-border)",
  },
  detailValue: {
    color: "var(--color-text)",
    fontSize: "1rem",
    fontWeight: 600,
    borderBottom: "1px solid var(--color-border)",
  },
  sectionTitle: {
    fontFamily: "var(--font-display)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--color-text)",
  },
  formCard: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "24px",
    padding: { xs: "16px", md: "22px" },
    boxShadow: "0 24px 40px rgba(0,0,0,0.35)",
    maxWidth: "920px",
    margin: "0 auto",
  },
  imageFrame: {
    borderRadius: "22px",
    border: "1px solid var(--color-border)",
    boxShadow: "0 24px 40px rgba(0,0,0,0.35)",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

export default function PeakPerformanceCamp() {
  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.heroShell}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={3}>
            <Grid container size={{ xs: 12, md: 7 }}>
              <Typography sx={classes.heroTitle} variant="h3">
                Peak Performance Camp
              </Typography>
              <Typography sx={classes.heroSubtitle}>
                A focused team experience designed to sharpen performance, elevate technique, and
                bring competition-ready energy. Complete the team intake form to reserve space and
                receive the official schedule.
              </Typography>
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 5 }}
              justifyContent={{ xs: "center", md: "flex-end" }}
            >
              <Box
                component="img"
                src={heroImage.src}
                alt={heroImage.alt}
                sx={{
                  width: "100%",
                  maxWidth: { xs: "280px", sm: "320px", md: "360px" },
                  borderRadius: "20px",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 24px 40px rgba(0,0,0,0.35)",
                  display: "block",
                  margin: { xs: "16px auto 0", md: 0 },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Divider sx={{ borderColor: "var(--color-border)" }} />

      <Box sx={{ backgroundColor: "transparent", padding: { xs: "26px 0", md: "50px 0" } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {galleryImages.map((image) => (
              <Grid key={image.src} container size={{ xs: 12, md: 6 }}>
                <Box component="img" src={image.src} alt={image.alt} sx={classes.imageFrame} />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} alignItems="stretch" sx={{ marginTop: { xs: 3, md: 4 } }}>
            <Grid container size={12}>
              <Box sx={classes.heroCard}>
                <Typography sx={classes.sectionTitle} variant="h5">
                  Team Intake Form
                </Typography>
                <Typography sx={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
                  Coaches and team leaders should complete the form to secure placement and share
                  roster details. Once submitted, you will receive confirmation and next steps.
                </Typography>
                <Table size="small" sx={classes.detailTable}>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={classes.detailLabel}>Dates</TableCell>
                      <TableCell sx={classes.detailValue}>June 12-13, 2026</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={classes.detailLabel}>Time</TableCell>
                      <TableCell sx={classes.detailValue}>TBD</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={classes.detailLabel}>Location</TableCell>
                      <TableCell sx={classes.detailValue}>
                        Sun Devil Fitness Complex
                        <Typography sx={{ color: "var(--color-muted)", fontSize: "0.9rem", fontWeight: 400 }}>
                          400 E Apache Blvd, Tempe, AZ 85281
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ ...classes.detailLabel, borderBottom: "none" }}>Cost</TableCell>
                      <TableCell sx={{ ...classes.detailValue, borderBottom: "none" }}>
                        $345 per athlete (not staying overnight)
                        <Typography sx={{ color: "var(--color-text)", fontSize: "0.95rem", fontWeight: 600 }}>
                          $430 per athlete (2 night stay)
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/peak-performance-camp/#team-intake"
                    sx={{
                      backgroundColor: "var(--color-accent)",
                      borderRadius: "999px",
                      padding: "10px 26px",
                      "&:hover": { backgroundColor: "var(--color-accent-2)" },
                    }}
                  >
                    Open Team Form
                  </Button>
                  <Button
                    variant="outlined"
                    href="/camps/#"
                    sx={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                      borderRadius: "999px",
                      padding: "10px 26px",
                      "&:hover": {
                        borderColor: "var(--color-accent)",
                        backgroundColor: "rgba(215, 38, 56, 0.12)",
                      },
                    }}
                  >
                    View All Camps
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ marginTop: { xs: 3, md: 5 } }}>
            {[
              {
                icon: <SportsGymnasticsIcon sx={{ color: "var(--color-accent)" }} />,
                title: "Performance Refinement",
                body: "Technique clean-up, timing, and routine polish with focused coaching.",
              },
              {
                icon: <AutoGraphIcon sx={{ color: "var(--color-accent)" }} />,
                title: "Team Momentum",
                body: "High-energy sessions that build confidence and competitive consistency.",
              },
              {
                icon: <GroupsIcon sx={{ color: "var(--color-accent)" }} />,
                title: "Program Alignment",
                body: "Share your program goals in the intake form so we can tailor the camp.",
              },
            ].map((item) => (
              <Grid key={item.title} container size={{ xs: 12, md: 4 }}>
                <Box sx={classes.featureCard}>
                  {item.icon}
                  <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "var(--color-muted)", lineHeight: 1.6 }}>
                    {item.body}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ marginTop: { xs: 3, md: 4 } }} id="team-intake">
            <Box sx={classes.formCard}>
              <Typography sx={classes.sectionTitle} variant="h5">
                Complete The Team Intake
              </Typography>
              <Typography sx={{ color: "var(--color-muted)", marginTop: "8px", marginBottom: "18px" }}>
                Use the embedded form below or open it in a new tab. This ensures your team is on
                the list for Peak Performance Camp updates.
              </Typography>
              <Box
                sx={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid var(--color-border)",
                }}
              >
                <iframe
                  src={`${formLink}?embedded=true`}
                  width="100%"
                  height="700"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  title="Peak Performance Camp Team Intake Form"
                ></iframe>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import Footer from "../../Components/Footer";
import { HomeOutlined as HomeOutlinedIcon } from "@mui/icons-material";
import ImageWithSkeleton from "../../Components/ImageWithSkeleton"

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
          backgroundColor: "transparent",
          fontFamily: "var(--font-body)",
          fontSize: "24px",
          color: "var(--color-text)",
          padding: { xs: "30px 0", md: "50px 0" },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "28px",
            padding: { xs: "20px", md: "30px" },
            boxShadow: "0 28px 50px rgba(0,0,0,0.45)",
          }}
        >
          <ImageWithSkeleton
            src={'/images/facility/dauntless_athletics_front_of_building.png'}
            style={{
              width: "100%",
              height: "auto",
              padding: "10px",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            }}
          />
          <Divider sx={{ backgroundColor: "var(--color-border)" }} />
          <Typography sx={{ padding: "20px", color: "var(--color-muted)" }}>
            We are located at 1501 East Baseline Road Bldg 5, Suite #106, Gilbert, AZ 85233.
          </Typography>

          <Divider sx={{ backgroundColor: "var(--color-border)" }} />

          <ImageWithSkeleton
            src={'/images/facility/dauntless_athletics_view_of_whole_gym-scaled.jpeg'}
            style={{
              width: "100%",
              height: "auto",
              padding: "10px",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            }}
          />

          <Divider sx={{ backgroundColor: "var(--color-border)" }} />

          <Typography sx={{ padding: "20px", color: "var(--color-muted)" }}>
            Dauntless Athletics has plenty of space for tumbling, cheer stunts, conditioning, and
            more!
          </Typography>

          <Divider sx={{ backgroundColor: "var(--color-border)" }} />

          <ImageWithSkeleton
            src={'/images/facility/dauntless_athletics_front_view_gym-scaled.jpg'}
            style={{
              width: "calc(50% - 20px)",
              height: "auto",
              padding: "10px",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            }}
          />
          <ImageWithSkeleton
            src={'/images/facility/dauntless_athletics_side_view_gym-scaled.jpeg'}
            style={{
              width: "calc(50% - 20px)",
              height: "auto",
              padding: "10px",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            }}
          />

          <Divider sx={{ backgroundColor: "var(--color-border)" }} />

          <Typography sx={{ padding: "20px", color: "var(--color-muted)" }}>
            Dauntless Athletics has a variety of different equipment that will help your child learn
            that difficult trick.
          </Typography>

          <Divider sx={{ backgroundColor: "var(--color-border)" }} />
        </Container>
      </Box>
      <Footer />
    </>
  );
}

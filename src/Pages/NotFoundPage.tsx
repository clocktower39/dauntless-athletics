import { Link } from "react-router";
import { Button, Grid, Typography } from "@mui/material";
import WebsiteNavbar from "./WebsitePages/WebsiteNavbar";
import Footer from "../Components/Footer";

export default function NotFoundPage() {
  return (
    <>
      <WebsiteNavbar />
      <Grid container sx={{ alignContent: "center", height: "500px" }}>
        {" "}
        {/* make this expand to fill the entire parent container height and center the elements horizontally and vertically */}
        <Grid container size={12} sx={{ alignItems: "center", justifyContent: "center" }}>
          <Typography textAlign="center" variant="h4">
            404: Page Not Found
          </Typography>
        </Grid>
        <Grid container size={12} sx={{ alignItems: "center", justifyContent: "center" }}>
          <Button component={Link} to="/">
            Go Home
          </Button>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

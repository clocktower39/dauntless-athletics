import React, { useState } from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography, Skeleton } from "@mui/material";
import Footer from "../../Components/Footer";

export default function Staff() {
  const staff = [
    {
      displayName: "Anthony “DOM” Damiani",
      positionTitle: "Owner | Head Coach",
      picture: "/images/staff/Anthony-Damiani-Dauntless-Athletics-2021.jpg",
    },
    {
      displayName: "Amy Damiani",
      positionTitle: "Manager",
      picture: "/images/staff/Amy-Damiani-Dauntless-Athletics-2020.jpg",
    },
    {
      displayName: "Gage Pruitt",
      positionTitle: "Director of Operations",
      picture: "/images/staff/Gage-Pruitt-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Dante Labarre",
      positionTitle: "Lead Tumbling Coach",
      picture: "/images/staff/Dante-Labarre-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Brandon Dawa",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Brandon-Dawa-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Oatha Council",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Oatha-Council-Dauntless-Athletics-2022.jpg",
    },
    {
      displayName: "Jon Kearns",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Jon-Kearns-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Leo Borjas",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Carlos Solis",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Carlos-Solis-Dauntless-Athletics-2022.jpg",
    },
    {
      displayName: "Elias Espinosa",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/elias-espinosa-dauntless-athletics-2023.jpg",
    },
    {
      displayName: "Matt Kearns",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Matt-Kearns-Dauntless-Athletics-2022.jpg",
    },
    {
      displayName: "Steven Williams",
      positionTitle: "Tumbling Coach",
      picture: "/images/staff/Steven-Williams-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Emily McKane",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Emily-Mckane-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Andie Turinsky",
      positionTitle: "Front desk & Stunting Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Kylie Perkins",
      positionTitle: "Front desk & Stunting Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Justice Cox",
      positionTitle: "Front desk, Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Avery Evans",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Jordynne del Pinal",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Brock Pugmire",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Abby Brinton",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Bailee Schiff",
      positionTitle: "Stunting Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
        displayName: "Avis Ebron",
        positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Mia Gomez",
      positionTitle: "Stunting Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Reece DeCorte",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Livia Lazovski",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Andrew Christian",
      positionTitle: "Stunting & Tumbling Coach",
      picture: "/images/staff/Pending_Picture.jpg",
    },
    {
      displayName: "Mia Franz",
      positionTitle: "Choreography",
      picture: "/images/staff/Mia-Franz-Dauntless-Athletics-2024.jpg",
    },
  ];

  const StaffMemberCard = ({ employee }) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <Grid container size={{ xs: 6, sm: 4, md: 3, }} justifyContent="center">
        <Box
          sx={
            loaded
              ? {
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }
              : {
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "362px",
                }
          }
        >
          {!loaded && (
            <Skeleton
              variant="rectangular"
              height={577}
              width="100%"
              animation=""
              sx={{
                bgcolor: "grey.900",
              }}
            />
          )}
          {/* Request all image as same size */}
          <img
            src={employee.picture}
            alt="Employee Image"
            style={{
              width: '100%',
              borderRadius: "4px",
              display: loaded ? "block" : "none",
            }}
            onLoad={() => setLoaded(true)}
          />
          <Typography
            sx={{
              position: "absolute",
              bottom: 90,
              left: "50%",
              transform: "translate(-50%, 50%)",
              zIndex: 2,
              textAlign: "center",
              width: "100%",
              fontFamily: "montserrat",
              textTransform: "uppercase",
              color: "#fff",
              fontSize: "19px",
              fontWeight: 600,
            }}
            variant="h4"
          >
            {employee.displayName}
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              bottom: 45,
              left: "50%",
              transform: "translate(-50%, 50%)",
              zIndex: 2,
              textAlign: "center",
              width: "100%",
              fontFamily: "Source Sans Pro",
              color: "#fff",
              fontSize: "16px",
            }}
            variant="h4"
          >
            {employee.positionTitle}
          </Typography>
          <Box
            sx={{
              height: "7em",
              width: "100%",
              backgroundColor: "#FF1B22",
              position: "absolute",
              bottom: 0,
            }}
          />
        </Box>
      </Grid>
    );
  };
  return (
    <>
      <WebsiteNavbar />
      <Box sx={{ backgroundColor: "#000" }}>
        <Typography
          textAlign="center"
          variant="h2"
          sx={{
            color: "#ffffff",
            fontFamily: "montserrat",
            textTransform: "uppercase",
            fontSize: {
              xs: "2em",
              sm: "3em",
              md: "4em",
              lg: "5em",
            },
            padding: {
              xs: "3em 0",
              sm: "1em 0",
            },
          }}
        >
          Meet Our Staff
        </Typography>
        <Container maxWidth="lg" sx={{ padding: "25px 0" }}>
          <Divider sx={{ backgroundColor: "#53c7d6", width: "25%", margin: "auto" }} />
          <Typography
            variant="body1"
            sx={{
              color: "#FFF",
              fontFamily: "source sans pro",
              fontSize: "16px",
              padding: "25px",
            }}
          >
            We are a dedicated, passionate, and experienced coaching staff who will captivate the
            minds of your children and teach them a variety of skills. We bring high energy teaching
            both young men and women skills they thought they could never learn and tune their
            existing skills to a high level. We offer camps, classes, clubs, and private lessons in
            a safe clean environment.
          </Typography>

          <Typography
            sx={{
              fontSize: "36px",
              color: "#FFF",
              fontFamily: "montserrat",
              textTransform: "uppercase",
              padding: "25px",
            }}
          >
            Dauntless Staff
          </Typography>
          <Grid container spacing={3}>
            {staff.map((employee) => (
              <StaffMemberCard key={employee.displayName} employee={employee} />
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

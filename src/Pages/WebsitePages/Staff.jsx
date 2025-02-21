import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
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
      positionTitle: "Front Office Manager",
      picture: "/images/staff/Amy-Damiani-Dauntless-Athletics-2020.jpg",
    },
    {
      displayName: "Gage Pruitt",
      positionTitle: "Director of Operations",
      picture: "/images/staff/Gage-Pruitt-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Annie Ong",
      positionTitle: "Event Coordinator/High School Coach",
      picture: "/images/staff/annie-ong-dauntless-authletics-2023.jpg",
    },
    {
      displayName: "Dante Labarre",
      positionTitle: "Lead Tumbling Coach",
      picture: "/images/staff/Dante-Labarre-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Brandon Dawa",
      positionTitle: "Stunting and Tumbling Coach",
      picture: "/images/staff/Brandon-Dawa-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Oatha Council",
      positionTitle: "Stunting and Tumbling Coach",
      picture: "/images/staff/Oatha-Council-Dauntless-Athletics-2022.jpg",
    },
    {
      displayName: "Adrienne Traynor",
      positionTitle: "Stunting and Tumbling Coach",
      picture: "/images/staff/Adrienne-Traynor-Dauntless-Athletics-2022.jpg",
    },
    {
      displayName: "Elias Espinosa",
      positionTitle: "Tumbling and Stunting Coach",
      picture: "/images/staff/elias-espinosa-dauntless-athletics-2023.jpg",
    },
    {
      displayName: "Carlos Solis",
      positionTitle: "Tumbling and Stunting Coach",
      picture: "/images/staff/Carlos-Solis-Dauntless-Athletics-2022.jpg",
    },
    {
      displayName: "Jon Kearns",
      positionTitle: "Stunting and Tumbling Coach",
      picture: "/images/staff/Jon-Kearns-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Matt Kearns",
      positionTitle: "Stunting and Tumbling Coach",
      picture: "/images/staff/Matt-Kearns-Dauntless-Athletics-2022.jpg",
    },
    {
      displayName: "Steven Williams",
      positionTitle: "Tumbling Coach",
      picture: "/images/staff/Steven-Williams-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Bella Hughes",
      positionTitle: "Tumbling Coach",
      picture: "/images/staff/Bella-Hughes-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Emily McKane",
      positionTitle: "Tumbling and Stunting Coach",
      picture: "/images/staff/Emily-Mckane-Dauntless-Athletics-2024.jpg",
    },
    {
      displayName: "Mia Franz",
      positionTitle: "Choreography",
      picture: "/images/staff/Mia-Franz-Dauntless-Athletics-2024.jpg",
    },
  ];

  const StaffMemberCard = ({ employee }) => {
    return (
      <Grid container item xs={12} md={6} lg={4} justifyContent="center">
        <Box
          sx={{
            position: "relative", // This is crucial for correct positioning
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Request all image as same size */}
          <img src={employee.picture} alt="Employee Image" style={{ minWidth: '100%', maxWidth:'362px', maxHeight: '100%'}} />
          <Typography
            sx={{
              position: "absolute", // Absolutely position within the relative container
              bottom: 90,
              left: "50%", // Center horizontally
              transform: "translate(-50%, 50%)", // Adjust the exact centering
              zIndex: 2, // Ensure it's above the image
              textAlign: "center", // Center the text horizontally
              width: "100%", // Ensure it can be centered properly
              fontFamily: "montserrat",
              textTransform: "uppercase",
              color: '#fff',
              fontSize: '19px',
            }}
            variant="h4"
          >
            {employee.displayName}
          </Typography>
          <Typography
            sx={{
              position: "absolute", // Absolutely position within the relative container
              bottom: 65,
              left: "50%", // Center horizontally
              transform: "translate(-50%, 50%)", // Adjust the exact centering
              zIndex: 2, // Ensure it's above the image
              textAlign: "center", // Center the text horizontally
              width: "100%", // Ensure it can be centered properly
              fontFamily: "Source Sans Pro",
              color: '#fff',
              fontSize: '16px',
            }}
            variant="h4"
          >
            {employee.positionTitle}
          </Typography>
            <Box sx={{ height: '120px', width: '100%', backgroundColor: '#FF1B22', position: 'absolute', bottom: 0,}}/>
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
        <Container maxWidth="lg" sx={{ padding: '25px 0'}}>
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

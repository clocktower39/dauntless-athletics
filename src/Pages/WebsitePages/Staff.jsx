import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import Footer from "../../Components/Footer";
import domPic from "../../assets/Anthony-Damiani-Dauntless-Athletics-2021.jpg";
import amyPic from "../../assets/Amy-Damiani-Dauntless-Athletics-2020.jpg";
import gagePic from "../../assets/Gage-Pruitt-Dauntless-Athletics-2024.jpg";
import anniePic from "../../assets/annie-ong-dauntless-authletics-2023.jpg";
import oathaPic from "../../assets/Oatha-Council-Dauntless-Athletics-2022.jpg";
import adriennePic from "../../assets/Adrienne-Traynor-Dauntless-Athletics-2022.jpg";
import eliasPic from "../../assets/elias-espinosa-dauntless-athletics-2023.jpg";
import carlosPic from "../../assets/Carlos-Solis-Dauntless-Athletics-2022.jpg";
import dantePic from "../../assets/Dante-Labarre-Dauntless-Athletics-2024.jpg";
import jonPic from "../../assets/Jon-Kearns-Dauntless-Athletics-2024.jpg";
import mattPic from "../../assets/Matt-Kearns-Dauntless-Athletics-2022.jpg";
import stevenPic from "../../assets/Steven-Williams-Dauntless-Athletics-2024.jpg";
import brandonPic from "../../assets/Brandon-Dawa-Dauntless-Athletics-2024.jpg";
import bellaPic from "../../assets/Bella-Hughes-Dauntless-Athletics-2024.jpg";
import sadiePic from "../../assets/Sadie-Halliday-Dauntless-Athletics-2024.jpg";
import emilyPic from "../../assets/Emily-Mckane-Dauntless-Athletics-2024.jpg";
import miaPic from "../../assets/Mia-Franz-Dauntless-Athletics-2024.jpg";

export default function Staff() {
  const staff = [
    {
      displayName: "Anthony “DOM” Damiani",
      positionTitle: "Owner | Head Coach",
      picture: domPic,
    },
    {
      displayName: "Amy Damiani",
      positionTitle: "Front Office Manager",
      picture: amyPic,
    },
    {
      displayName: "Gage Pruitt",
      positionTitle: "Director of Operations",
      picture: gagePic,
    },
    {
      displayName: "Annie Ong",
      positionTitle: "Event Coordinator/High School Coach",
      picture: anniePic,
    },
    {
      displayName: "Dante Labarre",
      positionTitle: "Lead Tumbling Coach",
      picture: dantePic,
    },
    {
      displayName: "Brandon Dawa",
      positionTitle: "Stunting and Tumbling Coach",
      picture: brandonPic,
    },
    {
      displayName: "Oatha Council",
      positionTitle: "Stunting and Tumbling Coach",
      picture: oathaPic,
    },
    {
      displayName: "Adrienne Traynor",
      positionTitle: "Stunting and Tumbling Coach",
      picture: adriennePic,
    },
    {
      displayName: "Elias Espinosa",
      positionTitle: "Tumbling and Stunting Coach",
      picture: eliasPic,
    },
    {
      displayName: "Carlos Solis",
      positionTitle: "Tumbling and Stunting Coach",
      picture: carlosPic,
    },
    {
      displayName: "Jon Kearns",
      positionTitle: "Stunting and Tumbling Coach",
      picture: jonPic,
    },
    {
      displayName: "Matt Kearns",
      positionTitle: "Stunting Coach",
      picture: mattPic,
    },
    {
      displayName: "Steven Williams",
      positionTitle: "Tumbling Coach",
      picture: stevenPic,
    },
    {
      displayName: "Bella Hughes",
      positionTitle: "Tumbling Coach",
      picture: bellaPic,
    },
    {
      displayName: "Sadie",
      positionTitle: "Tumbling and Stunting Coach",
      picture: sadiePic,
    },
    {
      displayName: "Emily McKane",
      positionTitle: "Tumbling and Stunting Coach",
      picture: emilyPic,
    },
    {
      displayName: "Mia Franz",
      positionTitle: "Choreography",
      picture: miaPic,
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
              fontSize: "1.5em",
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
              fontSize: "1.5em",
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

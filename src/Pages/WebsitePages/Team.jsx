import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import Footer from "../../Components/Footer";
import domPic from "../../assets/Anthony-Damiani-Dauntless-Athletics-2021.jpg";
import amyPic from "../../assets/Amy-Damiani-Dauntless-Athletics-2020.jpg";
import gagePic from "../../assets/Gage-Pruitt-Dauntless-Athletics-2021.jpg";
import anniePic from "../../assets/annie-ong-dauntless-authletics-2023.jpg";
import oathaPic from "../../assets/Oatha-Council-Dauntless-Athletics-2022.jpg";
import adriennePic from "../../assets/Adrienne-Traynor-Dauntless-Athletics-2022.jpg";
import callaPic from "../../assets/calla-reed-dauntless-athletics-2023.jpg";
import eliasPic from "../../assets/elias-espinosa-dauntless-athletics-2023.jpg";
import carlosPic from "../../assets/Carlos-Solis-Dauntless-Athletics-2022.jpg";
import dantePic from "../../assets/Dante-Labarre-Dauntless-Athletics-2020.jpg";
import jonPic from "../../assets/Matt-Kearns-Dauntless-Athletics-2022.jpg";
import mattPic from "../../assets/Matt-Kearns-Dauntless-Athletics-2022.jpg";

export default function Team() {
  const teamMembers = [
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
      displayName: "Calla Reed",
      positionTitle: "Stunting and Tumbling Coach",
      picture: callaPic,
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
      displayName: "Dante Labarre",
      positionTitle: "Lead Tumbling Coach",
      picture: dantePic,
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
  ];

  const TeamMemberCard = ({ employee }) => {
    return (
      <Grid container item xs={12} md={6} lg={4} justifyContent="center">
        <Box
          sx={{
            position: "relative", // This is crucial for correct positioning
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={employee.picture} alt="Employee Image" style={{ maxWidth: '362px', maxHeight: '400px'}} />
          <Typography
            sx={{
              position: "absolute", // Absolutely position within the relative container
              bottom: 105,
              left: "50%", // Center horizontally
              transform: "translate(-50%, 50%)", // Adjust the exact centering
              zIndex: 2, // Ensure it's above the image
              textAlign: "center", // Center the text horizontally
              width: "100%", // Ensure it can be centered properly
              fontFamily: "montserrat",
              fontSize: "1.5em",
              textTransform: "uppercase",
              maxHeight: "250px",
              color: '#fff',
            }}
            variant="h4"
          >
            {employee.displayName}
          </Typography>
          <Typography
            sx={{
              position: "absolute", // Absolutely position within the relative container
              bottom: 50,
              left: "50%", // Center horizontally
              transform: "translate(-50%, 50%)", // Adjust the exact centering
              zIndex: 2, // Ensure it's above the image
              textAlign: "center", // Center the text horizontally
              width: "100%", // Ensure it can be centered properly
              fontFamily: "montserrat",
              fontSize: "1.5em",
              textTransform: "uppercase",
              maxHeight: "250px",
              color: '#fff',
            }}
            variant="h4"
          >
            {employee.positionTitle}
          </Typography>
            <Box sx={{ height: '120px', width: '100%', backgroundColor: 'red', position: 'absolute', bottom: 0,}}/>
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
          Meet Our Team
        </Typography>
        <Container maxWidth="lg">
          <Divider sx={{ backgroundColor: "#53c7d6", width: "25%", margin: "auto" }} />
          <Typography
            variant="body1"
            sx={{
              color: "rgb(95, 114, 127)",
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
              color: "rgb(95, 114, 127)",
              fontFamily: "montserrat",
              textTransform: "uppercase",
              padding: "25px",
            }}
          >
            Dauntless Team
          </Typography>
          <Grid container spacing={3}>
            {teamMembers.map((employee) => (
              <TeamMemberCard key={employee.displayName} employee={employee} />
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

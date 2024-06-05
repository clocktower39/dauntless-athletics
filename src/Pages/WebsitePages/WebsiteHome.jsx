import React, { useEffect } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { camps, dauntlessClasses, pricingOptions } from "../../states";
import { Box, Button, Container, Divider, Grid, Typography } from "@mui/material";
import WebsiteNavbar from "./WebsiteNavbar";
import ReactPlayer from "react-player";
import CampComponent from "../../Components/CampComponent";
import PricingCard from "../../Components/PricingCard";
import CaptivateMinds from "../../Components/CaptivateMinds";
import Footer from "../../Components/Footer";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import DauntlessAthleticsTumblingCampsImg from '../../assets/Dauntless-Athletics-Tumbling-Camps.jpg';

const classes = {
  MainImgGrid: {
    backgroundColor: "black",
    width: "100%",
  },
  WideMainImg: { width: "100%", height: "auto" },
  NonWideMainImg: { width: "100%", height: "55vh", objectFit: "cover" },
  AboutSite: { padding: "25px 15px" },
  WhyChooseUs: {
    h2: {
      main: {
        fontFamily: "montserrat",
        fontSize: {
          xs: "3em",
          sm: "4.4em",
          lg: "5em",
        },
        padding: "15px 0",
      },
    },
    h4: {
      main: {
        fontFamily: "montserrat",
        textTransform: "uppercase",
        fontWeight: 200,
        fontSize: {
          xs: "1.1em",
          sm: "1.4em",
          md: "1.5em",
          lg: "1.8em",
        },
        padding: "15px 0",
      },
      span: {
        color: "#e7ff89",
        fontFamily: "inherit",
        fontWeight: "300",
      },
    },
  },
};

export default function Home() {
  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <WebsiteNavbar />
      <ReactPlayer
        url="https://youtu.be/PZJ2sG63q3c"
        width="100%"
        height="100vh"
        muted
        loop
        playing
      />
      <Grid>
        <Container maxWidth="false" sx={{ backgroundColor: "black" }}>
          <Container
            maxWidth="lg"
            sx={{
              backgroundColor: "black",
              color: "white",
              padding: "25px 0px",
            }}
          >
            <Grid container>
              <Grid container>
                <Grid container justifyContent="center">
                  <Grid item xs={12}>
                    <Divider sx={{ bgcolor: "white", marginBottom: "1.1em" }} />
                  </Grid>
                  <Typography
                    variant="h4"
                    textAlign="center"
                    sx={{
                      fontFamily: "montserrat",
                      color: "#3c3950",
                      textTransform: "uppercase",
                      paddingBottom: "1.4em",
                    }}
                  >
                    7 Years{" "}
                    <Typography variant="span" sx={{ fontFamily: "Montserrat", fontWeight: 200 }}>
                      Going Strong
                    </Typography>
                  </Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ color: "rgb(95, 114, 127)", fontFamily: "Source Sans Pro" }}>
                    As we approach 7 years of being open we would like to take the time to thank
                    each and everyone of you for being a part of our journey the last 7 years! We
                    appreciate all the love and support you have shown us these past years.
                  </Typography>
                  <br />

                  <Typography sx={{ color: "rgb(95, 114, 127)", fontFamily: "Source Sans Pro" }}>
                    While we have had time to reflect on the last 7 years, we have decided to make
                    some changes at Dauntless. We are very excited to welcome back Coach Dante as of
                    Monday, March 6th! Coach Dante has been a part of Dauntless from the start and
                    we are excited to see him back in the gym! In the next few weeks you will notice
                    some changes in our tumbling classes, we are getting back to the roots of what
                    Dauntless was when we began and you will be seeing more hands on coaching during
                    class time!
                  </Typography>
                  <br />

                  <Typography sx={{ color: "rgb(95, 114, 127)", fontFamily: "source sans pro" }}>
                    We are excited for the journey of year 7 and can’t wait to see the improvements
                    and goals being achieved by every athlete here!
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid container justifyContent="center">
                  <Grid item xs={12}>
                    <Divider sx={{ bgcolor: "white", margin: "1.1em 0" }} />
                  </Grid>
                  <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{ fontFamily: "Montserrat", color: "#3c3950", textTransform: "uppercase" }}
                  >
                    Upcoming{" "}
                    <Typography variant="span" sx={{ fontFamily: "Montserrat", fontWeight: 200 }}>
                      Camps
                    </Typography>
                  </Typography>
                </Grid>
                <Grid container justifyContent="center" sx={{ paddingBottom: "3em" }}>
                  <Typography
                    sx={{
                      color: "rgb(95, 114, 127)",
                      fontFamily: "source sans pro",
                      padding: "3em 0 1.5em 0",
                    }}
                  >
                    * All Camps have Limited Availability
                  </Typography>
                </Grid>
                <Grid container justifyContent="center" sx={{ paddingBottom: "3em" }}>
                  <Link to="/camps/#">
                    <img
                      src={DauntlessAthleticsTumblingCampsImg}
                      height="auto"
                      style={{ maxWidth: "100%" }}
                    />
                  </Link>
                </Grid>
                <Grid container justifyContent="center">
                  {camps.map((camp, index) => (
                    <CampComponent key={`${camp.title}-${index}`} camp={camp} index={index} />
                  ))}
                </Grid>
              </Grid>

              <Grid container id="dauntless-classes-section">
                <Grid container justifyContent="center">
                  <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{
                      fontFamily: "Montserrat",
                      textTransform: "uppercase",
                      padding: "200px 0 50px 0",
                    }}
                  >
                    Our{" "}
                    <Typography variant="span" sx={{ fontFamily: "Montserrat", fontWeight: 200 }}>
                      Classes
                    </Typography>
                  </Typography>
                </Grid>
                <Grid container justifyContent="center">
                  <Typography textAlign="center">
                    We will captivate the minds of your children and teach them skills they thought
                    they could never learn!
                  </Typography>
                </Grid>

                <Grid container justifyContent="center">
                  {dauntlessClasses.map((c, index) => (
                    <Grid
                      key={`${c.title}-${index}`}
                      container
                      item
                      xs={12}
                      sm={6}
                      sx={{ padding: "75px 0px" }}
                    >
                      <Grid container item xs={9} sm={8}>
                        <Typography
                          variant="h5"
                          sx={{ color: "#3c3950", textTransform: "uppercase", padding: "15px 0" }}
                        >
                          {c.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#5f727f", padding: "15px 0px" }}>
                          {c.description}
                        </Typography>
                      </Grid>
                      <Grid container item xs={3} sm={4} alignItems="flex-start">
                        {c?.icon}
                      </Grid>
                    </Grid>
                  ))}
                  <Grid container item xs={12} sm={6} sx={{ padding: "75px 0px" }}>
                    <Grid item xs={9} sm={8}>
                      <Typography
                        variant="h5"
                        sx={{ color: "#3c3950", textTransform: "uppercase", padding: "15px 0" }}
                      >
                        Cheer Prep Class
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#5f727f", padding: "15px 0px" }}>
                        Motions, jumps, stunts, and tumbling for ages 4 and up. See the class
                        schedule for more details.
                      </Typography>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "#5f727f" }}>
                          *Classes start in March.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: "#5f727f" }}>
                          **Must wear tennis shoes.
                        </Typography>
                      </Box>
                      <Box sx={{ margin: "20% 0" }}>
                        <Button variant="contained" component={Link} to="https://app.iclasspro.com/portal/dauntlessathletics/classes" sx={{ backgroundColor: 'rgb(60, 57, 80)', '&:hover': { backgroundColor: 'rgb(244, 67, 54)', }}}>Sign Up</Button>
                      </Box>
                    </Grid>
                    <Grid container item xs={3} sm={4} alignItems="flex-start">
                      <CheckCircleIcon
                        sx={{
                          fontSize: { xs: "4em", md: "6em" },
                          padding: "15px",
                          color: "rgb(255, 199, 118)",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} sm={6} sx={{ padding: "75px 0px" }}>
                    <Grid item xs={9} sm={8}>
                      <Typography
                        variant="h5"
                        sx={{ color: "#3c3950", textTransform: "none", padding: "15px 0" }}
                      >
                        Junior high and high school try out prep class
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#5f727f", padding: "15px 0px" }}>
                        This class is for any athletes ages 11-19 looking to prepare for junior high
                        and high school cheer tryouts! See the class schedule for more details.
                      </Typography>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "#5f727f" }}>
                          *Starting Tuesday March 5th 6-8pm
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: "#5f727f" }}>
                          *The class begins March 5th and ends May 28th, 2024.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: "#5f727f" }}>
                          {" "}
                          *$130 a month.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: "#5f727f" }}>
                          **Must wear tennis shoes.
                        </Typography>
                      </Box>
                      <Box sx={{ margin: "20% 0" }}>
                        <Button variant="contained" component={Link} to="https://app.iclasspro.com/portal/dauntlessathletics/classes" sx={{ backgroundColor: 'rgb(60, 57, 80)', '&:hover': { backgroundColor: 'rgb(244, 67, 54)', }}}>Sign Up</Button>
                      </Box>
                    </Grid>
                    <Grid container item xs={3} sm={4} alignItems="flex-start">
                      <CheckCircleIcon
                        sx={{
                          fontSize: { xs: "4em", md: "6em" },
                          padding: "15px",
                          color: "rgb(255, 199, 118)",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container justifyContent="center">
                  <ReactPlayer url="https://youtu.be/Oiz0gypDSRI" controls />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <Divider sx={{ bgcolor: "white", margin: "1.1em 0" }} />
                </Grid>
                <Grid container justifyContent="center" sx={{ margin: "75px" }}>
                  <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{ fontFamily: "Montserrat", color: "#3c3950", textTransform: "uppercase" }}
                  >
                    Why{" "}
                    <Typography variant="span" sx={{ fontFamily: "Montserrat", fontWeight: 200 }}>
                      Choose Us
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid
                  container
                  xs={12}
                  md={4}
                  sx={{ backgroundColor: "rgb(174, 213, 129)", padding: "50px" }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    01.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    Dedicated and Experienced{" "}
                    <Typography variant="span" sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Coaches And Staff
                    </Typography>
                  </Typography>
                </Grid>
                <Grid
                  container
                  xs={12}
                  md={4}
                  sx={{ backgroundColor: "rgb(0, 188, 212)", padding: "50px" }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    02.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    Our{" "}
                    <Typography variant="span" sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Phenomenally{" "}
                    </Typography>
                    Amazing{" "}
                    <Typography variant="span" sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Tumbling Programs
                    </Typography>
                  </Typography>
                </Grid>
                <Grid
                  container
                  xs={12}
                  md={4}
                  sx={{ backgroundColor: "rgb(55, 57, 76)", padding: "50px" }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    03.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    <Typography variant="span" sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Cheer Prep Classes!{" "}
                    </Typography>
                    For ages 4 and up{" "}
                    <Typography variant="span" sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Motions, Jumps, Stunts, Tumble
                    </Typography>
                  </Typography>
                </Grid>
                <Grid
                  container
                  xs={12}
                  sx={{ backgroundColor: "rgb(167, 130, 230)", padding: "50px" }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    04.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    Amazing Stunt Programs for{" "}
                    <Typography variant="span" sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Flyers and Bases{" "}
                    </Typography>
                    taught by ex-college and worlds cheerleader athletes
                  </Typography>
                </Grid>
                <Grid
                  container
                  xs={12}
                  sx={{ backgroundColor: "rgb(0, 219, 255)", padding: "50px" }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    05.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    High School{" "}
                    <Typography variant="span" sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Onsite Tumbling Coaching{" "}
                    </Typography>
                    taught by ex-gymnasts, college and worlds cheerleaders
                  </Typography>
                </Grid>
              </Grid>
              <Grid container id="tuition-section" sx={{ paddingTop: "200px" }}>
                <Grid container justifyContent="center">
                  <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{
                      fontFamily: "Montserrat",
                      textTransform: "uppercase",
                      padding: "75px 0",
                    }}
                  >
                    TUITION{" "}
                    <Typography variant="span" sx={{ fontFamily: "Montserrat", fontWeight: 200 }}>
                      RATES
                    </Typography>
                  </Typography>
                </Grid>
                <Grid container justifyContent="center">
                  <Grid container item xs={12} justifyContent="center">
                    <Typography
                      textAlign="center"
                      variant="caption"
                      sx={{
                        fontFamily: "Montserrat",
                        textTransform: "uppercase",
                        paddingBottom: "75px",
                      }}
                    >
                      * Sibling Discount: You receive 20% off for the 2nd child and 30% off for the
                      3rd child or more.
                    </Typography>
                  </Grid>

                  <Grid container justifyContent="center" alignItems="stretch" spacing={2}>
                    {pricingOptions.map((option) => (
                      <Grid
                        key={option.title}
                        container
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        justifyContent="center"
                      >
                        <PricingCard
                          title={option.title}
                          cost={option.cost}
                          duration={option.duration}
                          buttonText={option.buttonText}
                          buttonLink={option.buttonLink}
                          backgroundColor={option.backgroundColor}
                          optionalTextList={option.optionalTextList}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Container>
        <CaptivateMinds />
        <Footer />
      </Grid>
    </>
  );
}

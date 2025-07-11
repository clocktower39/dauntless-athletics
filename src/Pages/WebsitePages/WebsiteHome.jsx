import React, { useEffect, useRef } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { camps, dauntlessClasses, pricingOptions } from "../../states";
import { Box, Button, Container, Divider, Grid, Typography } from "@mui/material";
import {
  Email as EmailIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import WebsiteNavbar from "./WebsiteNavbar";
import ReactPlayer from "react-player";
import CampComponent from "../../Components/CampComponent";
import PricingCard from "../../Components/PricingCard";
import CaptivateMinds from "../../Components/CaptivateMinds";
import Footer from "../../Components/Footer";
import DauntlessAthleticsTumblingCampsImg from "../../assets/Dauntless-Athletics-Tumbling-Camps.jpg";
import useHashOnView from "../../Hooks/useHashOnView";

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
        color: "#ff0000",
        fontFamily: "inherit",
        fontWeight: "300",
      },
    },
  },
};

export default function Home() {
  const homeRef = useHashOnView("home");
  const classesRef = useHashOnView("dauntless-classes-section");
  const tuitionRef = useHashOnView("#tuition-section");

  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <WebsiteNavbar />
      <ReactPlayer
        src="https://youtu.be/PZJ2sG63q3c"
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
            <Grid container justifyContent="center">
              <Grid size={12}>
                <Divider sx={{ bgcolor: "white", marginBottom: "1.1em" }} />
              </Grid>
              <Typography
                id="home"
                ref={homeRef}
                variant="h4"
                textAlign="center"
                sx={{
                  fontFamily: "montserrat",
                  textTransform: "uppercase",
                  paddingBottom: "1.4em",
                }}
              >
                9 Years{" "}
                <Typography variant="span" sx={{ fontFamily: "Montserrat", fontWeight: 200 }}>
                  Going Strong
                </Typography>
              </Typography>

              <Grid container justifyContent="center" size={12} spacing={2}>
                <Grid container justifyContent="center" size={{ xs: 12, md: 6 }} spacing={4}>
                  <Grid size={12} sx={{ fontFamily: "source sans pro" }}>
                    <Grid>
                      <Typography sx={{ fontFamily: "Source Sans Pro" }}>
                        As we approach 9 years of being open we would like to take the time to thank
                        each and everyone of you for being a part of our journey the last 9 years!
                        We appreciate all the love and support you have shown us these past years.
                      </Typography>
                      <br />

                      <Typography sx={{ fontFamily: "source sans pro" }}>
                        We are excited for the journey of year 9 and can’t wait to see the
                        improvements and goals being achieved by every athlete here!
                      </Typography>
                    </Grid>
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: "inherit", fontSize: "16px" }}
                    ></Typography>
                  </Grid>
                  <Grid container size={12} direction="column" sx={{ fontFamily: "source sans pro", padding: '20px 0', }} spacing={2} >
                    {/* Phone Number */}
                    <Grid>
                      <Typography variant="body1" sx={{ fontFamily: "inherit", fontSize: "16px" }}>
                        <a
                          href="tel:+14802143908"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <PhoneIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
                          Phone: (480) 214-3908
                        </a>
                      </Typography>
                    </Grid>

                    {/* Email Address */}
                    <Grid>
                      <Typography variant="body1" sx={{ fontFamily: "inherit", fontSize: "16px" }}>
                        <a
                          href="mailto:info@dauntlessathletics.com"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <EmailIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
                          Email: info@dauntlessathletics.com
                        </a>
                      </Typography>
                    </Grid>

                    {/* Business Address */}
                    <Grid>
                      <Typography variant="body1" sx={{ fontFamily: "inherit", fontSize: "16px" }}>
                        <LocationOnOutlinedIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
                        Address: 1501 E. Baseline Rd., Building 5, Suite 106, Gilbert, AZ 85233
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container justifyContent="center" size={{ xs: 12, md: 6 }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3331.796753358821!2d-111.80131568449212!3d33.376371860489485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872ba8fa94329e07%3A0xf92b7042f9fabc0d!2sDauntless%20Athletics!5e0!3m2!1sen!2sus!4v1607308532613!5m2!1sen!2sus"
                    width="100%"
                    height="450"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                  ></iframe>
                </Grid>
              </Grid>

              <Grid container>
                <Grid container justifyContent="center" size={12}>
                  <Grid size={12}>
                    <Divider sx={{ bgcolor: "white", margin: "1.1em 0" }} />
                  </Grid>
                  <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{ fontFamily: "Montserrat", textTransform: "uppercase" }}
                  >
                    Upcoming{" "}
                    <Typography variant="span" sx={{ fontFamily: "Montserrat", fontWeight: 200 }}>
                      Camps
                    </Typography>
                  </Typography>
                </Grid>
                <Grid container size={12} justifyContent="center" sx={{ paddingBottom: "3em" }}>
                  <Typography
                    sx={{
                      fontFamily: "source sans pro",
                      padding: "3em 0 1.5em 0",
                    }}
                  >
                    * All Camps have Limited Availability
                  </Typography>
                </Grid>
                <Grid container size={12} justifyContent="center" sx={{ paddingBottom: "3em" }}>
                  <Link to="/camps/#">
                    <img
                      alt="Dauntless Athletics Tumbling Camp Banner"
                      src={DauntlessAthleticsTumblingCampsImg}
                      height="auto"
                      style={{ maxWidth: "100%" }}
                    />
                  </Link>
                </Grid>
                <Grid container size={12} justifyContent="center">
                  {camps.map((camp, index) => (
                    <CampComponent key={`${camp.title}-${index}`} camp={camp} index={index} />
                  ))}
                </Grid>
              </Grid>

              <Grid container>
                <Grid container size={12} justifyContent="center">
                  <Box id="dauntless-classes-section" ref={classesRef}>
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
                  </Box>
                </Grid>
                <Grid container size={12} justifyContent="center">
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
                      size={{ xs: 12, sm: 6 }}
                      sx={{ padding: "75px 0px" }}
                    >
                      <Grid container size={{ xs: 9, sm: 8 }}>
                        <Typography
                          variant="h5"
                          sx={{ textTransform: "uppercase", padding: "15px 0" }}
                        >
                          {c.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#A0A0A0", padding: "15px 0px" }}>
                          {c.description}
                        </Typography>
                      </Grid>
                      <Grid container size={{ xs: 3, sm: 4 }} alignItems="flex-start">
                        {c?.icon}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
                <Grid container size={12} justifyContent="center">
                  <ReactPlayer
                    src="https://youtu.be/Q6D9xUJm7jI"
                    width="100%"
                    height="80vh"
                    muted
                    loop
                    playing
                  />
                </Grid>
              </Grid>

              <Grid container size={12}>
                <Grid size={12}>
                  <Divider sx={{ bgcolor: "white", margin: "1.1em 0" }} />
                </Grid>
                <Grid container size={12} justifyContent="center" sx={{ margin: "75px" }}>
                  <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{ fontFamily: "Montserrat", textTransform: "uppercase" }}
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
                  size={{ xs: 12, md: 4 }}
                  sx={{ backgroundColor: "#707070", padding: "50px" }}
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
                  size={{ xs: 12, md: 4 }}
                  sx={{ backgroundColor: "#3a3a3a", padding: "50px" }}
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
                  size={{ xs: 12, md: 4 }}
                  sx={{ backgroundColor: "#161A1D", padding: "50px" }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    03.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    <Typography variant="span" sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Stretch & Strength Training Programs!{" "}
                    </Typography>
                    Building a foundation for your skills{" "}
                  </Typography>
                </Grid>
                <Grid
                  container
                  size={{ xs: 12 }}
                  sx={{ backgroundColor: "#0B090A", padding: "50px" }}
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
                <Grid container size={12} sx={{ backgroundColor: "0D0509", padding: "50px" }}>
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
              <Grid container>
                <Grid container size={12} justifyContent="center">
                  <Box id="tuition-section" ref={tuitionRef}>
                    <Typography
                      variant="h3"
                      textAlign="center"
                      sx={{
                        fontFamily: "Montserrat",
                        textTransform: "uppercase",
                        padding: "200px 0 50px 0",
                      }}
                    >
                      TUITION{" "}
                      <Typography variant="span" sx={{ fontFamily: "Montserrat", fontWeight: 200 }}>
                        RATES
                      </Typography>
                    </Typography>
                  </Box>
                </Grid>
                <Grid container justifyContent="center">
                  <Grid container size={12} justifyContent="center">
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
                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
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

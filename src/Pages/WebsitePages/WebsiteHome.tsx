import React, { useEffect, useRef } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { camps, dauntlessClasses, pricingOptions } from "../../states";
import { Box, Button, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import {
  Email as EmailIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
  Phone as PhoneIcon,
  SportsGymnasticsOutlined as SportsGymnasticsOutlinedIcon,
  EmojiEventsOutlined as EmojiEventsOutlinedIcon,
  FitnessCenterOutlined as FitnessCenterOutlinedIcon,
  SyncAltOutlined as SyncAltOutlinedIcon,
  GroupsOutlined as GroupsOutlinedIcon,
  AccessTimeOutlined as AccessTimeOutlinedIcon,
  SchoolOutlined as SchoolOutlinedIcon,
} from "@mui/icons-material";
import WebsiteNavbar from "./WebsiteNavbar";
import ReactPlayer from "../../Components/YouTubeOnlyPlayer";
import CampComponent from "../../Components/CampComponent";
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
        fontFamily: "var(--font-display)",
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
        fontFamily: "var(--font-display)",
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
        color: "var(--color-accent)",
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

  const classIconMap: Record<string, React.ReactNode> = {
    Tumbling: <SportsGymnasticsOutlinedIcon sx={{ fontSize: "26px", color: "var(--color-accent)" }} />,
    "Tumbling Camp": <EmojiEventsOutlinedIcon sx={{ fontSize: "26px", color: "var(--color-accent)" }} />,
    "Strength, Conditioning & Flexibility": (
      <FitnessCenterOutlinedIcon sx={{ fontSize: "26px", color: "var(--color-accent)" }} />
    ),
    Twisting: <SyncAltOutlinedIcon sx={{ fontSize: "26px", color: "var(--color-accent)" }} />,
    Stunting: <GroupsOutlinedIcon sx={{ fontSize: "26px", color: "var(--color-accent)" }} />,
    "Open Gym": <AccessTimeOutlinedIcon sx={{ fontSize: "26px", color: "var(--color-accent)" }} />,
    "High School Onsite Training": (
      <SchoolOutlinedIcon sx={{ fontSize: "26px", color: "var(--color-accent)" }} />
    ),
  };

  const monthlyRates = pricingOptions.filter((option) => option.duration === "Per Month");
  const otherRates = pricingOptions.filter((option) => option.duration !== "Per Month");

  return (
    <>
      <WebsiteNavbar />
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "70vh", md: "85vh" },
          overflow: "hidden",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <ReactPlayer
          src="https://youtu.be/PZJ2sG63q3c"
          width="100%"
          height="100%"
          muted
          loop
          playing
          style={{ position: "absolute", inset: 0 }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(11, 13, 16, 0.78)",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 10, md: 16 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h2"
                className="fade-up"
                sx={{
                  textTransform: "uppercase",
                  fontSize: { xs: "3rem", md: "4.8rem" },
                  lineHeight: 0.95,
                }}
              >
                Dauntless Athletics
              </Typography>
              <Typography
                className="fade-up"
                sx={{
                  mt: 2,
                  maxWidth: "520px",
                  color: "var(--color-muted)",
                  fontSize: { xs: "1rem", md: "1.15rem" },
                }}
              >
                Elite tumbling, cheer, and strength training built for athletes who want to grow
                with confidence.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4 }}
                className="fade-up"
              >
                <Button
                  variant="contained"
                  component={Link}
                  to="/class-schedule/#"
                  sx={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-text)",
                    px: 3,
                    py: 1.2,
                    borderRadius: "999px",
                    boxShadow: "0 18px 30px rgba(215, 38, 56, 0.35)",
                    "&:hover": {
                      backgroundColor: "var(--color-accent-2)",
                    },
                  }}
                >
                  View Schedule
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="https://portal.iclasspro.com/dauntlessathletics/create-account-01-verify-email"
                  sx={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-border)",
                    px: 3,
                    py: 1.2,
                    borderRadius: "999px",
                    "&:hover": {
                      borderColor: "var(--color-accent)",
                      backgroundColor: "rgba(215, 38, 56, 0.12)",
                    },
                  }}
                >
                  Create Account
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                className="fade-up"
                sx={{
                  backgroundColor: "rgba(18, 19, 26, 0.78)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "24px",
                  p: 3,
                  boxShadow: "0 24px 40px rgba(0, 0, 0, 0.4)",
                }}
              >
                <Typography variant="h5" sx={{ textTransform: "uppercase" }}>
                  Welcome to Dauntless
                </Typography>
                <Typography sx={{ mt: 1, color: "var(--color-muted)" }}>
                  We appreciate the love and support you have shown us these past years and are
                  excited for year 9.
                </Typography>
                <Stack spacing={1.2} sx={{ mt: 2, color: "var(--color-text)" }}>
                  <Typography sx={{ fontSize: "0.95rem" }}>
                    <PhoneIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                    (480) 214-3908
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem" }}>
                    <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                    info@dauntlessathletics.com
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem" }}>
                    <LocationOnOutlinedIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                    Gilbert, AZ
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Grid>
        <Container maxWidth={false} sx={{ backgroundColor: "transparent", py: { xs: 4, md: 6 } }}>
          <Container
            maxWidth="lg"
            sx={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: "32px",
              padding: { xs: "24px", md: "40px" },
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.35)",
            }}
          >
            <Grid container justifyContent="center">
              <Typography
                id="home"
                ref={homeRef}
                variant="h4"
                textAlign="center"
                sx={{
                  textTransform: "uppercase",
                  paddingBottom: "1.4em",
                }}
              >
                9 Years{" "}
                <Typography variant="inherit" component="span"  sx={{ fontFamily: "var(--font-display)", fontWeight: 200 }}>
                  Going Strong
                </Typography>
              </Typography>

              <Grid container justifyContent="center" size={12} spacing={2}>
                <Grid container justifyContent="center" size={{ xs: 12, md: 6 }} spacing={4}>
                  <Grid size={12}>
                    <Grid>
                      <Typography sx={{ color: "var(--color-muted)" }}>
                        As we approach 9 years of being open we would like to take the time to thank
                        each and everyone of you for being a part of our journey the last 9 years!
                        We appreciate all the love and support you have shown us these past years.
                      </Typography>
                      <br />

                      <Typography sx={{ color: "var(--color-muted)" }}>
                        We are excited for the journey of year 9 and can’t wait to see the
                        improvements and goals being achieved by every athlete here!
                      </Typography>
                    </Grid>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "16px" }}
                    ></Typography>
                  </Grid>
                  <Grid container size={12} direction="column" sx={{ padding: "20px 0" }} spacing={2}>
                    {/* Phone Number */}
                    <Grid>
                      <Typography variant="body1" sx={{ fontSize: "16px" }}>
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
                      <Typography variant="body1" sx={{ fontSize: "16px" }}>
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
                      <Typography variant="body1" sx={{ fontSize: "16px" }}>
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
                    style={{ border: 0, borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                    allowFullScreen={false}
                    aria-hidden="false"
                  ></iframe>
                </Grid>
              </Grid>

              <Grid container>
                <Grid container justifyContent="center" size={12}>
                  <Grid size={12}>
                    <Divider sx={{ bgcolor: "var(--color-border)", margin: "1.1em 0" }} />
                  </Grid>
                  <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{ textTransform: "uppercase" }}
                  >
                    Upcoming{" "}
                    <Typography variant="inherit" component="span"  sx={{ fontFamily: "var(--font-display)", fontWeight: 200 }}>
                      Camps
                    </Typography>
                  </Typography>
                </Grid>
                <Grid container size={12} justifyContent="center" sx={{ paddingBottom: "3em" }}>
                  <Typography
                    sx={{
                      color: "var(--color-muted)",
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
                <Grid container size={12} justifyContent="center" spacing={{ xs: 3, md: 4 }}>
                  {camps.map((camp, index) => (
                    <CampComponent key={`${camp.Subject}-${index}`} camp={camp} index={index} />
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
                        textTransform: "uppercase",
                        padding: "200px 0 50px 0",
                      }}
                    >
                      Our{" "}
                      <Typography variant="inherit" component="span"  sx={{ fontFamily: "var(--font-display)", fontWeight: 200 }}>
                        Classes
                      </Typography>
                    </Typography>
                  </Box>
                </Grid>
                <Grid container size={12} justifyContent="center">
                  <Typography textAlign="center" sx={{ color: "var(--color-muted)", maxWidth: "720px" }}>
                    Programs designed for every level, with focused coaching that builds confidence
                    and clean technique.
                  </Typography>
                </Grid>

                <Grid container spacing={3} sx={{ margin: "25px 0" }}>
                  {dauntlessClasses.map((c, index) => (
                    <Grid key={`${c.title}-${index}`} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box
                        sx={{
                          backgroundColor: "var(--color-surface-2)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "20px",
                          padding: "24px",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          boxShadow: "0 18px 35px rgba(0,0,0,0.35)",
                        }}
                      >
                        <Box
                          sx={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "14px",
                            backgroundColor: "rgba(215, 38, 56, 0.12)",
                            border: "1px solid rgba(215, 38, 56, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {classIconMap[c.title] || (
                            <SportsGymnasticsOutlinedIcon
                              sx={{ fontSize: "26px", color: "var(--color-accent)" }}
                            />
                          )}
                        </Box>
                        <Typography variant="h5" sx={{ textTransform: "uppercase" }}>
                          {c.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "var(--color-muted)" }}>
                          {c.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Grid container size={12} justifyContent="center">
                  <Box
                    sx={{
                      width: "100%",
                      borderRadius: "24px",
                      overflow: "hidden",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 30px 50px rgba(0, 0, 0, 0.45)",
                    }}
                  >
                    <ReactPlayer
                      src="https://youtu.be/Q6D9xUJm7jI"
                      width="100%"
                      height="80vh"
                      muted
                      loop
                      playing
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container size={12}>
                <Grid size={12}>
                  <Divider sx={{ bgcolor: "var(--color-border)", margin: "1.1em 0" }} />
                </Grid>
                <Grid container size={12} justifyContent="center" sx={{ margin: "75px" }}>
                  <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{ textTransform: "uppercase" }}
                  >
                    Why{" "}
                    <Typography variant="inherit" component="span"  sx={{ fontFamily: "var(--font-display)", fontWeight: 200 }}>
                      Choose Us
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid
                  container
                  size={{ xs: 12, md: 4 }}
                  sx={{
                    backgroundColor: "var(--color-surface-2)",
                    padding: "50px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    01.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    Dedicated and Experienced{" "}
                    <Typography variant="inherit" component="span"  sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Coaches And Staff
                    </Typography>
                  </Typography>
                </Grid>
                <Grid
                  container
                  size={{ xs: 12, md: 4 }}
                  sx={{
                    backgroundColor: "var(--color-surface-3)",
                    padding: "50px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    02.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    Our{" "}
                    <Typography variant="inherit" component="span"  sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Phenomenally{" "}
                    </Typography>
                    Amazing{" "}
                    <Typography variant="inherit" component="span"  sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Tumbling Programs
                    </Typography>
                  </Typography>
                </Grid>
                <Grid
                  container
                  size={{ xs: 12, md: 4 }}
                  sx={{
                    backgroundColor: "var(--color-surface)",
                    padding: "50px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    03.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    <Typography variant="inherit" component="span"  sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Stretch & Strength Training Programs!{" "}
                    </Typography>
                    Building a foundation for your skills{" "}
                  </Typography>
                </Grid>
                <Grid
                  container
                  size={{ xs: 12 }}
                  sx={{
                    backgroundColor: "var(--color-surface-2)",
                    padding: "50px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    04.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    Amazing Stunt Programs for{" "}
                    <Typography variant="inherit" component="span"  sx={{ ...classes.WhyChooseUs.h4.span }}>
                      Flyers and Bases{" "}
                    </Typography>
                    taught by ex-college and worlds cheerleader athletes
                  </Typography>
                </Grid>
                <Grid
                  container
                  size={12}
                  sx={{
                    backgroundColor: "var(--color-surface-3)",
                    padding: "50px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Typography variant="h2" sx={{ ...classes.WhyChooseUs.h2.main }}>
                    05.
                  </Typography>
                  <Typography variant="h4" sx={{ ...classes.WhyChooseUs.h4.main }}>
                    High School{" "}
                    <Typography variant="inherit" component="span"  sx={{ ...classes.WhyChooseUs.h4.span }}>
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
                        textTransform: "uppercase",
                        padding: "200px 0 50px 0",
                      }}
                    >
                      TUITION{" "}
                      <Typography variant="inherit" component="span"  sx={{ fontFamily: "var(--font-display)", fontWeight: 200 }}>
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
                        textTransform: "uppercase",
                        color: "var(--color-muted)",
                        paddingBottom: "75px",
                      }}
                    >
                      * Sibling Discount: You receive 20% off for the 2nd child and 30% off for the
                      3rd child or more.
                    </Typography>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, }}>
                      <Box
                        sx={{
                          backgroundColor: "var(--color-surface-2)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "24px",
                          padding: { xs: "20px", md: "28px" },
                          boxShadow: "0 22px 40px rgba(0,0,0,0.35)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "18px",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "var(--color-muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Hours per week
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "var(--color-muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Monthly rate
                          </Typography>
                        </Box>
                        {monthlyRates.map((option, index) => (
                          <Box key={option.title}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 0",
                              }}
                            >
                              <Typography sx={{ textTransform: "uppercase" }}>
                                {option.title}
                              </Typography>
                              <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                                {option.cost}
                              </Typography>
                            </Box>
                            {index !== monthlyRates.length - 1 && (
                              <Divider sx={{ borderColor: "var(--color-border)" }} />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                    {otherRates.map((option) => {
                      const optionalTextList = option.optionalTextList ?? [];
                      return (
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                          key={option.title}
                          sx={{
                            backgroundColor: "var(--color-surface-2)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "20px",
                            padding: "20px",
                            boxShadow: "0 18px 35px rgba(0,0,0,0.35)",
                          }}
                        >
                          <Typography variant="h5" sx={{ textTransform: "uppercase" }}>
                            {option.title}
                          </Typography>
                          <Typography sx={{ fontSize: "1.6rem", fontWeight: 600 }}>
                            {option.cost}
                          </Typography>
                          <Typography sx={{ color: "var(--color-muted)", paddingBottom: "10px" }}>
                            {option.duration}
                          </Typography>
                          {optionalTextList.length > 0 && (
                            <Box
                              component="ul"
                              sx={{ margin: 0, paddingLeft: "18px", color: "var(--color-muted)" }}
                            >
                              {optionalTextList.map((text) => (
                                <li key={text}>{text}</li>
                              ))}
                            </Box>
                          )}
                          <Button
                            variant="contained"
                            sx={{
                              marginTop: "16px",
                              backgroundColor: "var(--color-accent)",
                              borderRadius: "999px",
                              padding: "8px 20px",
                              "&:hover": {
                                backgroundColor: "var(--color-accent-2)",
                              },
                            }}
                            href={option.buttonLink}
                          >
                            {option.buttonText}
                          </Button>
                        </Box>
                      </Grid>
                      );
                    })}
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

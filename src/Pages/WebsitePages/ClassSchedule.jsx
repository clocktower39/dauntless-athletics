import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import ClassScheduleBannerImg from "../../assets/ClassScheduleBannerImg.jpg";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import Footer from "../../Components/Footer";

const classes = {
  mainImgBox: {
    backgroundImage: `url(${ClassScheduleBannerImg})`,
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    backgroundPositionY: "top",
    backgroundSize: "cover",
    padding: "7.5px",
  },
  overlayText: {
    color: "#3c3950", // Text color
    width: "100%", // Ensure it can be centered properly
    fontFamily: "montserrat",
    fontSize: "3em",
    textTransform: "uppercase",
  },
};

const schedule = [
  {
    day: "Monday",
    activities: [
      {
        activity: "Flexibility",
        time: "4:00-5:00 PM",
      },
      {
        activity: "Cheer Prep Class (age 6+)",
        time: "4:00-5:00 PM",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "5:00-6:00 PM",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "6:00-7:00 PM",
      },
      {
        activity: "Open Gym (*High School & College)",
        time: "8:30-10:30 PM",
      },
    ],
  },
  {
    day: "Tuesday",
    activities: [
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "4:00-5:00 PM",
      },
      {
        activity: "Stunting/Flier Class",
        time: "4:00-5:00 PM",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "5:00-6:00 PM",
      },
      {
        activity: "Stunting/Flier Class",
        time: "5:00-6:00 PM",
      },
      {
        activity: "Stunting/Flier Class",
        time: "6:00-7:00 PM",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "6:00-7:00 PM",
      },
      {
        activity: "Twisting",
        time: "7:00-8:30 PM",
      },
    ],
  },
  {
    day: "Wednesday",
    activities: [
      {
        activity: "Cheer Prep Class (age 7-9)",
        time: "4:00-5:00 PM",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "4:00-5:00 PM",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "5:00-6:00 PM",
      },
      {
        activity: "Jump Class",
        time: "5:00-6:00 PM",
      },
      {
        activity: "Strength",
        time: "5:00-6:00 PM",
      },
      {
        activity: "Twisters",
        time: "7:00-8:30 PM",
      },
    ],
  },
  {
    day: "Thursday",
    activities: [
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "4:00-5:00 PM",
      },
      {
        activity: "Strength",
        time: "4:00-5:00 PM",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "5:00-6:00 PM",
      },
      {
        activity: "Stunting/Flier Class",
        time: "5:30-6:30 PM",
      },
      {
        activity: "Stunting/Flier Class",
        time: "6:30-7:30 PM",
      },
      {
        activity: "Twisting",
        time: "7:00-8:30 PM",
      },
    ],
  },
  {
    day: "Friday",
    activities: [
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "4:00-5:00 PM",
      },
      {
        activity: "Cheer Prep Class (age 10 & up)",
        time: "5:00-6:30 PM",
      },
      {
        activity: "Twisting",
        time: "5:00-6:30 PM",
      },
    ],
  },
  {
    day: "Saturday",
    activities: [
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "9:30-10:00 AM",
      },
      {
        activity: "Jump Class",
        time: "10:30-11:30 AM",
      },
      {
        activity: "Intermediate Tumbling",
        time: "10:30-12:00 PM",
      },
      {
        activity: "Stunting/Flier Class",
        time: "11:30-12:30 PM",
      },
      {
        activity: "Stunting/Flier Class",
        time: "12:30-1:30 PM",
      },
      {
        activity: "Stunting/Flier Class",
        time: "1:30-2:30 PM",
      },
    ],
  },
];

export default function ClassSchedule() {
  const DaySchedule = ({ day, activities }) => {
    const ActivityDetails = ({ activity, time }) => {
      return (
        <Grid container item xs={12} sx={{ padding: "5px 25px" }}>
          <Grid container item xs={8}>
            {activity}:
          </Grid>
          <Grid container item xs={4} justifyContent="flex-end">
            {time}
          </Grid>
        </Grid>
      );
    };

    return (
      <Grid container xs={12} sx={{ color: "white", padding: "15px 0" }}>
        <Grid container item xs={12}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "montserrat",
              textTransform: "uppercase",
              fontSize: "2em",
              padding: "25px 15px",
            }}
          >
            {day}
          </Typography>
        </Grid>
        {activities.map((a) => (
          <ActivityDetails activity={a.activity} time={a.time} />
        ))}
      </Grid>
    );
  };

  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container item xs={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                Class Schedule
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent="flex-end" alignItems="center">
              <ScheduleIcon sx={{ fontSize: "5em" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ backgroundColor: "#000", padding: "50px 0" }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={1} sm={2} md={4}>
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
            <Grid item xs={10} sm={8} md={4}>
              <Typography
                color="#ffffff"
                variant="h6"
                textAlign="center"
                sx={{ textTransform: "uppercase", fontFamily: "montserrat" }}
              >
                Current Class Schedule
              </Typography>
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
          </Grid>

          {schedule.map((day) => (
            <DaySchedule day={day.day} activities={day.activities} />
          ))}
          <Grid item xs={12} sx={{ padding: "25px" }}>
            <Divider sx={{ bgcolor: "#eee", marginBottom: "1.1em" }} />
          </Grid>
          <Typography
            sx={{ color: "#FFF", fontFamily: "Source Sans Pro", padding: "25px" }}
          >
            We require a written 30 day notice in order to drop enrollments. Students will need to
            bring water bottles to class. If your child has been sick. We ask that they please not
            attend class that week. We want to keep everyone safe and healthy!
          </Typography>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import Footer from "../../Components/Footer";

const classes = {
  mainImgBox: {
    backgroundColor: `#F44336`,
    padding: "7.5px",
  },
  overlayText: {
    width: "100%",
    fontFamily: "montserrat",
    fontSize: "2.2em",
    fontWeight: 500,
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
        color: "#00bcd4",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "4:00-5:00 PM",
        color: "#d72933",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "5:00-6:00 PM",
        color: "#d72933",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "6:00-7:00 PM",
        color: "#d72933",
      },
      {
        activity: "Open Gym (*High School & College)",
        time: "8:30-10:30 PM",
        color: "#a3ff25",
      },
    ],
  },
  {
    day: "Tuesday",
    activities: [
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "4:00-5:00 PM",
        color: "#d72933",
      },
      {
        activity: "Flexibility",
        time: "4:00-5:00 PM",
        color: "#00bcd4",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "5:00-6:00 PM",
        color: "#d72933",
      },
      {
        activity: "Stunting/Flier Class",
        time: "5:00-6:00 PM",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "6:00-7:00 PM",
        color: "#d72933",
      },
      {
        activity: "Stunting/Flier Class",
        time: "6:00-7:00 PM",
      },
      {
        activity: "Twisters Class",
        time: "7:00-8:30 PM",
        color: "#ffc776",
      },
    ],
  },
  {
    day: "Wednesday",
    activities: [
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "4:00-5:00 PM",
        color: "#d72933",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "5:00-6:00 PM",
        color: "#d72933",
      },
      {
        activity: "Twisters Class",
        time: "6:00-7:30 PM",
        color: "#ffc776",
      },
    ],
  },
  {
    day: "Thursday",
    activities: [
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "4:00-5:00 PM",
        color: "#d72933",
      },
      {
        activity: "Strength",
        time: "4:00-5:00 PM",
        color: "#00bcd4",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "5:00-6:00 PM",
        color: "#d72933",
      },
      {
        activity: "Stunting/Flier Class",
        time: "5:30-6:30 PM",
      },
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "6:00-7:00 PM",
        color: "#d72933",
      },
      {
        activity: "Stunting/Flier Class",
        time: "6:30-7:30 PM",
      },
      {
        activity: "Twisters Class",
        time: "7:00-8:30 PM",
        color: "#ffc776",
      },
    ],
  },
  {
    day: "Friday",
    activities: [
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "4:00-5:00 PM",
        color: "#d72933",
      },
    ],
  },
  {
    day: "Saturday",
    activities: [
      {
        activity: "Beginning/Intermediate Tumbling",
        time: "9:30-10:30 AM",
        color: "#d72933",
      },
      {
        activity: "Jump Class",
        time: "10:30-11:30 AM",
        color: "#00bcd4",
      },
      {
        activity: "Intermediate Tumbling",
        time: "10:30-12:00 PM",
        color: "#d72933",
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

const holidaySchedule = [
  "Apr 18th – Apr 20th",
  "May 26th",
  "Jun 29th – Jul 6th",
  "Sept 1st",
  "Oct 31st",
  "Nov 26th – Nov 30th",
  "Dec 24th – Jan 4th",
];

export default function ClassSchedule() {
  const DaySchedule = ({ day, activities }) => {
    const ActivityDetails = ({ activity, time, color = "#FFF" }) => {
      return (
        <Grid container size={12} sx={{ padding: "5px 25px", color: color }}>
          <Grid container size={8}>
            {activity}:
          </Grid>
          <Grid container size={4} justifyContent="flex-end">
            {time}
          </Grid>
        </Grid>
      );
    };

    return (
      <Grid container size={12} sx={{ color: "white", padding: "15px 0" }}>
        <Grid container size={12}>
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
          <ActivityDetails activity={a.activity} time={a.time} color={a.color} />
        ))}
      </Grid>
    );
  };
  
  const HolidayClosure = ({ range }) => {
    return (
      <Grid container size={12} sx={{ padding: "5px 25px", color: '#FFF' }}>
        <Grid container size={8}>
          {range}:
        </Grid>
        <Grid container size={4} justifyContent="flex-end">
          Closed
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container size={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                Class Schedule
              </Typography>
            </Grid>
            <Grid container size={4} justifyContent="flex-end" alignItems="center">
              <ScheduleIcon sx={{ fontSize: "5em", maxHeight: "5em", maxWidth: "5em", }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ backgroundColor: "#000", padding: "50px 0" }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="center" alignItems="center">
            <Grid size={{ xs: 1, sm: 2, md: 4, }} >
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
            <Grid size={{ xs: 10, sm: 8, md: 4, }} >
              <Typography
                color="#ffffff"
                variant="h6"
                textAlign="center"
                sx={{ textTransform: "uppercase", fontFamily: "montserrat" }}
              >
                Current Class Schedule
              </Typography>
            </Grid>
            <Grid size={{ xs: 1, sm: 2, md: 4, }} >
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
          </Grid>

          {schedule.map((day) => (
            <DaySchedule day={day.day} activities={day.activities} />
          ))}

          <Grid container justifyContent="center" alignItems="center">
            <Grid size={{ xs: 2, sm: 3, md: 4, }} >
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
            <Grid size={{ xs: 8, sm: 6, md: 4, }} >
              <Typography
                color="#ffffff"
                variant="h6"
                textAlign="center"
                sx={{ textTransform: "uppercase", fontFamily: "montserrat" }}
              >
                Holiday Schedule
              </Typography>
            </Grid>
            <Grid size={{ xs: 2, sm: 3, md: 4, }} >
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
          </Grid>
          
          {holidaySchedule.map(range => <HolidayClosure range={range} />)}

          <Grid size={12} sx={{ padding: "25px" }}>
            <Divider sx={{ bgcolor: "#eee", marginBottom: "1.1em" }} />
          </Grid>
          <Typography sx={{ color: "#FFF", fontFamily: "Source Sans Pro", padding: "25px" }}>
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

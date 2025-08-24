import React from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
} from "@syncfusion/ej2-react-schedule";
import { registerLicense } from "@syncfusion/ej2-base";
import Footer from "../../Components/Footer";

registerLicense(import.meta.env.VITE_SYNCFUSION_KEY);

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
        color: "#14b62c",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "4:00-5:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "5:00-6:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "6:00-7:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Open Gym (*High School & College)",
        time: "8:30-10:30 PM",
        color: "#5636f4",
      },
    ],
  },
  {
    day: "Tuesday",
    activities: [
      {
        activity: "Flexibility",
        time: "4:00-5:00 PM",
        color: "#14b62c",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "4:00-5:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "5:00-6:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "6:00-7:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Twisters Class",
        time: "7:00-8:30 PM",
        color: "#7d7d7d",
      },
      {
        activity: "Stunting/Flier Class",
        time: "5:00-6:00 PM",
        color: "#F44336",
      },
      {
        activity: "Stunting/Flier Class",
        time: "6:00-7:00 PM",
        color: "#F44336",
      },
    ],
  },
  {
    day: "Wednesday",
    activities: [
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "4:00-5:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "5:00-6:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Twisters Class",
        time: "6:00-7:30 PM",
        color: "#7d7d7d",
      },
    ],
  },
  {
    day: "Thursday",
    activities: [
      {
        activity: "Strength",
        time: "4:00-5:00 PM",
        color: "#f48b36",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "4:00-5:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "5:00-6:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "6:00-7:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Tumbling - Twisters Class",
        time: "7:00-8:30 PM",
        color: "#7d7d7d",
      },
      {
        activity: "Stunting/Flier Class",
        time: "5:30-6:30 PM",
        color: "#F44336",
      },
      {
        activity: "Stunting/Flier Class",
        time: "6:30-7:30 PM",
        color: "#F44336",
      },
    ],
  },
  {
    day: "Friday",
    activities: [
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "4:00-5:00 PM",
        color: "#0D6EFD",
      },
    ],
  },
  {
    day: "Saturday",
    activities: [
      {
        activity: "Tumbling - Beginning/Intermediate",
        time: "9:30-10:30 AM",
        color: "#0D6EFD",
      },
      {
        activity: "Intermediate Tumbling",
        time: "10:30-12:00 PM",
        color: "#0D6EFD",
      },
      {
        activity: "Jump Class",
        time: "10:30-11:30 AM",
        color: "#00bcd4",
      },
      {
        activity: "Stunting/Flier Class",
        time: "11:30-12:30 PM",
        color: "#F44336",
      },
      {
        activity: "Stunting/Flier Class",
        time: "12:30-1:30 PM",
        color: "#F44336",
      },
      {
        activity: "Stunting/Flier Class",
        time: "1:30-2:30 PM",
        color: "#F44336",
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

const data = [
  {
    Subject: "Tumbling - Beginning/Intermediate",
    StartTime: new Date(2025, 7, 4, 16, 0),
    EndTime: new Date(2025, 7, 4, 17, 0),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1",
    color: "#0D6EFD",
    description: "Beginning: Designed for athletes developing foundational tumbling skills, with a focus on technique and progression through back handsprings.\n\nIntermediate: Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspringc is required for intermediate-level.",
  },
  {
    Subject: "Tumbling - Beginning/Intermediate",
    StartTime: new Date(2025, 7, 4, 17, 0),
    EndTime: new Date(2025, 7, 4, 18, 0),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH;INTERVAL=1",
    color: "#0D6EFD",
    description: "Beginning: Designed for athletes developing foundational tumbling skills, with a focus on technique and progression through back handsprings.\n\nIntermediate: Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspring is required for intermediate-level.",
  },
  {
    Subject: "Tumbling - Beginning/Intermediate",
    StartTime: new Date(2025, 7, 4, 18, 0),
    EndTime: new Date(2025, 7, 4, 19, 0),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TU,TH;INTERVAL=1",
    color: "#0D6EFD",
    description: "Beginning: Designed for athletes developing foundational tumbling skills, with a focus on technique and progression through back handsprings.\n\nIntermediate: Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspring is required for intermediate-level.",
  },
  {
    Subject: "Flexibility",
    StartTime: new Date(2025, 7, 4, 16, 0),
    EndTime: new Date(2025, 7, 4, 17, 0),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TU;INTERVAL=1",
    color: "#14b62c",
    description: "Open to all levels, this class focuses on improving overall flexibility, range of motion, and body control to support safe and effective skill progression."
  },
  {
    Subject: "Strength",
    StartTime: new Date(2025, 7, 7, 16, 0),
    EndTime: new Date(2025, 7, 7, 17, 0),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=TH;INTERVAL=1",
    color: "#f48b36",
    description: "A conditioning class built to improve core, upper body, and lower body strength for tumbling, stunting, and overall athletic performance. All levels welcome—exercises are scaled to individual ability.",
  },
  {
    Subject: "Open Gym (*High School & College)",
    StartTime: new Date(2025, 7, 4, 20, 30),
    EndTime: new Date(2025, 7, 4, 22, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=MO;INTERVAL=1",
    color: "#5636f4",
    description: "Must have an online account and signed off waiver\n\nIf you're under 18, your parent/guardian must make the account with their name THEN add you as the athlete under their account.",
  },
  {
    Subject: "Stunting/Flier Class",
    StartTime: new Date(2025, 7, 5, 17, 0),
    EndTime: new Date(2025, 7, 5, 18, 0),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=TU;INTERVAL=1",
    color: "#F44336",
    description: "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
  },
  {
    Subject: "Stunting/Flier Class",
    StartTime: new Date(2025, 7, 5, 18, 0),
    EndTime: new Date(2025, 7, 5, 19, 0),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=TU;INTERVAL=1",
    color: "#F44336",
    description: "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
  },
  {
    Subject: "Stunting/Flier Class",
    StartTime: new Date(2025, 7, 7, 17, 30),
    EndTime: new Date(2025, 7, 7, 18, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=TH;INTERVAL=1",
    color: "#F44336",
    description: "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
  },
  {
    Subject: "Stunting/Flier Class",
    StartTime: new Date(2025, 7, 7, 18, 30),
    EndTime: new Date(2025, 7, 7, 19, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=TH;INTERVAL=1",
    color: "#F44336",
    description: "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
  },
  {
    Subject: "Stunting/Flier Class",
    StartTime: new Date(2025, 7, 9, 11, 30),
    EndTime: new Date(2025, 7, 9, 12, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=SA;INTERVAL=1",
    color: "#F44336",
    description: "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
  },
  {
    Subject: "Stunting/Flier Class",
    StartTime: new Date(2025, 7, 9, 12, 30),
    EndTime: new Date(2025, 7, 9, 13, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=SA;INTERVAL=1",
    color: "#F44336",
    description: "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
  },
  {
    Subject: "Stunting/Flier Class",
    StartTime: new Date(2025, 7, 9, 13, 30),
    EndTime: new Date(2025, 7, 9, 14, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=SA;INTERVAL=1",
    color: "#F44336",
    description: "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
  },
  {
    Subject: "Tumbling - Twisters Class",
    StartTime: new Date(2025, 7, 5, 19, 0),
    EndTime: new Date(2025, 7, 5, 20, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=TU,TH;INTERVAL=1",
    color: "#7d7d7d",
    description: "For advanced tumblers with a consistent layout. This class focuses on twisting skills such as fulls and beyond."
  },
  {
    Subject: "Tumbling - Twisters Class",
    StartTime: new Date(2025, 7, 6, 18, 0),
    EndTime: new Date(2025, 7, 6, 19, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=WE;INTERVAL=1",
    color: "#7d7d7d",
    description: "For advanced tumblers with a consistent layout. This class focuses on twisting skills such as fulls and beyond."
  },
  {
    Subject: "Tumbling - Beginning/Intermediate",
    StartTime: new Date(2025, 7, 9, 9, 30),
    EndTime: new Date(2025, 7, 9, 10, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=SA;INTERVAL=1",
    color: "#0D6EFD",
    description: "Beginning: Designed for athletes developing foundational tumbling skills, with a focus on technique and progression through back handsprings.\n\nIntermediate: Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspring is required for intermediate-level.",
  },
  {
    Subject: "Tumbling - Intermediate",
    StartTime: new Date(2025, 7, 9, 10, 30),
    EndTime: new Date(2025, 7, 9, 12, 0),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=SA;INTERVAL=1",
    color: "#0D6EFD",
    description: "Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspring is required to attend.",
  },
  {
    Subject: "Jumps Class",
    StartTime: new Date(2025, 7, 9, 10, 30),
    EndTime: new Date(2025, 7, 9, 11, 30),
    RecurrenceRule: "FREQ=WEEKLY;BYDAY=SA;INTERVAL=1",
    color: "#f48b36",
    description: "Designed for athletes of all levels to develop power, height, technique, and control in their jumps. Drills are tailored to help each athlete progress at their own pace.",
  },
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
      <Grid container size={12} sx={{ padding: "5px 25px", color: "#FFF" }}>
        <Grid container size={8}>
          {range}:
        </Grid>
        <Grid container size={4} justifyContent="flex-end">
          Closed
        </Grid>
      </Grid>
    );
  };

  const onPopupOpen = (args) => {
    if (args.type === 'QuickInfo' && args.element) {
      // Try both common class names Syncfusion uses across versions
      const selectors = [
        '.e-event-edit', '.e-event-delete',
        '.e-edit', '.e-delete' // fallback aliases
      ];
      selectors.forEach(sel => {
        args.element.querySelectorAll(sel).forEach(el => el.remove());
      });
    }
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
              <ScheduleIcon sx={{ fontSize: "5em", maxHeight: "5em", maxWidth: "5em" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ backgroundColor: "#000", padding: "50px 0" }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="center" alignItems="center">
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
            <Grid size={{ xs: 10, sm: 8, md: 4 }}>
              <Typography
                color="#ffffff"
                variant="h6"
                textAlign="center"
                sx={{ textTransform: "uppercase", fontFamily: "montserrat" }}
              >
                Current Class Schedule
              </Typography>
            </Grid>
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
          </Grid>
          <ScheduleComponent
            selectedDate={new Date()}
            startHour="09:00"
            endHour="22:30"
            workDays={[1, 2, 3, 4, 5, 6]}
            currentView="WorkWeek"
            cssClass="responsive-week"
            eventSettings={{
              dataSource: data,
              fields: {
                description: { name: "description" },
                iClassProLink: { name: "iClassProLink" },
              },
            }}
            eventRendered={({ element, data }) => {
              // const iClassProLink = data.iClassProLink;
              // if (iClassProLink) {
              //   const iClassProLinkEl = document.createElement("div");
              //   iClassProLinkEl.style.fontSize = "12px";
              //   iClassProLinkEl.style.opacity = "0.7";
              //   iClassProLinkEl.textContent = iClassProLink;
              //   element.appendChild(iClassProLinkEl);
              // }
              
              if (data.color) {
                element.style.backgroundColor = data.color;
              }
            }}
            popupOpen={onPopupOpen}
            readonly
          >
            <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
          </ScheduleComponent>

          {schedule.map((day) => (
            <DaySchedule day={day.day} activities={day.activities} />
          ))}

          <Grid container justifyContent="center" alignItems="center">
            <Grid size={{ xs: 2, sm: 3, md: 4 }}>
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
            <Grid size={{ xs: 8, sm: 6, md: 4 }}>
              <Typography
                color="#ffffff"
                variant="h6"
                textAlign="center"
                sx={{ textTransform: "uppercase", fontFamily: "montserrat" }}
              >
                Holiday Schedule
              </Typography>
            </Grid>
            <Grid size={{ xs: 2, sm: 3, md: 4 }}>
              <Divider sx={{ bgcolor: "#f4524d" }} />
            </Grid>
          </Grid>

          {holidaySchedule.map((range) => (
            <HolidayClosure range={range} />
          ))}

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
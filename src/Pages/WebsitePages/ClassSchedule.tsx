import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import HolidayClosure from "../../Components/HolidayClosure";
import Footer from "../../Components/Footer";
import { camps } from "../../states";
import dayjs from "dayjs";

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
import type { PopupOpenEventArgs } from "@syncfusion/ej2-schedule";


registerLicense(import.meta.env.VITE_SYNCFUSION_KEY);

type DayCode = "MO" | "TU" | "WE" | "TH" | "FR" | "SA";

type ClassSession = {
  title: string;
  label?: string;
  days: DayCode[];
  start: string; // "HH:mm"
  end: string; // "HH:mm"
  color: string;
  description?: string;
  link?: { href: string; innerText: string };
};

type ScheduleActivity = {
  activity: string;
  time: string;
  color: string;
};

type ScheduleDay = {
  day: string;
  activities: ScheduleActivity[];
};

const classes = {
  mainImgBox: {
    backgroundColor: "var(--color-surface)",
    borderBottom: "1px solid var(--color-border)",
    padding: "18px 0",
  },
  overlayText: {
    width: "100%",
    fontFamily: "var(--font-display)",
    fontSize: "2.2em",
    fontWeight: 500,
    textTransform: "uppercase",
  },
};

const dayOrder: DayCode[] = ["MO", "TU", "WE", "TH", "FR", "SA"];

const dayLabel: Record<DayCode, string> = {
  MO: "Monday",
  TU: "Tuesday",
  WE: "Wednesday",
  TH: "Thursday",
  FR: "Friday",
  SA: "Saturday",
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return { time: `${hour12}:${minutes.toString().padStart(2, "0")}`, period };
};

const formatTimeRange = (start: string, end: string) => {
  const startTime = formatTime(start);
  const endTime = formatTime(end);
  return `${startTime.time}-${endTime.time} ${endTime.period}`;
};

const buildRecurrenceRule = (days: DayCode[]) =>
  `FREQ=WEEKLY;BYDAY=${days.join(",")};INTERVAL=1`;

const baseWeekStart = new Date(2025, 7, 4); // Monday, Aug 4, 2025
const buildDateTime = (day: DayCode, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const dayIndex = dayOrder.indexOf(day);
  const date = new Date(baseWeekStart);
  date.setDate(baseWeekStart.getDate() + dayIndex);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const classSessions: ClassSession[] = [
  {
    title: "Tumbling - Beginning/Intermediate",
    days: ["MO", "TU", "WE", "TH", "FR"],
    start: "16:00",
    end: "17:00",
    color: "#0D6EFD",
    description:
      "Beginning: Designed for athletes developing foundational tumbling skills, with a focus on technique and progression through back handsprings.\n\nIntermediate: Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspring is required for intermediate-level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?levels=11&programs=59",
      innerText: "Register for a Beginning/Intermediate class",
    },
  },
  {
    title: "Tumbling - Beginning/Intermediate",
    days: ["MO", "TU", "WE", "TH"],
    start: "17:00",
    end: "18:00",
    color: "#0D6EFD",
    description:
      "Beginning: Designed for athletes developing foundational tumbling skills, with a focus on technique and progression through back handsprings.\n\nIntermediate: Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspring is required for intermediate-level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?levels=11&programs=59",
      innerText: "Register for a Beginning/Intermediate class",
    },
  },
  {
    title: "Tumbling - Beginning/Intermediate",
    days: ["MO", "TU", "TH"],
    start: "18:00",
    end: "19:00",
    color: "#0D6EFD",
    description:
      "Beginning: Designed for athletes developing foundational tumbling skills, with a focus on technique and progression through back handsprings.\n\nIntermediate: Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspring is required for intermediate-level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?levels=11&programs=59",
      innerText: "Register for a Beginning/Intermediate class",
    },
  },
  {
    title: "Flexibility",
    days: ["MO", "TU"],
    start: "16:00",
    end: "17:00",
    color: "#14b62c",
    description:
      "Open to all levels, this class focuses on improving overall flexibility, range of motion, and body control to support safe and effective skill progression.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=67",
      innerText: "Register for a strength class",
    },
  },
  {
    title: "Strength",
    days: ["TH"],
    start: "16:00",
    end: "17:00",
    color: "#f48b36",
    description:
      "A conditioning class built to improve core, upper body, and lower body strength for tumbling, stunting, and overall athletic performance. All levels welcome—exercises are scaled to individual ability.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=63",
      innerText: "Register for a strength class",
    },
  },
  {
    title: "Open Gym (*High School & College)",
    days: ["MO"],
    start: "20:30",
    end: "22:30",
    color: "#5636f4",
    description:
      "Must have an online account and signed off waiver\n\nIf you're under 18, your parent/guardian must make the account with their name THEN add you as the athlete under their account.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/create-account-01-verify-email",
      innerText: "Create an Account",
    },
  },
  {
    title: "Stunting/Flier Class",
    days: ["TU"],
    start: "17:00",
    end: "18:00",
    color: "#F44336",
    description:
      "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=71",
      innerText: "Register for a stunting class",
    },
  },
  {
    title: "Stunting/Flier Class",
    days: ["TU"],
    start: "18:00",
    end: "19:00",
    color: "#F44336",
    description:
      "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=71",
      innerText: "Register for a stunting class",
    },
  },
  {
    title: "Stunting/Flier Class",
    days: ["TH"],
    start: "17:30",
    end: "18:30",
    color: "#F44336",
    description:
      "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=71",
      innerText: "Register for a stunting class",
    },
  },
  {
    title: "Stunting/Flier Class",
    days: ["TH"],
    start: "18:30",
    end: "19:30",
    color: "#F44336",
    description:
      "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=71",
      innerText: "Register for a stunting class",
    },
  },
  {
    title: "Stunting/Flier Class",
    days: ["SA"],
    start: "11:30",
    end: "12:30",
    color: "#F44336",
    description:
      "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=71",
      innerText: "Register for a stunting class",
    },
  },
  {
    title: "Stunting/Flier Class",
    days: ["SA"],
    start: "12:30",
    end: "13:30",
    color: "#F44336",
    description:
      "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=71",
      innerText: "Register for a stunting class",
    },
  },
  {
    title: "Stunting/Flier Class",
    days: ["SA"],
    start: "13:30",
    end: "14:30",
    color: "#F44336",
    description:
      "This class provides athletes the opportunity to work on stunting technique, timing, and confidence. Flyers and bases of all levels are welcome, with instruction tailored to each athlete’s current skill level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=71",
      innerText: "Register for a stunting class",
    },
  },
  {
    title: "Tumbling - Twisters Class",
    days: ["TU", "TH"],
    start: "19:00",
    end: "20:30",
    color: "#7d7d7d",
    description:
      "For advanced tumblers with a consistent layout. This class focuses on twisting skills such as fulls and beyond.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?levels=15&programs=59",
      innerText: "Register for a twisters class",
    },
  },
  {
    title: "Tumbling - Twisters Class",
    days: ["WE"],
    start: "18:00",
    end: "19:30",
    color: "#7d7d7d",
    description:
      "For advanced tumblers with a consistent layout. This class focuses on twisting skills such as fulls and beyond.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?levels=15&programs=59",
      innerText: "Register for a twisters class",
    },
  },
  {
    title: "Tumbling - Beginning/Intermediate",
    days: ["SA"],
    start: "09:30",
    end: "10:30",
    color: "#0D6EFD",
    description:
      "Beginning: Designed for athletes developing foundational tumbling skills, with a focus on technique and progression through back handsprings.\n\nIntermediate: Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspring is required for intermediate-level.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?levels=11&programs=59&days=7",
      innerText: "Register for this class",
    },
  },
  {
    title: "Tumbling - Intermediate",
    label: "Intermediate Tumbling",
    days: ["SA"],
    start: "10:30",
    end: "12:00",
    color: "#0D6EFD",
    description:
      "Intended for athletes working on back handspring series and advancing to back tucks and layouts. A solid standing and running back handspring is required to attend.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?levels=7&programs=59&days=7",
      innerText: "Register for this class",
    },
  },
  {
    title: "Jumps Class",
    label: "Jump Class",
    days: ["SA"],
    start: "10:30",
    end: "11:30",
    color: "#00bcd4",
    description:
      "Designed for athletes of all levels to develop power, height, technique, and control in their jumps. Drills are tailored to help each athlete progress at their own pace.",
    link: {
      href: "https://portal.iclasspro.com/dauntlessathletics/classes?programs=91",
      innerText: "Register for a jumps class",
    },
  },
];

const buildSchedule = (sessions: ClassSession[]): ScheduleDay[] => {
  const activityMap: Record<DayCode, Array<ScheduleActivity & { startMinutes: number }>> = {
    MO: [],
    TU: [],
    WE: [],
    TH: [],
    FR: [],
    SA: [],
  };

  sessions.forEach((session) => {
    session.days.forEach((day) => {
      activityMap[day].push({
        activity: session.label ?? session.title,
        time: formatTimeRange(session.start, session.end),
        color: session.color,
        startMinutes: toMinutes(session.start),
      });
    });
  });

  dayOrder.forEach((day) => {
    activityMap[day].sort((a, b) => a.startMinutes - b.startMinutes);
  });

  return dayOrder.map((day) => ({
    day: dayLabel[day],
    activities: activityMap[day].map(({ startMinutes, ...activity }) => activity),
  }));
};

const schedule = buildSchedule(classSessions);

export const holidayScheduleEvents = [
  {
    Id: 20260329,
    Subject: "10 Years of Dauntless Athletics",
    StartTime: new Date(2026, 2, 29, 0, 0),
    EndTime: new Date(2026, 2, 30, 0, 0),
    IsAllDay: true,
    zIndex: 1,
    description: "Come help us celebrate 10 years of Dauntless Athletics. Save the Date: March 29, 2026. Thank you for being part of this incredible journey over the 10 years.",
  },
  {
    Id: 20250418,
    Subject: 'Closed',
    StartTime: new Date(2026, 3, 3, 0, 0),
    EndTime: new Date(2026, 3, 6, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
  },
  {
    Id: 20250526,
    Subject: 'Closed',
    StartTime: new Date(2026, 4, 25, 0, 0),
    EndTime: new Date(2026, 4, 26, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
  },
  {
    Id: 20251031,
    Subject: 'Closed',
    StartTime: new Date(2026, 5, 28, 0, 0),
    EndTime: new Date(2026, 6, 6, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
  },
  {
    Id: 20251031,
    Subject: 'Closed',
    StartTime: new Date(2026, 8, 7, 0, 0),
    EndTime: new Date(2026, 8, 8, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
  },
  {
    Id: 20251126,
    Subject: 'Closed',
    StartTime: new Date(2026, 10, 25, 0, 0),
    EndTime: new Date(2026, 10, 30, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
    description: `We are closed for all classes 
  from ${dayjs
        .utc(new Date("2025-11-26"))
        .format("dddd, MMMM Do")}
      through ${dayjs
        .utc(new Date("2025-11-30"))
        .format("dddd, MMMM Do")}.
  Happy Thanksgiving!`,

  },
  {
    Id: 20251224,
    Subject: 'Closed',
    StartTime: new Date(2026, 11, 24, 0, 0),
    EndTime: new Date(2027, 0, 4, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
    description: `We are closed for all classes 
  from ${dayjs
        .utc(new Date("2025-12-24"))
        .format("dddd, MMMM Do")}
      through ${dayjs
        .utc(new Date("2026-01-04"))
        .format("dddd, MMMM Do")}.
  Happy Holidays!`,
  },
];

const data = [
  ...classSessions.map((session) => ({
    Subject: session.title,
    StartTime: buildDateTime(session.days[0], session.start),
    EndTime: buildDateTime(session.days[0], session.end),
    RecurrenceRule: buildRecurrenceRule(session.days),
    color: session.color,
    description: session.description,
    link: session.link,
  })),
  ...camps.filter((camp) => camp.includeInSchedule !== false),
  ...holidayScheduleEvents,
];

export default function ClassSchedule() {
  const DaySchedule = ({ day, activities }: ScheduleDay) => {
    const ActivityDetails = ({ activity, time, color = "#FFF" }: { activity: string; time: string; color?: string }) => {
      return (
        <Grid container size={12} sx={{ padding: "5px 25px", color }}>
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
      <Box
        sx={{
          backgroundColor: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: "20px",
          padding: "10px 0",
          margin: "20px 0",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        <Grid container size={12} sx={{ color: "var(--color-text)", padding: "15px 0" }}>
          <Grid container size={12}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "var(--font-display)",
                textTransform: "uppercase",
                fontSize: "2em",
                padding: "25px 15px 10px",
              }}
            >
              {day}
            </Typography>
          </Grid>
          {activities.map((a) => (
            <ActivityDetails activity={a.activity} time={a.time} color={a.color} />
          ))}
        </Grid>
      </Box>
    );
  };

  const onPopupOpen = (args: PopupOpenEventArgs) => {

    if (args.type === 'Editor') {
      args.cancel = true;
    }
    if (args.type === 'QuickInfo' && args.element) {
      // Try both common class names Syncfusion uses across versions
      const selectors = [
        '.e-event-edit', '.e-event-delete',
        '.e-edit', '.e-delete' // fallback aliases
      ];
      selectors.forEach(sel => {
        args.element.querySelectorAll(sel).forEach((el: Element) => el.remove());
      });
    }
    // Inject external link into description area
    if (args.data?.link) {
      const descriptionContainer = args.element.querySelector('.e-description-details');
      if (descriptionContainer && !descriptionContainer.querySelector('.external-class-link')) {
        const linkEl = document.createElement('a');
        linkEl.href = args.data.link.href;
        linkEl.innerText = args.data.link.innerText;
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
        linkEl.className = 'external-class-link'; // prevent duplicates
        linkEl.style.display = 'block';
        linkEl.style.marginTop = '6px';
        linkEl.style.color = 'var(--color-accent)';
        linkEl.style.fontSize = '13px';
        linkEl.style.textDecoration = 'underline';

        descriptionContainer.appendChild(linkEl);
      }
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
      <Box sx={{ backgroundColor: "transparent", padding: "50px 0" }}>
        <Container
          maxWidth="lg"
          sx={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "28px",
            padding: { xs: "20px", md: "32px" },
            boxShadow: "0 28px 50px rgba(0,0,0,0.45)",
          }}
        >
          <Grid container justifyContent="center" alignItems="center">
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <Divider sx={{ bgcolor: "var(--color-accent)" }} />
            </Grid>
            <Grid size={{ xs: 10, sm: 8, md: 4 }}>
              <Typography
                color="var(--color-text)"
                variant="h6"
                textAlign="center"
                sx={{ textTransform: "uppercase", fontFamily: "var(--font-display)" }}
              >
                Current Class Schedule
              </Typography>
            </Grid>
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <Divider sx={{ bgcolor: "var(--color-accent)" }} />
            </Grid>
          </Grid>
          <ScheduleComponent
            selectedDate={new Date()}
            startHour="09:00"
            endHour="22:30"
            workDays={[1, 2, 3, 4, 5, 6]}
            currentView="Week"
            cssClass="responsive-week"
            eventSettings={{
              dataSource: data,
              fields: {
                description: { name: "description" },
                link: { name: "link" },
              },
            }}
            eventRendered={({ element, data }) => {
              if (data.color) {
                element.style.backgroundColor = data.color;
              }
              if (data.zIndex) {
                element.style.zIndex = data.zIndex;
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
              <Divider sx={{ bgcolor: "var(--color-accent)" }} />
            </Grid>
            <Grid size={{ xs: 8, sm: 6, md: 4 }}>
              <Typography
                color="var(--color-text)"
                variant="h6"
                textAlign="center"
                sx={{ textTransform: "uppercase", fontFamily: "var(--font-display)" }}
              >
                Holiday Schedule
              </Typography>
            </Grid>
            <Grid size={{ xs: 2, sm: 3, md: 4 }}>
              <Divider sx={{ bgcolor: "var(--color-accent)" }} />
            </Grid>
          </Grid>

          <Box
            sx={{
              backgroundColor: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "20px",
              padding: "10px 0",
              margin: "20px 0",
            }}
          >
            <HolidayClosure />
          </Box>

          <Grid size={12} sx={{ padding: "25px" }}>
            <Divider sx={{ bgcolor: "var(--color-border)", marginBottom: "1.1em" }} />
          </Grid>
          <Typography sx={{ color: "var(--color-muted)", fontFamily: "var(--font-body)", padding: "25px" }}>
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

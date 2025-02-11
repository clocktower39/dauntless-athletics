import {
  Star as StarsIcon,
  SportsGymnastics as SportsGymnasticsIcon,
  FitnessCenter as FitnessCenterIcon,
  SportsKabaddi as SportsKabaddiIcon,
  AirlineStops as AirlineStopsIcon,
  CropFree as CropFreeIcon,
  Storm as StormIcon,
  School as SchoolIcon,
  Campaign as CampaignIcon,
  EmojiEvents as EmojiEventsIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(advancedFormat);

const classes = {
  DauntlessClassesIcon: {
    fontSize: { xs: "4em", md: "6em" },
    padding: "15px",
  },
  DauntlessCampIcon: {
    height: "160px",
    width: "160px",
    scale: 0.8,
  },
};

export const camps = [
  // {
  //   icon: <AirlineStopsIcon sx={{ ...classes.DauntlessCampIcon }} />,
  //   title: "Beginning Tumbling Clinic",
  //   color: "#8e43ba",
  //   date: dayjs.utc(new Date("2025-01-25")).format("dddd, MMMM Do"),
  //   time: "2:30 - 4:00 pm",
  //   place: "Dauntless Athletics",
  //   cost: 40,
  //   buttonText: "Register For Clinic",
  //   link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
  // },
  // {
  //   icon: <StarsIcon sx={{ ...classes.DauntlessCampIcon }} />,
  //   title: "Intermediate/Advanced Tumbling Clinic",
  //   color: "#8e43ba",
  //   date: dayjs.utc(new Date("2025-01-25")).format("dddd, MMMM Do"),
  //   time: "4:00 - 5:30 pm",
  //   place: "Dauntless Athletics",
  //   cost: 40,
  //   buttonText: "Register For Clinic",
  //   link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
  // },
  // {
  //   icon: <SportsGymnasticsIcon sx={{ ...classes.DauntlessCampIcon }} />,
  //   title: "Focused Tumbling Clinic Aerial",
  //   color: "#8e43ba",
  //   date: dayjs.utc(new Date("2025-01-25")).format("dddd, MMMM Do"),
  //   time: "5:30 - 6:30 pm",
  //   place: "Dauntless Athletics",
  //   cost: 25,
  //   buttonText: "Register For Clinic",
  //   link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
  // },
  // {
  //   icon: <StarsIcon sx={{ ...classes.DauntlessCampIcon }} />,
  //   title: "January Tumbling Camp",
  //   color: "#8e43ba",
  //   date: dayjs.utc(new Date("2025-01-26")).format("dddd, MMMM Do"),
  //   time: "1:00 - 4:00 pm",
  //   place: "Dauntless Athletics",
  //   cost: 69,
  //   buttonText: "Register For Camp",
  //   link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/1",
  // },
  {
    icon: <CampaignIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "Presidents' Day Camp",
    color: "#065E99",
    date: dayjs.utc(new Date("2025-02-17")).format("dddd, MMMM Do"),
    time: "9:00 am - 12:00 pm",
    place: "Dauntless Athletics",
    cost: 69,
    buttonText: "Register For Camp",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/1",
  },
  {
    icon: <AirlineStopsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "Beginning Tumbling Clinic",
    color: "#065E99",
    date: dayjs.utc(new Date("2025-02-22")).format("dddd, MMMM Do"),
    time: "2:30 - 4:00 pm",
    place: "Dauntless Athletics",
    cost: 40,
    buttonText: "Register For Clinic",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/19",
  },
  {
    icon: <StarsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "Intermediate/Advanced Tumbling Clinic",
    color: "#065E99",
    date: dayjs.utc(new Date("2025-02-22")).format("dddd, MMMM Do"),
    time: "4:00 - 5:30 pm",
    place: "Dauntless Athletics",
    cost: 40,
    buttonText: "Register For Clinic",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/19",
  },
  {
    icon: <SportsGymnasticsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "Focused Tumbling Clinic Aerial",
    color: "#065E99",
    date: dayjs.utc(new Date("2025-02-22")).format("dddd, MMMM Do"),
    time: "5:30 - 6:30 pm",
    place: "Dauntless Athletics",
    cost: 25,
    buttonText: "Register For Clinic",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
  },
  {
    icon: <StarsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "February Tumbling Camp",
    color: "#065E99",
    date: dayjs.utc(new Date("2025-02-23")).format("dddd, MMMM Do"),
    time: "1:00 - 4:00 pm",
    place: "Dauntless Athletics",
    cost: 69,
    buttonText: "Register For Camp",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/1",
  },
  {
    icon: <AirlineStopsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "Beginning Tumbling Clinic",
    color: "#f01313",
    date: dayjs.utc(new Date("2025-03-01")).format("dddd, MMMM Do"),
    time: "2:30 - 4:00 pm",
    place: "Dauntless Athletics",
    cost: 40,
    buttonText: "Register For Clinic",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/19",
  },
  {
    icon: <StarsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "Intermediate/Advanced Tumbling Clinic",
    color: "#f01313",
    date: dayjs.utc(new Date("2025-03-01")).format("dddd, MMMM Do"),
    time: "4:00 - 5:30 pm",
    place: "Dauntless Athletics",
    cost: 40,
    buttonText: "Register For Clinic",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/19",
  },
  {
    icon: <SportsGymnasticsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "Focused Tumbling Clinic Aerial",
    color: "#f01313",
    date: dayjs.utc(new Date("2025-03-01")).format("dddd, MMMM Do"),
    time: "5:30 - 6:30 pm",
    place: "Dauntless Athletics",
    cost: 25,
    buttonText: "Register For Clinic",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
  },
  {
    icon: <StarsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "March Tumbling Camp",
    color: "#f01313",
    date: dayjs.utc(new Date("2025-03-02")).format("dddd, MMMM Do"),
    time: "1:00 - 4:00 pm",
    place: "Dauntless Athletics",
    cost: 69,
    buttonText: "Register For Camp",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/1",
  },
  {
    icon: <EmojiEventsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "Spring Break Tumbling Day Camp Week 1",
    color: "#8e43ba",
    date: {
      start: dayjs.utc(new Date("2025-03-10")).format("dddd, MMMM Do"),
      end: dayjs.utc(new Date("2025-03-12")).format("dddd, MMMM Do"),
    },
    time: "9:00 am - 12:00 pm",
    place: "Dauntless Athletics",
    cost: { day: 55, week: 150, },
    buttonText: "Register For Camp",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/27",
  },
  {
    icon: <EmojiEventsIcon sx={{ ...classes.DauntlessCampIcon }} />,
    title: "Spring Break Tumbling Day Camp Week 2",
    color: "#8e43ba",
    date: {
      start: dayjs.utc(new Date("2025-03-17")).format("dddd, MMMM Do"),
      end: dayjs.utc(new Date("2025-03-19")).format("dddd, MMMM Do"),
    },
    time: "9:00 am - 12:00 pm",
    place: "Dauntless Athletics",
    cost: { day: 55, week: 150, },
    buttonText: "Register For Camp",
    link: "https://app.iclasspro.com/portal/dauntlessathletics/camps/27",
  },
];

export const dauntlessClasses = [
  {
    title: "Tumbling",
    description:
      "We offer every level of tumbling to teach kids basic to advanced tumbling skills. We teach solid fundamentals and spot the kids throughout the skills to ensure their safety and build their confidence. This allows them to acquire skills faster.",
    icon: <AirlineStopsIcon sx={{ ...classes.DauntlessClassesIcon, color: "rgb(0, 188, 212)" }} />,
  },
  {
    title: "Tumbling Camp",
    description:
      "Let Dauntless Athletics get you ready for your cheer team final selection. Let us help you GET YOUR SKILLS!!",
    icon: (
      <SportsGymnasticsIcon sx={{ ...classes.DauntlessClassesIcon, color: "rgb(244, 67, 54)" }} />
    ),
  },
  {
    title: "Strength, Conditioning & Flexibility",
    description:
      "We provide circuit style training to help improve the kids' muscular and cardiovascular endurance as well as proper technique for lifting to help build balance and strong muscles.",
    icon: (
      <FitnessCenterIcon sx={{ ...classes.DauntlessClassesIcon, color: "rgb(255, 144, 105)" }} />
    ),
  },
  {
    title: "Twisting",
    description:
      "We offer an elite tumbling class for athletes who want to learn twisting, combo passes and double flipping skills. The athletes will be spotted repeatedly to help understand the high level skills they will be asked to do.",
    icon: <StormIcon sx={{ ...classes.DauntlessClassesIcon, color: "rgb(243, 199, 37)" }} />,
  },
  {
    title: "Stunting",
    description:
      "We offer stunting classes for building your skill and dexterity. Basic two-legged stunts, one-legged extended stunts, and high flying basket tosses are only a portion of what we offer.",
    icon: (
      <SportsKabaddiIcon sx={{ ...classes.DauntlessClassesIcon, color: "rgb(243, 199, 37)" }} />
    ),
  },
  {
    title: "Open Gym",
    description:
      "We offer Open Gym every Monday from 8:30 - 10:30 PM. Bring your friends and have a great time at Dauntless. (*High School and College)",
    icon: <CropFreeIcon sx={{ ...classes.DauntlessClassesIcon, color: "rgb(184, 255, 0)" }} />,
  },
  {
    title: "High School Onsite Training",
    description:
      "We work with several high school teams across the Valley and offer tumbling on a non-spring tumbling floor. They get more tumbling reps on the same apparatus on which they will compete. Additionally, we use the spring floor to help them gain a better understanding of the skills they are learning. All these techniques help us provide them the most optimal tumbling training.",
    icon: <SchoolIcon sx={{ ...classes.DauntlessClassesIcon, color: "rgb(146, 237, 86)" }} />,
  },
];

export const pricingOptions = [
  {
    title: "1 hour Each Week",
    cost: "$85",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#6391FF",
  },
  {
    title: "1.5 hours Each Week",
    cost: "$110",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#B0DE79",
  },
  {
    title: "2 hours Each Week",
    cost: "$130",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#FF5B93",
  },
  {
    title: "2.5 hours Each Week",
    cost: "$140",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#01E2FE",
  },
  {
    title: "3 hours Each Week",
    cost: "$150",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#6184D8",
  },
  {
    title: "3.5 hours Each Week",
    cost: "$160",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#533A71",
  },
  {
    title: "4 hours Each Week",
    cost: "$170",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#00BFA5",
  },
  {
    title: "4.5 hours Each Week",
    cost: "$175",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#5D737E",
  },
  {
    title: "Private Lessons",
    cost: "Varies",
    duration: "Call for Pricing",
    buttonText: "(480) 214-3908",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#86DD1C",
    optionalTextList: ["Prices vary by coach"],
  },
  {
    title: "Drop-In Rate",
    cost: "Varies",
    duration: "1 - 1.5 Hours",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#7EE0BF",
    optionalTextList: ["$35 for 1 hour single class", "$45 for 1.5 hour single class"],
  },
  {
    title: "Tumbling Camp",
    cost: "$69",
    duration: "3 Hours",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/camps?camptype=1",
    backgroundColor: "#83BCE9",
    optionalTextList: ["Beginner", "Intermediate", "Advanced", "*Price is per athlete"],
  },
];

import {
  SportsGymnastics as SportsGymnasticsIcon,
  FitnessCenter as FitnessCenterIcon,
  SportsKabaddi as SportsKabaddiIcon,
  AirlineStops as AirlineStopsIcon,
  CropFree as CropFreeIcon,
  Storm as StormIcon,
  School as SchoolIcon,
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
  {
    icon: <img src="/images/camps/silhouette_skeleton_toe_touch.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "October Tumbling Camp",
    StartTime: new Date(2025, 9, 19, 13, 0),
    EndTime: new Date(2025, 9, 19, 16, 0),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 69,
    description: 'Camp is a 3-hour camp that is for all levels from the very beginner to the most advanced. It will cover all aspects of Tumbling from running, standing, and combination passes for all levels. ',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/1",
      innerText: 'Register For Camp',
    },
  },
  {
    icon: <img src="/images/camps/silhouette_backhandspring.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '15%', }} />,
    Subject: "Focused Tumbling Clinic Back Handspring",
    StartTime: new Date(2025, 9, 25, 14, 30),
    EndTime: new Date(2025, 9, 25, 15, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 25,
    description: 'Tumbling camp is for Beginners and those that need to get a back handspring or need to clean up and refine their back handspring',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
      innerText: "Register For Clinic",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_back_tuck.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "Focused Tumbling Clinic Back Tucks and Up",
    StartTime: new Date(2025, 9, 25, 15, 30),
    EndTime: new Date(2025, 9, 25, 16, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 25,
    description: 'Tumbling camp for those who need to get a back tuck and above. Requirement of a back handspring without a spot. This will cover from the intermediate level to the most advanced levels.',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
      innerText: "Register For Clinic",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_aerial_cartwheel.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "Focused Tumbling Clinic Aerial",
    StartTime: new Date(2025, 9, 25, 16, 30),
    EndTime: new Date(2025, 9, 25, 17, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 25,
    description: 'Camp is for those that need to get aerials for dance, pom, cheer, etc. ',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
      innerText: "Register For Clinic",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_daddy_daughter_clinic.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "Daddy Daughter Clinic",
    StartTime: new Date(2025, 9, 26, 14, 0),
    EndTime: new Date(2025, 9, 26, 15, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 50,
    description: 'This is a clinic designed for Dads and daughters to do together. They will cover tumbling, stunting, and stretch skills in this clinic and will work at the level the athletes are at and build on this. Please make sure that both Dad and the athlete have been registered online it is $25 for each for a total of $50 for both Daddy/daughter together.',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/36",
      innerText: "Register For Camp",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_group_stunting.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "All Girl High School Stunt Clinic (must bring entire stunt group)",
    StartTime: new Date(2025, 10, 2, 13, 0),
    EndTime: new Date(2025, 10, 2, 15, 0),
    color: "#065E99",
    place: "Dauntless Athletics",
    cost: 30,
    description: "Must be a with a stunt group to attend. This is an all-girl group stunt style clinic hosted by Coach Dawa, Coach Oatha, Coach Leo and guest coaches and helpers from the GCU Cheerleaders. You MUST BRING YOUR OWN FULL STUNT GROUP. This camp is to help prep for competition season with your group. This camp will help sharpen your skills and get help with skills your group may be stuck on; and/or help your group gain new skills. The camp will be tailored to skills you and your group are wanting help with or want to learn and work on with the help and assistance of all these incredible coaches. There will be live stunt demonstrations, stunt techniques broken down with close personal help with multiple coaches for everyone in your stunt group.\nEVERYONE IN YOUR STUNT GROUP THAT COMES TO THE CLINIC MUST HAVE AN ACCOUNT MADE BY THEIR PARENT OR GUARDIAN THAT IS IN THEIR PARENT OR GUARDIANS NAMES WITH THE PARENT OR GUARDIANS INFORMATION AND ACCEPTANCE OF ALL THE RULES AND POLICIES. THE ATHLETE'S NAME MUST GO UNDER THE STUDENT PORTION.",
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/35",
      innerText: "Register For Camp",
    },
  },
  {
    poster: "/images/camps/adult_clinic.png",
    Subject: "Adult Clinic\nAges 19 & up",
    StartTime: new Date(2025, 10, 9, 13, 0),
    EndTime: new Date(2025, 10, 9, 14, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 15,
    description: 'This is a clinic designed for Adults ages 19 and older. This clinic will focus on tumbling, stunting, jumps, and stretching. It is designed for all levels and for those who are adults and wish to work on tumbling, stunting, and jump skills.',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/11",
      innerText: "Register For Camp",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_backhandspring.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '15%', }} />,
    Subject: "Focused Tumbling Clinic Back Handspring",
    StartTime: new Date(2025, 10, 15, 14, 30),
    EndTime: new Date(2025, 10, 15, 15, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 25,
    description: 'Tumbling camp is for Beginners and those that need to get a back handspring or need to clean up and refine their back handspring',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
      innerText: "Register For Clinic",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_back_tuck.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "Focused Tumbling Clinic Back Tucks and Up",
    StartTime: new Date(2025, 10, 15, 15, 30),
    EndTime: new Date(2025, 10, 15, 16, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 25,
    description: 'Tumbling camp for those who need to get a back tuck and above. Requirement of a back handspring without a spot. This will cover from the intermediate level to the most advanced levels.',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
      innerText: "Register For Clinic",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_aerial_cartwheel.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "Focused Tumbling Clinic Aerial",
    StartTime: new Date(2025, 10, 15, 16, 30),
    EndTime: new Date(2025, 10, 15, 17, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 25,
    description: 'Camp is for those that need to get aerials for dance, pom, cheer, etc. ',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
      innerText: "Register For Clinic",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_backhandspring.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '15%', }} />,
    Subject: "Focused Tumbling Clinic Back Handspring",
    StartTime: new Date(2025, 11, 6, 14, 30),
    EndTime: new Date(2025, 11, 6, 15, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 25,
    description: 'Tumbling camp is for Beginners and those that need to get a back handspring or need to clean up and refine their back handspring',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
      innerText: "Register For Clinic",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_back_tuck.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "Focused Tumbling Clinic Back Tucks and Up",
    StartTime: new Date(2025, 11, 6, 15, 30),
    EndTime: new Date(2025, 11, 6, 16, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 25,
    description: 'Tumbling camp for those who need to get a back tuck and above. Requirement of a back handspring without a spot. This will cover from the intermediate level to the most advanced levels.',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
      innerText: "Register For Clinic",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_aerial_cartwheel.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "Focused Tumbling Clinic Aerial",
    StartTime: new Date(2025, 11, 6, 16, 30),
    EndTime: new Date(2025, 11, 6, 17, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 25,
    description: 'Camp is for those that need to get aerials for dance, pom, cheer, etc. ',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/18",
      innerText: "Register For Clinic",
    },
  },
  {
    icon: <img src="/images/camps/silhouette_coed_stunt.png" style={{ ...classes.DauntlessCampIcon, borderRadius: '50%', }} />,
    Subject: "Fearless Flight Clinic",
    StartTime: new Date(2025, 11, 14, 13, 0),
    EndTime: new Date(2025, 11, 14, 14, 30),
    color: "#f01313",
    place: "Dauntless Athletics",
    cost: 150,
    description: 'Fearless Flight Crew Camp at Dauntless if for those who wish to experience a high-flying elite level of coaching and elite level flying. All athletes who wish to participate in this camp must have skill that are at least an intermediate Co-ed level (skills must have are full ups, full arounds, TikToks, and high to high TikToks, if have more than these skills all the better)',
    link: {
      href: "https://app.iclasspro.com/portal/dauntlessathletics/camps/34",
      innerText: "Register For Clinic",
    },
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
    backgroundColor: "#F44336",
  },
  {
    title: "1.5 hours Each Week",
    cost: "$110",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#3a3a3a",
  },
  {
    title: "2 hours Each Week",
    cost: "$130",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#F44336",
  },
  {
    title: "2.5 hours Each Week",
    cost: "$140",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#3a3a3a",
  },
  {
    title: "3 hours Each Week",
    cost: "$150",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#F44336",
  },
  {
    title: "3.5 hours Each Week",
    cost: "$160",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#3a3a3a",
  },
  {
    title: "4 hours Each Week",
    cost: "$170",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#F44336",
  },
  {
    title: "4.5 hours Each Week",
    cost: "$180",
    duration: "Per Month",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#3a3a3a",
  },
  {
    title: "Private Lessons",
    cost: "Varies",
    duration: "Call for Pricing",
    buttonText: "(480) 214-3908",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#F44336",
    optionalTextList: ["Prices vary by coach"],
  },
  {
    title: "Drop-In Rate",
    cost: "Varies",
    duration: "1 - 1.5 Hours",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/classes",
    backgroundColor: "#3a3a3a",
    optionalTextList: ["$35 for 1 hour single class", "$45 for 1.5 hour single class"],
  },
  {
    title: "Tumbling Camp",
    cost: "$69",
    duration: "3 Hours",
    buttonText: "Schedule Now",
    buttonLink: "https://www.iclassprov2.com/parentportal/dauntlessathletics/camps?camptype=1",
    backgroundColor: "#F44336",
    optionalTextList: ["Beginner", "Intermediate", "Advanced", "*Price is per athlete"],
  },
];
